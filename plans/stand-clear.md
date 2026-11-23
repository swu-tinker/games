# Stand Clear: game plan

Stand Clear is a phone game that teaches adults the New York City subway.
Players ride from transfer station to transfer station, answer 10 questions,
and watch their train move along a strip map of the line they're on.

**Status:** Phase 1 is live at
https://swu-tinker.github.io/games/games/stand-clear/
Phase 2 starts when you say go.

## Players learn three things

- **Plan a trip:** pick the right line and direction at each station.
- **Know the lines:** each line's letter or number, its color, and its partners.
- **Know stations by place:** link stations to the neighborhoods around them.

## A ride is 10 questions long

### One turn

1. **Start at Fulton St, on foot.** The 2/3, 4/5, A/C, and J/Z all meet here.
   You aren't on a train yet. The map shows you as a person marker, and the
   sign band says "At Fulton St · Not on a train yet." Pick your first train
   and direction.
2. **Ride.** Your line bullet glides along the map. The track lights up behind
   it. Stops between transfer stations have no questions.
3. **Answer one question** at the next transfer station.
4. **Right answer:** a result card shows the fact. Tap "Keep riding."
5. **Choose:** stay on your train, or transfer to another line and direction.
6. **Wrong answer:** a calm "Not quite" card shows the fact. You keep riding.
   The sign band shows the answer you missed.

### The end of a ride

After the 10th question, the end screen lists every train you rode, from where
you boarded to where you got off. Then a button takes you home. Each ride
starts fresh at Fulton St.

### Questions come in two kinds

Each transfer station gets one question. The game mixes the two kinds.

- **On the way in:** the train holds between stations. The question asks what
  you'll find at the next stop. The sign band hides the line bullets until you
  arrive, so the screen can't give the answer away.
- **At the station:** the bullets show, but the question asks about something
  the screen can't show.

| Topic | Example |
|---|---|
| Lines here | Which line will you be able to switch to at the next stop? |
| Where it goes | Which of these lines takes you to Astoria, Queens? |
| Direction | To reach Harlem from here, go uptown or downtown? |
| Neighborhood | Which neighborhood is this station in? |
| History | That first subway in 1904 ran from City Hall to where? |

### Stay or transfer

- **Stay on** shows your train, its direction, and the next stop.
- **Transfer** opens a picker. Tap a line, then a direction to board.
- **Direction buttons** use the words on real platform signs, like "Uptown,"
  "Downtown & Brooklyn," or "To Jamaica."
- **Turning around** counts as a transfer. Pick your own line and the other
  direction.
- **Last stops** show "Last stop" instead of a direction. "Stay on" disappears
  when your train ends at that station.

### What counts as a transfer station

A transfer station is where two or more line colors meet: lines join, split,
cross, or connect by a passageway. Stops where two colors just share one track
don't count, like the B/C stops on Central Park West. That leaves 63 transfer
stations. Trains also stop at every last stop. The gray S shuttles count as
their own color. The Staten Island Railway is left out, because it
doesn't connect to the subway by track.

## Every fact comes from a named source

The game holds no fact without a source. If two sources disagree, the fact
stays out. I'll list it for you to decide.

| Facts | Source | Who makes it |
|---|---|---|
| Lines, colors, stop order, directions | [MTA schedule data](https://www.mta.info/developers) (called GTFS) | MTA |
| Station names, boroughs, transfers | [MTA Subway Stations and Complexes](https://catalog.data.gov/dataset/mta-subway-stations-and-complexes) | New York State open data |
| Neighborhoods | Labels printed on the official subway map | MTA |
| History | MTA history pages and the New York Transit Museum | MTA and its museum |

### How we keep facts checkable

1. **A script pulls the data.** It downloads the MTA files and turns them into
   the game's fact list. Each fact keeps its source and download date.
2. **You get a spot-check list.** I'll flag the 20 trickiest facts, like
   part-time lines and odd transfers.
3. **Sources live on the home screen.** Question cards stay clean. The home
   screen lists each source and the date of the data.

The MTA changes service a few times a year. To update the game, we rerun the
script. The game teaches weekday daytime service only.

## The look is a bold, square-cornered MTA sign

### Design rules

- **One color, one meaning.** Line colors mean lines only. Right and wrong
  answers use black and white.
- **All corners are square,** like MTA signs. That includes every button.
- **Five text sizes:** 13 for small labels, 16 for body and answers, 20 for
  questions, 28 for station names, and 64 for the title.
- **Direction comes from sign words, not the map.** The map is a strip, so it
  can't point north. Direction buttons say "Uptown · To Woodlawn" with no up
  or down arrow. Your train always moves right on its row, like reading.
- **Type:** Helvetica, the MTA's typeface family. Android phones show Arial.
- **Sound:** none.

### The screen has three layers

1. **Map (back):** a strip map, like the line maps above the doors in a
   subway car. Each train you ride gets its own horizontal row. Track ahead of
   you is light gray, 5 points thick. Ridden track
   is full color, 8 points thick. A ridden L or S gets a thin black outline,
   since its real color is gray.
2. **Sign band (top):** black, with the station name and line bullets.
3. **Card (bottom):** docked at one height, about 300 points. Its content fades
   between steps. It never slides away.

### The strip map

- **Only where you've been and where you're going next.** The strip shows the
  trains you've ridden, up to your next stop. No other lines appear, and no
  transfer details. The map must never answer a question.
- **Each train gets its own row.** Staying on the same train adds to its row.
  A transfer starts a new row 24 points below. Turning around counts as a
  transfer.
- **Old rows fade.** Only the row just above stays on screen, at 35% strength.
- **A transfer shows two circles joined by a short black line.** One circle
  sits on each row, at the station where you switched.
- **Circles mark where the train stops for you.** Each circle is 14 points
  wide, white with a black ring. A circle says "you stop here," not which
  lines meet there.
- **Stops in between** are small white dots.
- **Passed stops turn gray.** The names behind the train fade to gray. The
  next stop stays black.

### Map labels come in two sizes

- **Where you stop:** 16 points.
- **Stops in between:** 13 points.
- **Every label** sits flat above its stop, with a thin white outline.

### Sizes on an iPhone 17e

The design is drawn at 390 by 844 points, the iPhone 17e screen.

| Element | Size |
|---|---|
| Answer rows and direction buttons | 46 tall |
| Line bullets in the picker | 44 |
| Train bullet on the map | 32 |
| Line bullets in the sign band | 24 |

### Home screen

- **Black background.** Every line bullet stands out on it.
- **Contents:** the title, a one-line pitch, all line bullets, and the fact
  sources.
- **Start button:** MTA yellow, square, near the bottom.
- **No motion.** The home screen is still.

### Motion

- **On foot:** a black circle (32 points, 3-point white ring) with a small
  white standing person inside. It shows whenever you aren't on a train,
  like at the start. A future walking mode will use it too.
- **Boarding:** the person marker shrinks away, the line bullet pops in, and
  then the ride starts.
- **Ride:** the bullet glides stop by stop, about 1.2 seconds per stop. The
  track lights up behind it. Tapping the map skips ahead.
- **Sign band while riding:** it works like a train announcement. "Next stop"
  always means the very next station. At each stop it says "This is."
- **Your stop:** the card names the stop where the game stops for you, and how
  many stops away it is.
- **Camera:** locked. Your train stays in one spot. The map moves only while
  the train moves.
- **Card:** content fades between steps.
- **Arrival:** line bullets appear in the sign band all at once, with no animation.
- **Wrong answer:** the train pulls in and a calm "Not quite" card shows the fact.
- **Transfer:** the camera and train slide down to the new row.
- **End of ride:** the end screen lists every train you rode.

The game ignores the iPhone's Reduce Motion setting, so everyone sees the full
motion. That's a known trade-off. Some players who get dizzy from motion may
find it uncomfortable.

## Fact stops bring in history

- **A fact stop is a station with a good story.** Each one has one history
  question, with a source from the MTA or the Transit Museum.
- **Regular stations can be fact stops.** The train stops there once per ride.
  The sign says "Station stop." After the answer, the train keeps going.
- **Transfer stations can have facts too.** There, the fact takes turns with
  the data questions, about half the time.
- **One fact stop per stretch.** After a fact stop, the train runs on to the
  next transfer station. This keeps rides moving.
- **If two sources disagree, the fact stays out.**

## We'll build it in three phases

Each phase is playable and published before the next one starts.

| Phase | What you can do when it's done |
|---|---|
| 1. Ride and data questions | The strip map, riding, transfers, and the 10-question ride. Questions built from MTA data: "Lines here," "Where it goes," and "Direction." The "Not quite" card and the end screen. |
| 2. Neighborhood questions | Questions sourced from the neighborhood labels on the official subway map. |
| 3. History and polish | History questions and final checks on every screen. |

## Notes for the build

- Folder: `games/stand-clear/`. One self-contained HTML file.
- All data is packed into the file. The game loads nothing from the internet.
- Nothing is saved between rides.
- Ideas we dropped: four game modes, Rush hour, missions, the passport and
  stamps, the clock, night and weekend service, sound, and home screen motion.

## Choices I made for you

Tell me if any of these are wrong.

1. **Progress:** the question tag shows "Question 3 of 10."
2. **Wrong answers count.** Every question counts toward the 10, right or wrong.
3. **The end screen shows a score.** It says "7 of 10 right," with one dot per
   question in order: filled for right, empty for missed. Two buttons follow:
   "Ride again" (black) and "Back to home" (outlined).
4. **Card height:** questions use size 20 and fit in the 300-point card.
