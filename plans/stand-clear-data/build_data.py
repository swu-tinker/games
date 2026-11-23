"""Build the Stand Clear fact list from MTA open data.

This script reads three downloaded files and writes data.json.
Every fact in data.json keeps the name of its source and the download date.

Run it like this:
    python3 -I build_data.py <download folder> <download date YYYY-MM-DD>

The download folder must hold:
    gtfs/            the unzipped MTA regular subway GTFS feed
                     https://rrgtfsfeeds.s3.amazonaws.com/gtfs_subway.zip
                     (linked from https://www.mta.info/developers)
    stations.csv     data.ny.gov "MTA Subway Stations and Complexes" (5f5g-n3cz)
    stations_detail.csv  data.ny.gov "MTA Subway Stations" (39hk-dx4f)
                     This one holds the words printed on platform signs.
    entrances.csv    data.ny.gov "MTA Subway Entrances and Exits: 2024" (i9wp-a4ja)
                     Running Late uses it to estimate walking times.

"Weekday daytime" here means weekday trips that leave their first stop
between 10 AM and 3 PM. That is the regular midday service. Rush-hour-only
patterns (like the Z train and the 6 and 7 express trains) are left out.
"""
import collections
import csv
import json
import os
import sys

SRC_GTFS = "MTA regular subway schedule data (GTFS), mta.info/developers"
SRC_COMPLEX = "data.ny.gov MTA Subway Stations and Complexes (5f5g-n3cz)"
SRC_STATION = "data.ny.gov MTA Subway Stations (39hk-dx4f)"
SRC_ENTRANCE = "data.ny.gov MTA Subway Entrances and Exits: 2024 (i9wp-a4ja)"

# These routes are left out on purpose.
# SI is the Staten Island Railway. It does not connect to the subway by track.
# FX, 6X, and 7X are rush-hour express versions of the F, 6, and 7.
LEFT_OUT = {"SI", "FX", "6X", "7X"}

# A trip counts as daytime when it leaves its first stop in this hour range.
DAY_START, DAY_END = 10, 15

# A pattern with a different last stop is kept when it carries this share of
# the route's daytime trips in that direction. Smaller ones are short trips.
MIN_SHARE = 0.2


def read(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


# Running Late splits each kind of day into parts. Each part is
# [name, day, hours]. A trip belongs to the part where it leaves its first
# stop. Late night is 1 to 5 AM. From 5 AM full service is starting up, and
# trips after midnight still belong to the evening before. Weekend days have
# no rush hours.
BANDS = [
    ["Weekday late night", "Weekday", [1, 2, 3, 4]],
    ["Weekday morning rush", "Weekday", [5, 6, 7, 8, 9]],
    ["Weekday midday", "Weekday", [10, 11, 12, 13, 14, 15]],
    ["Weekday evening rush", "Weekday", [16, 17, 18, 19]],
    ["Weekday evening", "Weekday", [20, 21, 22, 23, 0]],
    ["Saturday late night", "Saturday", [1, 2, 3, 4]],
    ["Saturday morning", "Saturday", [5, 6, 7, 8, 9]],
    ["Saturday daytime", "Saturday", list(range(10, 20))],
    ["Saturday evening", "Saturday", [20, 21, 22, 23, 0]],
    ["Sunday late night", "Sunday", [1, 2, 3, 4]],
    ["Sunday morning", "Sunday", [5, 6, 7, 8, 9]],
    ["Sunday daytime", "Sunday", list(range(10, 20))],
    ["Sunday evening", "Sunday", [20, 21, 22, 23, 0]],
]

# The weekend Rockaway Park shuttle runs extra trips under these service names.
# Only the ones for the current dates count.
EXTRA_SERVICE = {
    "Saturday-H-20260908-20261031": "Saturday",
    "Sunday-H-20260908-20261031": "Sunday",
}


def secs(t):
    h, m, s = (int(x) for x in t.split(":"))
    return h * 3600 + m * 60 + s


def build_late(g, trips_raw, routes):
    """Find which trains run in each part of the day, how often, and how long
    each hop between stations takes. Times are the middle value of all trips."""
    day_of = {"Weekday": "Weekday", "Saturday": "Saturday", "Sunday": "Sunday", **EXTRA_SERVICE}
    trips = {
        t["trip_id"]: t
        for t in trips_raw
        if t["service_id"] in day_of and t["route_id"] in routes
    }
    seqs = collections.defaultdict(list)
    with open(os.path.join(g, "stop_times.txt"), newline="") as f:
        for row in csv.DictReader(f):
            if row["trip_id"] in trips:
                seqs[row["trip_id"]].append(
                    (int(row["stop_sequence"]), row["stop_id"], secs(row["departure_time"]))
                )

    # Each trip lands in one part of one day.
    found = collections.defaultdict(lambda: collections.defaultdict(list))
    heads = {}
    for tid, rows in seqs.items():
        rows.sort()
        t = trips[tid]
        hour = (rows[0][2] // 3600) % 24
        band = next(i for i, b in enumerate(BANDS)
                    if b[1] == day_of[t["service_id"]] and hour in b[2])
        direction = rows[-1][1][-1]
        stops = tuple(s[1][:-1] for s in rows)
        hops = [rows[k + 1][2] - rows[k][2] for k in range(len(rows) - 1)]
        found[band][(t["route_id"], direction, stops)].append(hops)
        heads[(t["route_id"], direction, stops)] = t["trip_headsign"]

    pat_index, pats, hop_index, hop_pool = {}, [], {}, []
    svc = []
    for band, b in enumerate(BANDS):
        hours = len(b[2])
        groups = collections.defaultdict(dict)
        for (rid, d, stops), runs in found[band].items():
            groups[(rid, d)][stops] = runs
        rows = []
        for (rid, d), c in sorted(groups.items()):
            total = sum(len(v) for v in c.values())
            # Longer patterns go first. A shorter trip that runs inside a kept
            # pattern adds its trains to that pattern instead of standing alone.
            kept = []
            for stops in sorted(c, key=lambda s: (-len(s), -len(c[s]))):
                joined = "|" + "|".join(stops) + "|"
                home = next((k for k in kept if joined in "|" + "|".join(k[0]) + "|"), None)
                if home:
                    home[1] += len(c[stops])
                elif len(c[stops]) / total >= MIN_SHARE:
                    kept.append([stops, len(c[stops])])
            for stops, n in kept:
                # A pattern needs at least one train an hour to count as service.
                if n < hours:
                    continue
                key = (rid, d, stops)
                if key not in pat_index:
                    pat_index[key] = len(pats)
                    pats.append([rid, d, heads[key], list(stops)])
                runs = c[stops]
                hops = []
                for k in range(len(stops) - 1):
                    vals = sorted(r[k] for r in runs)
                    # Times are kept in half minutes.
                    hops.append(max(1, round(vals[len(vals) // 2] / 30)))
                hops = tuple(hops)
                if hops not in hop_index:
                    hop_index[hops] = len(hop_pool)
                    hop_pool.append(list(hops))
                headway = round(hours * 60 / n * 2) / 2
                rows.append([pat_index[key], headway, hop_index[hops]])
        svc.append(rows)
    return {"bands": BANDS, "pat": pats, "svc": svc, "hops": hop_pool}


def build_tabs(late, stations):
    """Group each complex's platforms into at most three tabs, named by the
    words on the platform signs."""
    # A platform is a station plus a direction. It counts if any train leaves it.
    leaves = collections.defaultdict(collections.Counter)
    for p in late["pat"]:
        for sid in p[3][:-1]:
            leaves[(sid, p[1])][p[2]] += 1
    by_cx = collections.defaultdict(list)
    for (sid, d), heads in leaves.items():
        st = stations[sid]
        word = st["north"] if d == "N" else st["south"]
        if not word:
            word = "Northbound" if d == "N" else "Southbound"
        # A "Last Stop" sign on a platform with trains means the trains turn back.
        if word == "Last Stop":
            word = "To " + heads.most_common(1)[0][0]
        by_cx[st["complex"]].append((word, sid + d, d))
    tabs = {}
    for cid, plats in by_cx.items():
        groups = {}
        for word, plat, d in plats:
            g = groups.setdefault(word, {"names": [word], "plats": [], "dirs": collections.Counter()})
            g["plats"].append(plat)
            g["dirs"][d] += 1
        groups = list(groups.values())
        while len(groups) > 3:
            groups.sort(key=lambda g: len(g["plats"]))
            small = groups.pop(0)
            d = small["dirs"].most_common(1)[0][0]
            same = [g for g in groups if g["dirs"][d]] or groups
            big = max(same, key=lambda g: len(g["plats"]))
            big["names"] += small["names"]
            big["plats"] += small["plats"]
            big["dirs"] += small["dirs"]
        # Northbound tabs come first, then southbound. Bigger tabs lead each side.
        groups.sort(key=lambda g: (g["dirs"]["N"] < g["dirs"]["S"], -len(g["plats"])))
        # "Uptown" or "Downtown" leads a joined name, like "Uptown & Queens".
        main_word = ("Uptown", "Downtown", "Manhattan")
        tabs[cid] = [[" & ".join(sorted(g["names"], key=lambda n: n not in main_word)), sorted(g["plats"])]
                     for g in groups]
    return tabs


# People walk about 80 meters a minute. Streets add a quarter to the straight
# line. Each walk adds a minute at each end for stairs.
WALK_M_PER_MIN = 80
DETOUR = 1.25
STAIRS_MIN = 2
WALK_MAX_MIN = 15
# An entrance this far from its own station is a mistake in the file, so it is dropped.
ENTRANCE_MAX_M = 400


def build_walks(entrances_raw, stations, complexes):
    """Estimate walking minutes between nearby complexes, from entrance to entrance."""
    import math

    def meters(a, b):
        dy = (a[0] - b[0]) * 111320
        dx = (a[1] - b[1]) * 111320 * math.cos(math.radians(a[0]))
        return math.hypot(dx, dy)

    # The file's Complex ID column is wrong for a few entrances. Union Sq entrances
    # carry Herald Sq's number, and 61 St-Woodside entrances carry the numbers of
    # other 7 stops. The GTFS Stop ID column is right, so entrances join by that.
    pts = collections.defaultdict(list)
    for e in entrances_raw:
        if e["Entry Allowed"] != "YES" and e["Exit Allowed"] != "YES":
            continue
        # A few shared stations list two stop IDs, like "718; R09". Both sit in one complex.
        s = stations.get(e["GTFS Stop ID"].split(";")[0].strip())
        if not s:
            continue
        p = (float(e["Entrance Latitude"]), float(e["Entrance Longitude"]))
        if meters(p, (s["lat"], s["lon"])) <= ENTRANCE_MAX_M:
            pts[s["complex"]].append(p)
    for cid, c in complexes.items():
        if not pts[cid]:
            pts[cid] = [(stations[s]["lat"], stations[s]["lon"]) for s in c["stations"]]

    ids = sorted(complexes)
    walks = collections.defaultdict(list)
    for i, a in enumerate(ids):
        for b in ids[i + 1:]:
            # A quick check on the first points skips pairs that are far apart.
            if meters(pts[a][0], pts[b][0]) > 3000:
                continue
            m = min(meters(p, q) for p in pts[a] for q in pts[b])
            mins = round(m * DETOUR / WALK_M_PER_MIN + STAIRS_MIN)
            if mins <= WALK_MAX_MIN:
                walks[a].append([b, mins])
                walks[b].append([a, mins])
    return {k: sorted(v, key=lambda x: x[1]) for k, v in walks.items()}


def main(folder, date):
    g = os.path.join(folder, "gtfs")
    feed = read(os.path.join(g, "feed_info.txt"))[0]
    routes_raw = read(os.path.join(g, "routes.txt"))
    stops_raw = read(os.path.join(g, "stops.txt"))
    trips_raw = read(os.path.join(g, "trips.txt"))
    complexes_raw = read(os.path.join(folder, "stations.csv"))
    detail_raw = read(os.path.join(folder, "stations_detail.csv"))
    entrances_raw = read(os.path.join(folder, "entrances.csv"))

    # Routes and their official colors.
    routes = {}
    for r in routes_raw:
        if r["route_id"] in LEFT_OUT:
            continue
        routes[r["route_id"]] = {
            "id": r["route_id"],
            "bullet": r["route_short_name"],
            "name": r["route_long_name"],
            "color": "#" + r["route_color"].upper(),
            "text": "#" + (r["route_text_color"] or "FFFFFF").upper(),
            "src": SRC_GTFS,
        }

    # Weekday trips for the routes we keep.
    trips = {
        t["trip_id"]: t
        for t in trips_raw
        if t["service_id"] == "Weekday" and t["route_id"] in routes
    }
    seqs = collections.defaultdict(list)
    with open(os.path.join(g, "stop_times.txt"), newline="") as f:
        for row in csv.DictReader(f):
            if row["trip_id"] in trips:
                seqs[row["trip_id"]].append(
                    (int(row["stop_sequence"]), row["stop_id"], row["departure_time"])
                )

    # Count each stop pattern per route and direction.
    counts = collections.defaultdict(collections.Counter)
    heads = {}
    for tid, rows in seqs.items():
        rows.sort()
        hour = int(rows[0][2].split(":")[0])
        if not (DAY_START <= hour < DAY_END):
            continue
        t = trips[tid]
        direction = rows[-1][1][-1]  # Platform stop IDs end in N or S.
        stops = tuple(s[1][:-1] for s in rows)
        counts[(t["route_id"], direction)][stops] += 1
        heads[(t["route_id"], direction, stops)] = t["trip_headsign"]

    patterns = []
    for (rid, d), c in sorted(counts.items()):
        total = sum(c.values())
        # Keep the most common pattern for each pair of end stations.
        best = {}
        for stops, n in c.most_common():
            key = (stops[0], stops[-1])
            if key not in best:
                best[key] = [stops, 0]
            best[key][1] += n
        kept = []
        # Longer patterns go first so shorter ones inside them get dropped.
        for stops, n in sorted(best.values(), key=lambda x: -len(x[0])):
            if n / total < MIN_SHARE:
                continue
            # Drop short trips that only cover part of a longer kept pattern.
            joined = "|" + "|".join(stops) + "|"
            if any(joined in "|" + "|".join(k[0]) + "|" for k in kept):
                continue
            kept.append((stops, n))
        for stops, n in kept:
            patterns.append({
                "route": rid,
                "dir": d,
                "stops": list(stops),
                "headsign": heads[(rid, d, stops)],
                "share": round(n / total, 2),
                "src": SRC_GTFS,
            })

    # Running Late needs every hour of service, so it reads the schedule again.
    late = build_late(g, trips_raw, routes)

    # Stations: one per GTFS parent stop.
    used = {s for p in patterns for s in p["stops"]}
    used |= {s for p in late["pat"] for s in p[3]}
    detail = {r["GTFS Stop ID"]: r for r in detail_raw}
    stops = {s["stop_id"]: s for s in stops_raw if s["location_type"] == "1"}
    stations = {}
    for sid in sorted(used):
        s = stops[sid]
        d = detail.get(sid, {})
        stations[sid] = {
            "id": sid,
            "name": s["stop_name"],
            "lat": float(s["stop_lat"]),
            "lon": float(s["stop_lon"]),
            "complex": d.get("Complex ID"),
            "north": d.get("North Direction Label"),
            "south": d.get("South Direction Label"),
            "borough": d.get("Borough"),
            "src": [SRC_GTFS, SRC_STATION],
        }

    # Complexes: stations joined by free transfers inside one station.
    cx_rows = {r["Complex ID"]: r for r in complexes_raw}
    complexes = {}
    for sid, st in stations.items():
        cid = st["complex"]
        row = cx_rows.get(cid, {})
        c = complexes.setdefault(cid, {
            "id": cid,
            "name": row.get("Stop Name") or st["name"],
            "display": row.get("Display Name"),
            "borough": row.get("Borough"),
            "daytime_routes": row.get("Daytime Routes"),
            "stations": [],
            "routes": set(),
            "src": SRC_COMPLEX,
        })
        c["stations"].append(sid)
    for p in patterns:
        for sid in p["stops"]:
            complexes[stations[sid]["complex"]]["routes"].add(p["route"])

    # A transfer station is where two or more line colors meet.
    # The S shuttles count as their own color, apart from the gray L.
    def family(rid):
        return "S" if routes[rid]["bullet"] == "S" else routes[rid]["color"]

    # Lines only "meet" when they join, split, cross, or connect by a
    # passageway. A one-platform stop where every line has the same stops
    # before and after it is just a shared track, so it doesn't count.
    around = collections.defaultdict(lambda: collections.defaultdict(set))
    for p in patterns:
        s = p["stops"]
        for i, sid in enumerate(s):
            prev = s[i - 1] if i > 0 else "-"
            nxt = s[i + 1] if i + 1 < len(s) else "-"
            around[sid][p["route"]].add("|".join(sorted([prev, nxt])))

    def shared_track_only(c):
        if len(c["stations"]) != 1:
            return False
        sid = c["stations"][0]
        sigs = {";".join(sorted(v)) for v in around[sid].values()}
        return len(sigs) == 1

    for c in complexes.values():
        c["routes"] = sorted(c["routes"])
        c["families"] = sorted({family(r) for r in c["routes"]})
        c["transfer"] = len(c["families"]) >= 2 and not shared_track_only(c)

    # Running Late's platform tabs and walks.
    late["tabs"] = build_tabs(late, stations)
    late["walks"] = build_walks(entrances_raw, stations, complexes)
    late["sources"] = [SRC_GTFS, SRC_STATION, SRC_ENTRANCE]

    # Terminals are the first and last stops of each kept pattern.
    terminals = sorted({p["stops"][0] for p in patterns} | {p["stops"][-1] for p in patterns})

    out = {
        "downloaded": date,
        "feed": {
            "version": feed["feed_version"],
            "start": feed["feed_start_date"],
            "end": feed["feed_end_date"],
        },
        "rule": "Weekday trips that leave their first stop between 10 AM and 3 PM.",
        "sources": [SRC_GTFS, SRC_COMPLEX, SRC_STATION],
        "routes": routes,
        "patterns": patterns,
        "stations": stations,
        "complexes": complexes,
        "terminals": terminals,
        "late": late,
    }
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, "data.json"), "w") as f:
        json.dump(out, f, indent=1)
    print(len(routes), "routes,", len(patterns), "patterns,", len(stations), "stations,",
          len(complexes), "complexes,", sum(c["transfer"] for c in complexes.values()), "transfer")
    print("Running Late:", len(late["pat"]), "patterns,", len(late["hops"]), "hop lists,",
          sum(len(v) for v in late["walks"].values()) // 2, "walks")


def walks_only(entrances_path):
    """Rebuild only the walks in data.json from a fresh entrances.csv."""
    here = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(here, "data.json")
    with open(path) as f:
        out = json.load(f)
    out["late"]["walks"] = build_walks(read(entrances_path), out["stations"], out["complexes"])
    with open(path, "w") as f:
        json.dump(out, f, indent=1)
    print(sum(len(v) for v in out["late"]["walks"].values()) // 2, "walks")


# Run "python3 -I build_data.py --walks <entrances.csv>" to rebuild only the walks.
if __name__ == "__main__":
    if sys.argv[1] == "--walks":
        walks_only(sys.argv[2])
    else:
        main(sys.argv[1], sys.argv[2])
