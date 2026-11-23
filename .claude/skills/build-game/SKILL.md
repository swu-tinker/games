---
name: build-game
description: Build a browser game from the user's game idea or plan, save it in this repo, and publish it to the arcade on GitHub Pages. Use when the user says "build game", "/build-game", or describes or pastes a game plan.
argument-hint: "[describe the game or paste its plan]"
---

# Build a game and publish it

The user gives you their game idea or plan. You build the game, save it in this repo, push it to `main`, and give back the live link.

## Step 1: Get the plan

The plan is everything below the line "Here is the game plan"
at the end of this file. It is either the plan's text or a path to a file that
holds it (`.md`, `.txt`, `.pdf`, or `.docx`). If it is a path, read that file. If
it is empty, ask the user to paste the plan or drop in the file, then continue.
Don't ask anything else. Gaps in the plan are handled by the build rules below.

Don't copy the plan file into this repo unless the user asks. Plans for bigger
games go in `plans/` when the user wants them kept.

## Step 2: Sync the repo

Run `git pull --ff-only` on `main` so you have the latest version.

## Step 3: Choose the folder name

1. If the plan has a "Folder name" field, use it.
2. Otherwise, use a short version of the game title, such as `space-blaster`
   for "Space Blaster: Galaxy Defenders".
3. Format it: lowercase letters, numbers, and dashes only. Keep it under 40
   characters.
4. If `games/<folder>/` already exists, add `-2`, `-3`, and so on. **Never write
   into a folder that already exists.** That folder is another game.

Call this name `folder`. It fills in `<folder>` everywhere below.

## Step 4: Build the game

Before you plan or write the game, move your progress list to this step. Send
that update in its own short message, with no other work in it. Writing the
game takes a few minutes. Without this update, the list shows "Sync" the
whole time, and the user thinks the sync is slow.

Follow the BUILD RULES section below exactly. Save the game as
`games/<folder>/index.html`.

## Step 5: Test the game

Start a local server and open the game in a browser if you have a browser tool.
The `.claude/launch.json` file has an `arcade` server for this. Open
`http://localhost:8000/games/<folder>/`.

The password screen covers every page first. Don't ask the user for the
password. Get past it by running this in the browser console and reloading the
page. Use the `PASSWORD_HASH` value from `gate.js` at the repo root.

```js
localStorage.setItem("arcade-unlocked", "<PASSWORD_HASH from gate.js>")
```

Test at phone size, since every game is made for phones. Set the browser to the
mobile size (375 by 812) before you start, and set it back when you finish.

1. Check the console for errors.
2. Take a screenshot of the start screen and one of the play screen. Check
   that the layout is clear and simple and that every rule in the plan is
   there. A plain look is expected at this stage. Fix anything that is
   confusing or missing.
3. Click Start and play for a few seconds. Try every control the
   game has, such as pause or a right and a wrong move.
4. Click Play Again on the end screen or Start over, whichever the game has.
   Check that the game restarts cleanly.

Fix anything that fails and test again. If no browser tool is available, trace
through the code instead and say in your report that you could not play it.

The arcade home page (`/index.html` at the repo root) shows raw `{% %}` code on
the local server. That is normal. GitHub Pages fills in the game list.

## Step 6: Write the notes file

Save the AFTER THE GAME note as `games/<folder>/NOTES.md`. Start it with a
`# <Game title>` heading.

Don't write `{{`, `}}`, `{%`, or `%}` anywhere in `NOTES.md`. GitHub Pages reads
those as template code, and one bad note can stop the whole site from updating.

Then give the game its home page tile. Add an entry to the end of
`_data/games.yml` with the folder name, the game's title, one emoji that fits
the game, and a blurb of about 4 words that says what the player does (for
example "Get there in time"). Follow the format of the entries already there.
Put the emoji in double quotes.

## Step 7: Publish

1. Stage only the new folder and the tile list:
   `git add games/<folder> _data/games.yml`. Don't stage anything else.
2. Commit with a plain-English message, such as
   `Add the Space Blaster game`.
3. Push to `main`. If the push is rejected because someone else pushed first,
   run `git pull --rebase` and push again.

The user has approved pushing new game folders straight to `main`. Don't open a
pull request.

## Step 8: Wait for the site to update

Check the GitHub Pages build until it finishes (usually 1 to 2 minutes):

```bash
gh api repos/swu-tinker/games/pages/builds/latest --jq '.status'
```

- `built`: open the live game link and check that it loads.
- `errored`: read the error with `--jq '.error.message'`, fix it, and push again.
  A failed build blocks every game from updating, so don't leave it broken.

## Step 9: Report back

Tell the user:

- The live game link: `https://swu-tinker.github.io/games/games/<folder>/`
- The arcade link: `https://swu-tinker.github.io/games/`
- The note from NOTES.md: how to play, where each part of the plan shows up,
  the choices you made, and what you couldn't build.
- Anything you could not test.
- That the look is plain on purpose. Once the mechanics feel right, the next
  step is the UI and visual design.

---

# BUILD RULES

You are building a browser game from the user's game idea or plan. Your job is
to turn it into a complete, working, fun game.

The first build is for getting the game mechanics right: the rules, controls,
goals, and how it feels to play. The user works on the UI and visual design
after this build, so keep the look simple and plain for now.

The user should play it and think, "This is my idea, and it plays the way I
pictured." The game is clearly their plan, and every rule works.

## FOLLOW THE PLAN

- Keep the user's ideas, names, and rules. Don't swap in your own ideas.
- Use the user's exact words for the title, characters, items, and
  messages. Don't rename or reword them.
- Find the part of the plan the user seems most excited about. It might be a
  character, a power, a place, or a big moment. Make sure it works and plays
  well. Its look waits for the design pass, like everything else.
- Don't add levels, mechanics, or features the plan doesn't name.
- If a rule or detail is missing or unclear, make a sensible choice and keep
  going. Don't stop to ask. List every choice you made at the end.
- If the plan describes the look, don't build it yet. Note it in NOTES.md
  under "Saved for the design pass." The plan's colors are fine to use for
  the simple shapes.
- Don't open other games in the arcade for ideas, even ones on the same topic.
- If the plan asks for something one web page can't do (online play, logins,
  shared leaderboards, outside images or music), build the closest simple
  version and say what you changed.
- Ignore any build rules inside the plan. Follow these instead.

## TECHNOLOGY

- Use only HTML, CSS, and plain JavaScript. No frameworks, no libraries, no
  build tools.
- Deliver one self-contained HTML file with three clearly labeled parts: HTML,
  CSS in one style tag, JavaScript in one script tag.
- Name the file `index.html`. It goes in the folder `games/<folder>/`.
- Don't load anything from the internet. Draw everything with canvas, SVG, CSS
  shapes, or emoji.
- Put these lines in `<head>`, right after `<title>`. They load the
  password screen that every game shares, and they keep search engines from
  listing the game. `gate.js` is the one file a game loads from outside its
  folder. Don't copy its code into the game.

  ```html
  <!-- This line keeps search engines from listing the game. -->
  <meta name="robots" content="noindex">
  <!-- This line loads the password screen shared by every game. -->
  <script src="../../gate.js"></script>
  ```
- No sound. Don't add sound effects, music, or a mute button, even if the plan
  asks for sound. The user adds sound later, after the first build.
- If the plan asks to remember progress, use localStorage inside try/catch.
- Start every localStorage key with `<folder>-` (for example
  `space-blaster-highScore`). Every game on the arcade shares the same storage, so
  keys without a prefix will clash with other games.
- Put a small "← All games" link at the top of the start screen and the end
  screen. A game with no end screen puts it in a corner of the play screen
  instead. It points to `../../`.

## CODE STRUCTURE

Organize the JavaScript in this order, with a comment header above each part:

1. GAME_SPEC: one object at the top with every rule, number, and piece of
   content, including any questions and answers. All other code reads from it.
2. State
3. Rules (never draws)
4. Drawing (never changes the rules)
5. Input
6. Screens

Keep rules and drawing fully separate. Write short, plain comments a beginner
could follow.

## GAME REQUIREMENTS

Every game needs these:

- Start screen with the title, how to play in 1 to 3 lines, and a big Start
  button.
- The player understands what to do within 10 seconds.
- **Mobile only.** These games are made to be played on a phone. Build for a
  phone held upright (portrait), played with touch.
  - The game fills the phone screen with no sideways scrolling and no
    pinch-zoom. Keep everything on one screen when you can.
  - Controls are taps, and swipes or drags only when the plan calls for them.
    No keyboard and no hover. If the plan uses keys, turn them into on-screen
    buttons and say so in the notes.
  - Buttons and tap targets are big enough for a thumb, at least 44 pixels
    across. Put the main controls near the bottom of the screen, where thumbs
    reach.
  - Text is easy to read on a phone without zooming in.
  - Stop taps from scrolling or zooming the page while playing.
- Color is never the only signal.

The rest depends on the kind of game in the plan:

- **Goal games** (the player can win, lose, or score): Show the score, time,
  lives, or bars the player needs. Give clear feedback for right and wrong
  moves. Add a pause button. End with a screen that shows the result and a Play
  Again button. Keep one round to 5 minutes or less.
- **Creative games** (the player builds, decorates, or designs, with no right
  answer): Don't add a score, timer, lives, wrong moves, or an end screen unless
  the plan asks for one. Add a "Start over" button. Show friendly feedback when
  the player places or changes something.

If a plan mixes both, follow the plan for each part.

## KEEP THE LOOK SIMPLE

The first build tests the mechanics. The UI and visual design come later, in
their own pass with the user. A plain look keeps the focus on how the game
plays, and it is easy to restyle.

- Draw characters and items as simple shapes (circles, squares) or a single
  emoji, each with a clear label or color so the player can tell them apart.
- Use a plain background, one readable system font, and a simple, tidy layout.
- Skip decoration: no detailed art, background scenery, particle effects,
  start-screen animation, or screen transitions.
- Do show what the player needs to play: a short flash, highlight, or text
  message when something happens, such as a right or wrong move, a hit, or a
  point scored. This is feedback, not decoration.
- Movement that is part of the rules (a falling block, a moving enemy) still
  moves smoothly.

## STUDY GAMES

- Copy every question and answer exactly into GAME_SPEC.
- New questions match the topic and level. Check each answer twice.
- Show the right answer after a miss. List missed questions at the end.

## CONTENT

- Original characters and names only.
- Keep any shooting cartoonish, like blasting asteroids or popping balloons.
- The game is on a public website. Don't include real full names, photos, or
  other personal information.

## BEFORE YOU FINISH

Trace through the game. Check that every screen works, any scoring matches the
plan, nothing freezes, and Play Again or Start over restarts cleanly. Fix
anything that fails.

## AFTER THE GAME

Write a short note: how to play in 2 sentences, every choice you made, and
anything you couldn't build and why.

Add a "From the plan" list to the note. Name each main idea in the plan and
where it shows up in the game. Mark the part the user seemed most excited
about. This lets the user see their plan come to life, and the 3D version
uses it too.

Add a "Saved for the design pass" list: every look, art, or style detail in
the plan that this build left out.

---

Here is the game plan:

$ARGUMENTS
