# Running Late: plan

Running Late is a second way to play Stand Clear. Each round drops you at a
random station with a story, a deadline, and a problem along the way. You win
if you get there in time.

**Status:** Phases 1, 2, and 3 are live in `games/stand-clear/`. The home
screen offers "40 Stories" and "Free Play" under a "Running Late" label.

**Phase 1 choices the user made:** each round has a simple goal station with no
deadline. Rounds start at a random hour on a random day. The made-up note sits
under the Running Late button.

**Phase 2 choices the user made (2026-10-25):**

- **Warning comes a stop early.** The problem card appears when the train stops
  at the station just before the problem. The player can still get off.
- **The problem follows the player.** It starts on the fastest route. If the
  player boards a train off that route, the problem moves onto that train's way
  ahead. It moves only until the player has seen it. After that, it stays put.
- **The deadline comes after the problem.** First place the problem. Then find
  the fastest way around it. Then add 5 to 10 spare minutes.
- **Cards use plain text until Phase 3.** The start card says "Be at Jamaica by
  2:00 PM." The arrival card says "On time." The time-up card says "Out of
  time," plus the hint.
- **The problem card is the "Where to next?" card with stripes.** The
  announcement sits at the top in quotes. The three choices stay the same: stay
  on, change trains, or walk. For a suspended line, staying on means riding to
  the last stop before the gap.
- **Delays give a rough length,** like "We expect to move in about 10
  minutes." The real delay lands within a few minutes of that.
- **Build order:** first the deadline, the arrival card, and the delay problem.
  The user tries it. Then the other three problems. Then publish.
- **No wrong-way alert (2026-10-25).** The user cut it as too hard. A wrong-way
  train just costs time, like any slow choice.
- **Time up ends the round (2026-10-25).** When the clock reaches the deadline
  without the player at the goal, the round stops right away. The player can't
  keep riding. The card says "Out of time" and gives the hint.

**Read first:** `plans/stand-clear.md` is the plan for the main game, which is
already live in `games/stand-clear/`. Running Late follows every main game rule
unless this file says otherwise.

## A round is one trip with a deadline

1. **Story card.** It sets the stakes, like a birthday party in Harlem at
   2:00 PM. A "Let's go" button closes the card.
2. **You start on foot.** The person marker stands at a random station. The
   sign band says "Not on a train yet." The clock shows the start time but
   doesn't move yet.
3. **Pick a platform, then a train.** Platform tabs show each direction's next
   trains, like real countdown clocks.
4. **The clock starts when you tap your first train.** The wait for that train
   is the first time that counts.
5. **Ride.** The clock runs as you go.
6. **Something goes wrong.** A conductor-style announcement appears on a
   hazard-striped card. You choose: wait, transfer, or walk.
7. **Arrive or run out of time.** Reaching the goal in time shows "On time"
   with the story's ending. If the clock hits the deadline first, the round
   stops and shows "Out of time" with the late ending.

Each round is one trip to one destination. This mode has no quiz questions. The
choices are the test.

## Platform tabs show one direction at a time

The card shows one platform at a time, like standing on a real platform.

> **Which platform?**
> [ Uptown ] [ Downtown & Brooklyn ]
>
> *Next trains on this platform*
> 2 · Wakefield–241 St · 4 min
> 4 · Woodlawn · 6 min
> A · Inwood–207 St · 8 min
> 3 · Harlem–148 St · 9 min

The last stops above are sample values. The real ones come from MTA data.

- **No tab is selected at first.** A dashed box says "Pick a platform to see its
  trains." The game doesn't nudge you either way.
- **Tab names come from real platform signs,** read from the MTA data. Most
  stations get two tabs.
- **Lines that don't run uptown or downtown get their own tab** at big hubs,
  like "To Jamaica" at Fulton St. No station gets more than three tabs.
- **Each tab shows its next 4 trains,** soonest first.
- **Each row names the train's last stop.** That's how real countdown clocks
  label trains. It's also the main clue for picking the right direction.
- **Every station works this way.** The same tabs appear at each transfer.

## The clock counts game minutes

Time only moves when you act. Players can think as long as they like.

| Action | Where the minutes come from |
|---|---|
| Riding | MTA schedule data: minutes between stations |
| Waiting | MTA schedule data: how often each line runs at that hour |
| Walking | Distance between station entrances, from state data. These are estimates. |

The sign band shows the actual time big, like "1:23 PM," at 28 points. Beside
it, smaller, are the deadline and the countdown:

- **Plenty of time:** "45 min left"
- **One minute left:** "1 min left"
- **At the deadline:** "Due now"
- **After that:** the round ends. The countdown says "Time's up."

## A round ends when you arrive or time runs out

The last card is the whole ending. There's no separate end screen.

> **✓ On time** · arrived 1:52 PM
> Grandma waves you over. You made it before the candles.
>
> [ Play again ] [ Home ]

> **✕ Out of time** · it's 2:00 PM, and you're at Canal St
> They started singing without you. You'll hear about it.
> **Faster:** walk to the A at Chambers St. You'd have arrived at 1:52 PM.
>
> [ Play again ] [ Home ]

The endings above are placeholders. Real endings use the voice in the stories
section below.

- **Out-of-time endings get one hint line.** The route finder writes it. It
  names the first place the player's trip and the best trip split, plus the
  best arrival time. The pattern is "**Faster:** [what to do] at [station].
  You'd have arrived at [time]." Wrong-direction mistakes get hints too, like
  "**Faster:** take the 2 uptown from Fulton St."
- **On-time endings get no hint.**
- **A round number** sits at the bottom in small gray text, like "Round 4827."
  The same number must rebuild the same round, so bugs can be replayed.

## The game makes every round

### How a round gets made

1. **Deal a story** from the shuffled deck. The story sets the time window
   and the allowed problems.
2. **Pick a time** inside the story's window.
3. **Pick a goal station** anywhere, the same way Phase 1 does. A story names
   its own goal stations only when it needs a certain place, like the beach.
4. **Pick a start station** that needs at least one transfer to reach the goal.
5. **Find the best route** with the route finder, using that hour's service.
6. **Place one problem** on the best route, from the story's allowed list.
7. **Set the deadline** to the fastest time around the problem, plus 5 to 10
   spare minutes, chosen at random. A winning route always exists.

### Rules that keep rounds interesting

- **The goal needs at least one transfer.** No one-train trips.
- **The problem lands on the fastest route.** Otherwise it changes nothing.
- **Problems must fit the tracks.** "Express runs local" only happens on lines
  with both kinds of track. Problems only hit lines running at that hour.
- **One problem per round.**
- **No hints during the round.** The only hint comes after time runs out.

### Four kinds of problems

- **Delay:** "We're being held for a signal problem ahead."
- **Line suspended:** "No N trains between Canal St and 34 St."
- **Express runs local:** "D trains are making all local stops."
- **Station skipped:** "N trains are skipping 14 St–Union Sq."

How each one works in the game, as built on 2026-10-25:

- **Delay:** the train is held at the warning station. Every train of that
  line going that way waits there too.
- **Line suspended:** the train ends at the stop after the warning. No trains
  of that line run through the next 3 stops, either way.
- **Express runs local:** from the warning station, the train makes a real
  local line's stops for up to 3 of its usual stops, with that line's times.
- **Station skipped:** the skipped stop is a transfer station on the player's
  way. Trains of that line pass it without stopping, either way.

Announcements read like a conductor talking, in calm, plain words with no
jokes. Write original wording in that style. Don't copy real MTA recordings.
The game has no sound, so announcements show as text in quotes.

Every problem is made up. The home screen says so: "Service changes in Running
Late are made up. Lines, stops, and times are real." Problem cards don't repeat
this note.

## Stories are written in a dry, deadpan voice

Write 40 story templates. Each one sets the stakes for a round, and its endings
pay them off. The game fills in the blanks.

### Voice rules

- **Say funny things in a flat, plain voice.** Report what happened. Don't
  point at the joke.
- **Understate everything.** Big moments get described as small ones.
- **No exclamation marks** and no big reactions, like cheering or crying.
- **End on a flat line,** often the shortest sentence.
- **Never mean to the player.** Late endings poke fun at the situation, not at
  the player's subway skills.
- **Keep sentences short,** under 15 words where possible.

### What each template has

- **When:** a time window, like "weekday, 8:00 to 8:45 AM."
- **Problems allowed:** the kinds of problems that fit that hour.
- **Story:** 3 to 5 short sentences, with blanks in square brackets.
- **Two endings:** one for "On time," one for "Out of time."
- **Goal stations,** only when the story needs a certain place. Otherwise the
  game picks any station, and the story just names it.

The goal is always a specific station. Stories don't name neighborhoods.

### The 40 stories live in their own file

`plans/stand-clear-stories.md` holds all 40 templates. The user approved
stories 1 to 3 on 2026-10-25. Stories 4 to 40 are drafts for the user to read.

### Stories are dealt like a shuffled deck

- **No story repeats** until all 40 are played. Then the deck reshuffles.
- **Every player gets a different order.** Nobody works through 1 to 40.
- **Details change every time.** The time, goal, start station, and problem
  vary, so even a repeated story is a new trip.
- **The browser remembers the deck.** It saves only a list of played story
  numbers, under a localStorage key starting with `stand-clear-`. Nothing else
  is saved, and nothing leaves the browser. This is the one exception to the
  main game's "nothing is saved" rule. The user approved it.

## Walking connects nearby stations

- **From any station,** players can walk to stations within about 15 minutes.
- **Walking time** is estimated from the distance between station entrances.
- **On the map,** a walk is a black dotted line. The marker turns back into the
  person while walking.

## Running Late uses the main game's strip map

The strip map shows only where you've been and where you're going next. Running
Late keeps that rule:

- **Each train gets its own row.** A transfer starts a new row, like in the
  main game.
- **A walk gets its own row too,** drawn as a black dotted line.
- **The map never shows other options.** Players have to know the subway to
  find a way around a problem.

## The look follows every main game rule

- **Square corners** everywhere, including the platform tabs.
- **Black and white** for on time and late, and for the selected tab. No line
  colors.
- **Five text sizes:** 13, 16, 20, 28, and 64.
- **Hazard stripes** mark problem cards: a black-and-white striped border. Only
  problem cards use them.
- **Home screen:** see "Running Late comes in two ways to play" below.
- **Platform tabs are only in Running Late.** The main game keeps its
  line-then-direction picker.

## Running Late comes in two ways to play

The user chose these on 2026-10-25. Both use the same engine: the random
start, the route finder, one problem, and the deadline.

| | Running Late: 40 Stories | Running Late Free Play |
|---|---|---|
| What it is | A dealt story sets each round | What Phase 2 built, as it is |
| Time of day | Inside the story's time window | Any hour, any day |
| Problem | One the story allows | Any of the four |
| Start card | The story's text | "Be at [goal] by [deadline]." |
| End card | The story's ending, plus the hint if out of time | "On time," or "Out of time" plus the hint |
| Round number | Yes, small and gray at the bottom | Yes, the same |

### The home screen groups the two under the tour

1. **"Start at Fulton St"** stays the big yellow button, first.
2. **A small "Running Late" label** sits below it, in gray 13-point text.
3. **"40 Stories"** comes next, as a white outlined button. A small gray line
   on it counts progress, like "7 of 40 played."
4. **"Free Play"** comes last, as a white outlined button.
5. **The made-up note** stays under the buttons.

The full names are still "Running Late: 40 Stories" and "Running Late Free
Play." The label carries the first half, so the buttons stay short.

- **Stories come before Free Play** because stories are the main way to play.
- **The count comes from the deck** the browser already remembers. Nothing new
  is saved.
- **After all 40,** the count shows "40 of 40 played" until the next story
  starts. Then the deck reshuffles and the count starts over.

## Running Late needs more data than the main game

The main game teaches weekday daytime service only. Running Late needs:

- **Every hour of service:** rush hour, midday, evenings, late nights, and
  weekends. This includes late-night route changes.
- **Ride times** between stations, by hour.
- **How often each line runs,** by hour, for wait times.
- **Each train's last stop,** by hour, for the countdown rows.
- **Platform sign words** for each station, for the tab names.
- **Station entrance locations,** for walking times.

These come from the same sources as the main game: the MTA schedule data
(GTFS) at mta.info/developers, and New York State open data on data.ny.gov. The
subway entrances dataset on data.ny.gov has entrance locations. Extend the main
game's data script rather than writing a new one. The file will get bigger.
Check that it still loads fast on a phone.

## Build it in three phases

| Phase | What players can do when it's done |
|---|---|
| 1. Clock and travel | Start on foot at a random station. Platform tabs, riding, waiting, transfers, walking, and a running clock. No problems or stories yet. |
| 2. Problems and deadlines | The route finder, deadlines, the four problem types, the arrival card, time up, and the hint. |
| 3. Stories | The 40 Stories mode with all 40 templates, story endings, the shuffled deck, and the progress count. Free Play keeps Phase 2's plain cards. Both get the round number and the new home screen. |

## Notes for the builder

- **The user** is a teacher and designer, not an engineer. Explain things in
  plain English, with short sentences.
- **Teach design as you go.** Before asking any visual question, explain the
  design idea behind it in a few sentences. Then give options with a
  recommendation.
- **Where it lives:** add Running Late to the existing game in
  `games/stand-clear/index.html`. Keep it one self-contained file that loads
  nothing from the internet.
- **Sizes:** design at 390 by 844 points, the iPhone 17e screen.
- **Facts:** every line, stop, time, and direction must come from the sources
  above. Stories and problems are fiction. Goals are always stations.
- **Testing:** follow the testing steps in `.claude/skills/build-game/SKILL.md`.
- **Publishing:** ask the user before pushing to `main`.
- **Markdown:** don't write double curly braces or curly-brace-percent pairs in
  Markdown files. GitHub Pages reads them as template code.

## Decisions already made

- **Build timing:** whenever the user says.
- **Round length:** one trip to one destination.
- **Stories:** write all 40 before Phase 3 ships. The user wants to read them.
- **Made-up note:** the home screen line is enough.
- **No feedback button.** Players judge for themselves whether a round felt
  realistic.
- **No end screen** beyond the arrival card.
- **No sound.**
