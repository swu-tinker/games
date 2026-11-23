# Meet Me in the Middle: plan

Meet Me in the Middle is a third way to play Stand Clear. The player moves two friends,
Jooma and Shu Shu, through the subway until they meet at the same station.

**Status:** v1 went live 2026-10-26 with one fixed round. Next is v2:
random rounds (see "v2: every Play deals a random round"). v2 is planned, not
built. Build it only after the user says go.

**This mode is free play only (2026-10-26).** It has no stories and no fixed
rounds. Every tap on "Play" deals a new round. The start card gives the plain
facts, and the player meets anywhere before the time runs out.

**Home screen:** a gray "Meet Me in the Middle" label sits above a "Play"
button, which reads "Get Jooma and Shu Shu together." This matches how the
Running Late label sits above its buttons.

**Read first:** `plans/stand-clear.md` and `plans/stand-clear-running-late.md`.
Meet Me in the Middle follows every Running Late rule unless this file says otherwise.

## A round is two trips that end in one meetup

1. **Start card.** It gives the plain facts, like Free Play: the day and time,
   where each friend starts, and the meet-by time.
   "Meet anywhere" is said out loud, because there is no goal station.
2. **Both friends start on foot.** Each one stands at their own station, in
   their own lane.
3. **Jooma moves first.** The player picks a platform and a train for Jooma.
4. **Then Shu Shu moves.** The player picks a platform and a train for Shu Shu.
5. **The clock starts when the first train is tapped,** the same as Running
   Late.
6. **Both trains ride at once.** The clock runs until one friend reaches a
   stop that needs a choice.
7. **The friends meet** when both stand at the same station at the same time.
   The round ends with "Together" and a score.
8. **Or time runs out.** The round stops right away, the same as Running Late.

## The player moves both friends

- **Turns come from time, not taking turns.** The friend whose train reaches
  a stop first decides first. The same friend can decide twice in a row.
- **The clock stops while the player decides.** It runs again after the tap.
- **Each friend has the Running Late moves:** board a train, stay on, get off,
  transfer, or walk to another station.
- **"Wait here" is new.** A friend on foot can stay put while the clock runs.
  The game hands the turn to the other friend.
- **"Move" wakes a waiting friend (2026-10-26).** While the clock runs,
  a waiting friend's row on the card has a full-width "Move" button,
  in the same spot as a riding friend's "Get off at" button. A tap stops the
  clock where it is and opens that friend's platform card. Before this, a
  waiting friend stayed stuck until the other friend also got off and waited.
- **A near-miss does not stop play.** If both trains stop at the same station
  and nobody gets off, the friends miss each other. The game says "So close!"
  and play goes on.

## A round stays short: about 3 choices per friend

A round should take about 1.5 to 2 minutes to play. That matches a typical
Running Late story. Claude measured this on 2026-10-26 from 120 Running Late
rounds. A typical one asks for about 5 or 6 choices.

A choice is boarding a train, or a "stay on?" stop at a transfer station. The
game picks start stations so each friend needs **about 3 choices** to reach the
best meetup. Three rules make that happen:

- **Close starts.** Each friend reaches the best meeting station in about 15
  minutes of game time or less.
- **One transfer at most** for each friend on the best route, with no walks.
- **No shared line.** No single line serves both start stations. Otherwise one
  friend could just ride to the other.

Two more rules keep a round from dragging:

- **A tight deadline.** Meet-by is the fastest meetup plus about 10 minutes,
  rounded up to a time ending in 0 or 5. Time running out ends the round.
- **Quick waits.** When one friend waits, the clock speeds through the wait.

There is no limit on moves. The clock already limits the round.

## Each round ends one of two ways

- **The friends meet.** The end card says "Together" and how many minutes
  were left to spare.
- **Time runs out.** The end card says "Out of time" and names one good
  meeting spot.

A round has no score of its own. It used to show 1 to 3 dots for minutes to
spare. The user removed them on 2026-10-26, because nothing on screen
explained them. The scoreboard of met and missed runs is the only score.

## The scoreboard counts met and missed runs

Both end cards show a scoreboard under the result, above the buttons. The user
added it on 2026-10-26 as the last piece of v1.

- **Two counts:** how many runs the friends met, and how many they missed.
- **It saves in the player's browser only,** under the key
  `stand-clear-meet-scores`. Another phone or browser starts at zero.
- **The count this run added gets a small "+1" tag.** The counts have no boxes
  or fills. Boxed and filled shapes mean buttons in this game.
- **Each round counts once,** even if its end card is drawn again.
- **The share of runs met** sits under the counts, like "50% met." A cheeky
  line used to follow it. The user removed that line on 2026-10-26.

## The friends' icons are the people

The tennis ball and the spiral stand for the friends everywhere. The game uses
no person icon in this mode (decided 2026-10-26). On foot or walking, the
friend's icon is the marker on the track. On a train, the line bullet is the
marker and the friend's icon sits below it.

## The characters are objects, not people

| Friend | Icon | Motion |
|---|---|---|
| Jooma (he/him) | A white tennis ball with two black seams | Bounces twice |
| Shu Shu | A black spiral line, no fill | Spins twice |

- **Black and white only.** Color means subway lines in Stand Clear. A
  yellow-green tennis ball would look like the N or the G.
- **The icons are not letters.** Train bullets already use letters.
- **The icons are not faces.** Each friend is one simple object.
- **The motion plays once,** for about one second, when that friend's turn
  starts. Then the icon holds still while the player decides.
- **At the meetup, both play their motions together.**
- **Reduce Motion:** if the phone asks for less motion, the icons skip their
  motions. The brighter lane and the card title still show whose turn it is.

## The screen

The screen keeps Stand Clear's three layers: the black sign band on top, the
map in the middle, and the fixed-height card at the bottom.

### The map has two lanes

- **Jooma rides in the top lane. Shu Shu rides in the bottom lane.**
- **Each lane is a smaller copy of today's strip.** The track runs left to
  right, and the marker stays in the middle of its lane.
- **Both markers always sit one above the other.** When the friends reach the
  same station, the two station names line up.
- **The lane whose turn it is shows at full strength.** The other lane fades
  to the see-through look that old rows use after a transfer today.
- **Both trains move at once** while the clock runs.
- **Every train still heads right,** the same as the rest of the game.
- **A transfer fades in place.** Today a transfer adds a new row below. Two
  lanes leave no room for that, so the new line fades in where the old one was.

### Each friend has two marks

- **On a train, the line bullet is the marker.** The friend's icon sits below
  it and says who.
- **On foot or walking, the friend's icon is the marker.** This mode has no
  person icon.

### "End trip" sits in the sign band

- **"End trip" is a small white underlined link** at the right end of the
  clock line, in the black sign band. That space is empty in this mode.
- **It shows the whole time a round is being played,** even while trains move.
  It hides on the end cards, which have their own "Home" button.
- **Ending a trip goes home and doesn't count** as met or missed on the
  scoreboard. The user chose this on 2026-10-26, knowing it makes the
  scoreboard easier to game.

### The sign band follows the friend whose move it is

- **The clock line** reads like "Fri 6:18 PM · 22 min to meet."
- **The station sign** shows the active friend's station, like "Shu Shu is at
  14 St–Union Sq," with that station's line bullets.

### The card names whose move it is

- **The title** is the friend's badge plus "Jooma's move" or "Shu Shu's move."
- **Choices say what they lead to.** For example, "Get off here" carries the
  note "meet Shu Shu."
- **The card keeps one fixed height.** Long text scrolls instead of growing
  the card. End cards may grow, the same as today.

### Special moments

- **Same station:** when both friends are at one station, a small black tag
  that says "Same station" appears between the lanes.
- **Near-miss:** both trains pull out. The two station names turn gray and
  shrink, like any passed stop. The "Same station" tag becomes "So close!",
  floats up, and fades.
- **Meetup:** the two lanes slide together into one track. The two station
  names become one. Both badges play their motions. A small black heart pops
  up above them.
- **End cards (option A, chosen 2026-10-26):**
  - **The title is "Together" or "Out of time," at 20 points,** the same size
    as Running Late's end cards. The user shrank it from 28 on 2026-10-26.
  - **Together adds one line:** "They met with 7 minutes to spare." The
    station is left out, because the sign band and the map already name it. Out of time has no extra line. The user removed "They
    didn't meet by 8:05 PM" as unneeded.
  - **One row per friend:** icon, name, the trains they rode, and where they
    ended up: "arrived 7:58," or "near Canal St" when time ran out. Two rides in
    a row on the same line show as one bullet.
  - **Out of time also names the fastest meetup.**
  - **The scoreboard is one smaller line:** "Your runs," then "1 met +1 · 0
    missed · 100%." Then "Play again" and "Home."
  - **The sign band:** on a meetup, the clock line stops counting down and says
    "met with 7 min to spare." When time runs out, the clock line says "Time's
    up," and the sign reads "Jooma and Shu Shu are / Still apart."

## v2: every Play deals a random round

v2 replaces the fixed v1 round below. Everything else stays the same: the two
lanes, the shared clock, the special moments, the end cards, and the
scoreboard. Only where the friends start and when change.

### How the game picks a round

1. **Pick a day.** The weights match Running Late's Free Play: weekday 60%,
   Saturday 20%, Sunday 20%.
2. **Pick a start time from 7:00 AM to 9:59 PM.** Busy hours only, so trains
   come often enough to plan with. The user chose this on 2026-10-26.
   Late nights may come later as a harder option.
3. **Pick a start station for Jooma.** It needs at least one train leaving it
   at that hour.
4. **Find a start for Shu Shu that passes every rule:**
   - No single line serves both start stations.
   - The two stations are 4 to 10 km apart, as the crow flies.
   - The fastest meetup is 15 minutes or less from the start time.
   - Each friend needs one transfer at most on their best route, with no walks.
   - Each friend needs 2 to 4 choices on their best route. A choice is
     boarding a train, or a "stay on?" stop at a transfer station.
   - The two friends reach the best meeting station within 4 minutes of each
     other.
   - The best meeting station is not either start station.
5. **If no station passes, try again** with a new Jooma station. After 40
   tries, pick a new day and time.
6. **Set the meet-by time:** the fastest meetup plus about 10 minutes, rounded
   up to a time ending in 0 or 5.

**One difficulty level.** Every round aims for about 3 choices per friend.
The user chose this on 2026-10-26. A hard level may come later.

**Round numbers.** Each round comes from a round number, like Running Late.
The same number always rebuilds the same round. The console logs it, so a
strange round can be found again. "Play again" deals a new round.

**Speed.** Each check runs the route finder, which takes about 7 milliseconds.
The distance check runs first and skips most stations, so a round should take
well under a second to pick.

### "Get off at the next stop"

Random rounds will often have good meeting spots that aren't transfer
stations, like Astor Pl. Today a train only stops for a choice at transfer
stations, at its last stop, and where the other friend stands.

- **While the clock runs,** the card shows one row per friend. Each riding
  friend's row gets a "Get off at [next stop]" button, the same words Running
  Late uses.
- **A tap makes that friend's train stop at its next stop,** and that friend
  gets the "Where to next?" card there.
- **This needs a mockup first,** because two rows with buttons must fit the
  fixed card height.

### Testing before the user plays

- **Build 200 random rounds** and measure each one: choices per friend, game
  minutes, and the best meeting spot.
- **The goal is about 2 minutes of real time per round,** the same as a
  typical Running Late story.
- **Report the spread** to the user: the shortest, typical, and longest rounds.
- **Play several rounds at phone size,** including a short phone.

### Build order

1. The round picker and the round number, with the start card filled from it.
2. The 200-round test. Tune the rules if rounds run long.
3. A mockup of the "Get off" buttons. Build them after the user picks one.
4. The user plays and fixes the UI.

## The v1 round (replaced in v2)

The v1 round was the same every time it was played.

- **Day and time:** Friday, 6:00 PM, during the weekday evening rush.
- **Jooma starts** on foot at 5 Av/59 St. The N, R, and W stop there.
- **Shu Shu starts** on foot at East Broadway. Only the F stops there.
- **Meet by:** 6:25 PM.
- **Train times** come from the real schedule data the game already uses.
- **No service problems in v1.** The round tests the two-lane UI first.

The game's own route finder picked these starts on 2026-10-26. The fastest
meetup is at 6:13 PM, so the best player has 12 minutes to spare.

| Meeting station | Jooma arrives | Shu Shu arrives |
|---|---|---|
| 14 St–Union Sq | 6:12 | 6:13 |
| Astor Pl | 6:13 | 6:12 |
| W 4 St–Wash Sq | 6:14 | 6:10 |
| 34 St–Penn Station | 6:10 | 6:14 |

Several stations work, so the round has more than one right answer. The
best routes to 14 St–Union Sq take 3 choices each:

- **Jooma:** board the W to Lexington Av/59 St. Change to the 4. Stay on at
  Grand Central–42 St. Get off at 14 St–Union Sq.
- **Shu Shu:** board the F. Stay on at Delancey St–Essex St. Get off at
  Broadway-Lafayette St and change to the 6 at Bleecker St. Get off at
  14 St–Union Sq.

Times change a little with which train the player catches. Recheck them with
the route finder when building.

The start card reads: "It's Friday, 6:00 PM. Jooma is at 5 Av/59 St. Shu Shu
is at East Broadway. Meet anywhere by 6:25 PM."

## How to open it

The home screen's "Play" button opens it. A link that ends in
`#meet-me-in-the-middle` also opens it straight away, such as
`games/stand-clear/index.html#meet-me-in-the-middle`.

## Open questions

- **The near-miss note and the clock.** The sign band has a fixed height. In
  the near-miss mockup, the "So close!" note pushed the clock out. The clock
  must stay visible. One fix is to let the note replace the station label for
  a few seconds. Another is to put the note on the card. A side-by-side sketch
  would settle it.

## Later, not in v2

- Late-night rounds, maybe as a harder option.
- A hard level, with two transfers or a tighter deadline.
- Service problems, like Running Late's delays.
- A bonus for meeting on the same train.
- Texts from the other friend in the middle of a ride.

## Build notes for an engineer

- **The map code assumes one train.** The strip state, the trail, the camera,
  and the train marker are all single globals. Two lanes need one of each per
  friend. Keep Running Late and Just ride working the same as today.
- **Lane height:** the map area is about 250 points tall on a full-size phone,
  and less on a short one. Each lane gets about half. Check the short-phone
  layout (screens under 740 points tall) early.
- **Test at phone size.** Stand Clear is played on phone browsers.
- **localStorage keys** start with `stand-clear-`, like every other key in
  this game.
- **The v1 build order was:**
  1. Two lanes that ride both friends on one clock, with the fixed v1 round.
  2. Turn handoff: the sign band, the card title, the fading lane, and the
     badge motions.
  3. The meetup, the near-miss, and the end card.
  4. The user plays it and fixes the UI before anything else is added.
