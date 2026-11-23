# Stand Clear

Ride the New York City subway from station to station and answer 10 questions
along the way. You start on foot at Fulton St, pick a train, and stop at each
transfer station to answer a question and choose where to go next.

## How it works

- **The strip map** shows only the train you're on, from its last stop to its
  next one. It never shows other lines, so it can't give away an answer.
- **Three kinds of questions,** all built from MTA data:
  - Lines here: which line can you switch to at the next stop?
  - Where it goes: which line runs to a given last stop?
  - Direction: which platform sign do you follow to reach a stop?
- **Right answers** show a fact. **Wrong answers** close the doors, and the
  train rides on to its next stop.
- **After 10 questions,** the end screen lists every train you rode. There is
  no score.

## Running Late

Running Late is a second way to play. Each round drops you at a random station
with a goal station and a deadline. It comes in two forms, under a "Running
Late" label on the home screen:

- **40 Stories:** each round is dealt from a deck of 40 short stories, like a
  job interview or Grandma's ninetieth birthday. The story sets the day, the
  hour, and which problems can happen. Its ending plays on the last card. No
  story repeats until all 40 are played. The button counts how many you've
  played.
- **Free Play:** any hour of any day, any problem, and plain cards.

Both work the same way once the round starts:

- **The clock** starts when you pick your first train. It only moves when you
  wait, ride, or walk, so you can think as long as you like.
- **The deadline** sits beside the clock with a countdown, like "25 min left."
- **One problem** happens each round. A striped card gives the news one stop
  before it hits. You choose to stay on, change trains, or walk. There are
  four kinds:
  - **Delay:** your train is held for a rough number of minutes.
  - **Line suspended:** your train ends early, and no trains of that line run
    through the next few stops, either way.
  - **Station skipped:** trains of that line pass a transfer station you need
    without stopping.
  - **Express runs local:** your train makes the local line's stops for a
    while, so it slows down.
- **The problem follows you.** The game puts it on the fastest trip. If you
  take a different train, it moves to that train.
- **The deadline is fair.** The game finds the fastest way around the problem
  and adds 5 to 10 spare minutes. A player who handles it well can always make
  it.
- **Time up ends the round.** If the clock reaches the deadline first, the
  train stops and the card says "Out of time." The card names the round's
  problem, like "6 trains going downtown were held 12 min at 116 St." A delay
  shows its real length, not the rough one announced. The card's "Fastest way" tip
  keeps you on your train unless changing saves 5 minutes or more. It stays
  on only if the trip still beats the deadline. Walks in a row show as one
  walk. When the tip takes a line back the way it came, it says so with the
  platform sign's words, like "6 back toward The Bronx." It gives one hint: the first
  place your trip and the fastest trip split.
- **Platform tabs** show one platform's next 4 trains at a time, like real
  countdown clocks. Each row names the train's last stop. The list always
  includes the train the fastest trip needs.
- **Going the wrong way is allowed.** The game never warns you. Get off and
  pick the other platform to turn around.
- **Walking** is the last tab on the platform card. It goes to stations within
  about 15 minutes. A walk shows as a black dotted row on the strip map.
- **Reaching the goal in time** shows "On time."
- **Each end card shows a round number,** like "Story 12 · Round 4827." The
  same number rebuilds the same round, which helps track down bugs.

## Where the facts come from

- MTA weekday schedule data (GTFS) from mta.info: lines, colors, stops, and
  directions. It covers weekday trips that leave between 10 AM and 3 PM.
- data.ny.gov MTA Subway Stations and Complexes, and MTA Subway Stations:
  station names, transfers, and the words on platform signs.
- Running Late uses every hour of the MTA schedule: weekdays, Saturdays, and
  Sundays, including late nights. Ride times are the middle value of all trips
  in that part of the day. Wait times come from how many trains run then.
- data.ny.gov MTA Subway Entrances and Exits: 2024: entrance spots, for walking
  times. Walks are estimates: the straight line between the closest entrances,
  plus a quarter for streets, plus 2 minutes for stairs. The file gives a few
  entrances the wrong station number, like Union Sq entrances marked as Herald
  Sq. So the game matches each entrance by its stop instead. It also drops any
  entrance more than 400 meters from its own station.

The data was downloaded October 25, 2026. The entrance file was downloaded
again October 26, 2026. The MTA schedule file runs through
October 31, 2026. A script in the planning folder rebuilds the data when the
MTA posts a new schedule.

## Choices made

- A transfer station is where lines of two or more colors join, split, cross,
  or connect by a passageway. That gives 63 stations.
- The tour leaves out the Z, the diamond 6, and the diamond 7. They run only at
  rush hour. Running Late keeps the Z at rush hour but still leaves out the
  diamond 6 and 7.
- Running Late trains run at even gaps. Real trains bunch up, so real waits
  vary more.
- Problems are made up. A delay holds every train of one line going one way
  at one station. The real delay lands 2 minutes shorter to 3 minutes longer
  than the announcement says.
- A suspension closes 3 stops past the train's new last stop. Skips and
  suspensions hit both directions. Express-runs-local hits one direction.
- A local run uses the stops and times of a real local line on the same track,
  from the MTA schedule.
- In Running Late, late night means 1 to 5 AM.
- Neighborhood and history questions come later. They need sources that
  aren't pulled yet.
- The browser saves one thing: the list of story numbers already played, under
  `stand-clear-played`. If the browser blocks saving, the deck still works but
  forgets between visits.
- There is no sound.
