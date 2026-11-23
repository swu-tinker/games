---
name: make-3d
description: Turn a 2D game from the arcade into a 3D version, save it in its own folder, and publish it to GitHub Pages. Use when the user says "make 3d", "/make-3d", or asks to turn a game into 3D.
argument-hint: "[game folder name, such as space-blaster]"
---

# Make a 3D version of a game and publish it

The user names a 2D game that is already in the arcade. You
build a 3D version of it in a new folder, push it to `main`, and give back the
live link. The 2D game stays exactly as it is.

## What is in this folder

- `three.min.js` is the Three.js 3D library (version r186), packed into one
  file. It sets `THREE` for the game to use. It is MIT licensed, and its
  license note sits at the top of the file.
- `add_three.py` pastes that library into a game's `index.html`. Each game
  carries its own copy, so it still loads nothing from the internet.

## Step 1: Find the 2D game

The game is named below the line "Here is the game to turn into 3D" at the end
of this file. It is a folder name, a path, a live link, or a game title. Match
it to a folder in `games/`. If it is empty or matches no folder, list the
folders in `games/` and ask which one.

Call that folder `source`. Read `games/<source>/index.html` and
`games/<source>/NOTES.md` if there is one. **Only read them. Never change
anything inside `games/<source>/`.** The 2D game stays as it is.

If `source` is already a 3D game (it holds the `THREE.JS LIBRARY START` line),
tell the user and stop.

## Step 2: Sync the repo

Run `git pull --ff-only` on `main` so you have the latest version.

## Step 3: Choose the folder name

1. Start with `<source>-3d`, such as `space-blaster-3d`.
2. If `games/<source>-3d/` already exists, add `-2`, `-3`, and so on. **Never
   write into a folder that already exists.**

Call this name `folder`. It fills in `<folder>` everywhere below.

## Step 4: Build the 3D game

Follow the 3D BUILD RULES below. Save the game as `games/<folder>/index.html`.
Write only your own code into it. Don't paste the library in by hand.

## Step 5: Add the library

Run:

```bash
python3 .claude/skills/make-3d/add_three.py games/<folder>/index.html
```

This adds about 730 KB to the end of the file. Run it again after any edit that
rewrites the whole file. Edits to your own code don't need it again.

**Don't read the library part of the file.** It is about 4,000 lines of packed
code and fills up your memory for nothing. Your code ends at the line
`THREE.JS LIBRARY START`. Find that line number with
`grep -n "THREE.JS LIBRARY START" games/<folder>/index.html` and read only the
lines above it. Search only those lines too, such as
`head -n <line> games/<folder>/index.html | grep -n "camera"`. A plain search of
the whole file also matches the library and floods the output.

## Step 6: Test the game

Start the `arcade` server from `.claude/launch.json` and open
`http://localhost:8000/games/<folder>/`.

The password screen covers every page first. Don't ask the user for the
password. Get past it by running this in the browser console and reloading the
page. Use the `PASSWORD_HASH` value from `gate.js` at the repo root.

```js
localStorage.setItem("arcade-unlocked", "<PASSWORD_HASH from gate.js>")
```

1. Check the console for errors.
2. Take a screenshot and look at it. Check that the 3D scene shows up, that the
   player's pieces are easy to see, and that nothing is too dark or cut off.
   Compare it with the 2D game. A player of the 2D game should recognize every
   piece. The main character should look better than in 2D, not worse.
3. Click Start and play for a few seconds. Try every control the
   game has, such as pause or a right and a wrong move.
4. Click Play Again on the end screen or Start over, whichever the game has.
   Check that the game restarts cleanly.

Fix anything that fails and test again. If no browser tool is available, trace
through the code instead and say in your report that you could not play it.

## Step 7: Write the notes file

Save the AFTER THE GAME note as `games/<folder>/NOTES.md`. Start it with a
`# <Game title> 3D` heading.

Don't write `{{`, `}}`, `{%`, or `%}` anywhere in `NOTES.md`. GitHub Pages reads
those as template code, and one bad note can stop the whole site from updating.

Then give the game its home page tile. Add an entry to the end of
`_data/games.yml` for the new `<folder>-3d` folder. Copy the 2D game's entry
and add " 3D" to the title. Follow the format of the entries already there.

## Step 8: Publish

1. Stage only the new folder and the tile list:
   `git add games/<folder> _data/games.yml`. Don't stage anything else.
2. Commit with a plain-English message, such as
   `Add a 3D version of the Space Blaster game`.
3. Push to `main`. If the push is rejected because someone else pushed first,
   run `git pull --rebase` and push again.

The user has approved pushing new game folders straight to `main`. Don't open a
pull request.

## Step 9: Wait for the site to update

Check the GitHub Pages build until it finishes (usually 1 to 2 minutes):

```bash
gh api repos/swu-tinker/swu-games/pages/builds/latest --jq '.status'
```

- `built`: open the live game link and check that it loads.
- `errored`: read the error with `--jq '.error.message'`, fix it, and push again.
  A failed build blocks every game from updating, so don't leave it broken.

## Step 10: Report back

Tell the user:

- The live 3D game link: `https://swu-tinker.github.io/swu-games/games/<folder>/`
- The arcade link: `https://swu-tinker.github.io/swu-games/`
- The note from NOTES.md: what looks different in 3D, what each emoji became,
  and any rule you had to change.
- Anything you could not test.

---

# 3D BUILD RULES

You are turning one of the user's 2D browser games into 3D. The 3D version
must be the same game, only with
depth, light, and shadow.

The user should see their own game come alive in 3D and be proud of it.
Every piece should still be theirs, and it should look better than before.

## KEEP THE ORIGINAL GAME

- Read the "From the plan" list in the 2D game's NOTES.md if there is one. It
  marks the part the user cared about most. Give that part the most care in
  3D.

- Keep the title, rules, scoring, lives, timers, questions, words, colors, and
  characters from the 2D game. Copy GAME_SPEC across and change only what 3D
  needs, such as sizes or the camera.
- Keep the controls the same. A player who knows the 2D game can play the 3D one
  right away.
- Turn each flat shape into the closest 3D shape. A circle becomes a sphere, a
  rectangle becomes a box, and a star becomes a star with thickness. Emoji
  follow the EMOJI IN THE 3D WORLD rules below.
- If a rule must change to work in 3D, make the smallest change and list it in
  the notes.
- Don't add new game ideas. 3D is the only change.
- Some games are mostly buttons, text, or lists, such as quizzes and design
  games. Keep those parts as normal HTML and add 3D where it helps, such as a 3D
  scene behind the questions or 3D pieces in a design space. Say what you chose
  in the notes.

## TECHNOLOGY

- Deliver one self-contained HTML file named `index.html` in `games/<folder>/`.
  It has three clearly labeled parts: HTML, CSS in one style tag, and JavaScript
  in one `<script type="module">` tag. The game code must use `type="module"`.
  This makes the browser wait for the library at the bottom of the page.
- Use the global `THREE` for 3D. Don't use `import`. Don't load anything from
  the internet. Use no other libraries.
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
- Build every object from Three.js shapes, such as `BoxGeometry`,
  `SphereGeometry`, `CylinderGeometry`, `ExtrudeGeometry`, and groups of them.
  There are no model, image, or font files. For text or an emoji token inside
  the scene, draw it on a small canvas (256 by 256 pixels keeps it sharp) and
  use a `CanvasTexture`.
- Keep the score, lives, buttons, start screen, pause screen, and end screen as
  HTML on top of the 3D canvas. Don't draw them in 3D. HTML text is sharper and
  easier to read.
- Don't add sound. If the 2D game has sound and a mute button, keep them the
  same. If it has no sound, the 3D version has none either.
- Start every localStorage key with `<folder>-` (for example
  `space-blaster-3d-highScore`). Use try/catch around every read and write.
- Put a small "← All games" link at the top of the start screen and the end
  screen. A game with no end screen puts it in a corner of the play screen
  instead. It points to `../../`. Add a "Play the 2D version" link next to it
  that points to `../<source>/`.

## EMOJI IN THE 3D WORLD

Many games use emoji for their characters and items. A flat emoji in a
3D world has no depth or shadow, so the game looks unfinished. The emoji were
chosen on purpose, though. Keep the original idea, and only change
how it is drawn.

Go through every emoji the 2D game draws in the play area. Decide each one in
this order:

1. **Build it from 3D shapes when people will recognize it.** Do this first
   for the hero, the enemies, and the main goal. Keep the emoji's idea, colors,
   and size. Examples: 🐸 becomes a green frog of rounded shapes with two big
   eyes, 👻 becomes a white ghost with a wavy bottom, 🪙 becomes a gold coin, and
   🚀 becomes a rocket from a cone, a cylinder, and fins. Use 3 to 10 simple
   shapes in a group for most things. The hero and the part the user cared
   about most can use up to 20. Give them details with personality, like eyes,
   a face, or a small idle bounce. Keep every shape clear and easy to read.
2. **Use a 3D token when shapes can't build it well.** Some emoji are too
   detailed for simple shapes, such as faces, food, clothes, and flags. Put
   these emoji on a token: a thick, round disc, like a game piece, with the
   emoji printed on the face toward the camera. Build it from a short
   `CylinderGeometry` with the emoji on a `CanvasTexture` on its flat face. The
   token has depth, shading, and a shadow, and the player still sees the
   original emoji. Turn the token to face the camera each frame.
3. **Leave emoji outside the play area as they are.** Emoji in the score,
   lives, buttons, and messages are HTML text on top of the scene, not part of
   the 3D world.

Keep each 3D version the same size as the emoji's hit area in the rules, so a
catch or a crash still looks right. If the same emoji appears many times, such
as coins or dots, build it once and reuse its geometry and material for every
copy.

## 3D SCENE

- Pick the camera view that fits the 2D game. A top-down game gets a tabletop
  view from above and in front. A side-view game gets a side view with depth.
  A game where the player travels through a world can use a camera that
  follows behind the player. The camera can be fixed or follow the player
  smoothly. Don't use mouse-look or pointer lock. The player must understand
  what to do within 10 seconds.
- Light the scene with one soft light that fills everything (`HemisphereLight`
  or `AmbientLight`) and one `DirectionalLight` for shading. Shadows are
  optional. Use them on one light only.
- Take the light colors and the sky or background from the 2D game's colors
  and theme. A night game gets cool, dim light. A candy game gets warm, bright
  light. Fog or a color fade in the distance adds depth.
- Make the play area clear, with a floor or walls that show where the edges
  are.
- The player's pieces and goals must stand out from the background. Use bright
  colors and size. Color is never the only signal.
- Keep the camera calm. Avoid camera shake and spinning cameras. If the
  player's device asks for reduced motion (`prefers-reduced-motion`), turn off
  any extra motion that is only for show.

## MAKE IT FEEL FINISHED

Polish makes the game look its best in 3D. It never adds rules,
levels, goals, or characters the 2D game doesn't have.

- Give characters a little life, like a gentle bob, a blink, or a turn toward
  where they move.
- Make important actions feel good. Each one gets a short animation and a
  small 3D effect, like a burst of pieces or a pop in size. Bigger moments get
  bigger effects.
- Move objects smoothly between positions instead of jumping.
- Let the start screen show the 3D scene behind it, with the main character in
  view.

## KEEP IT FAST ON ORDINARY LAPTOPS

- Create one `WebGLRenderer` with `antialias: true`. Set its pixel ratio to
  `Math.min(window.devicePixelRatio, 2)`.
- Size the renderer to its box on the page, and resize it when the box changes
  size. A `ResizeObserver` does this. Update the camera's `aspect` and call
  `updateProjectionMatrix()` at the same time.
- Keep the scene small: about 200 objects at most. Reuse geometries and
  materials. Remove objects from the scene and call `dispose()` on them when the
  game no longer needs them.
- If the browser can't do 3D (`WebGLRenderer` throws an error), show a friendly
  message with a link to the 2D version instead of a blank screen.

## CODE STRUCTURE

Organize the JavaScript in the same order as the 2D game, with a comment header
above each part:

1. GAME_SPEC: one object at the top with every rule, number, and piece of
   content. All other code reads from it.
2. State
3. Rules (never draws)
4. Drawing in 3D (never changes the rules). Split it into three parts: set up
   the scene, make the objects, and move the objects to match the state each
   frame.
5. Input
6. Screens
7. Sound (only if the 2D game has sound)

Keep rules and drawing fully separate. The rules can keep the 2D game's flat
x and y numbers. The drawing part turns those numbers into 3D positions. This
keeps the scoring exactly like the 2D game.

Write short, plain comments a beginner could follow. The first time a 3D word
appears, explain it in plain English. Example: "The camera is the player's eye
in the 3D world."

## GAME REQUIREMENTS

- Start screen with the title, how to play in 1 to 3 lines, and a big Start
  button.
- Keep every screen and control the 2D game has, such as the score, a pause
  button, an end screen with Play Again, or a Start over button. If the 2D game
  has no score or end screen, don't add one.
- Pausing stops the game, and the scene stays still.
- Clear feedback for every action, and for right and wrong moves if the 2D
  game has them.
- Works with a mouse, with touch, and with a keyboard if the 2D game used keys.
- Built for laptop Chrome. Big buttons. Easy-to-read text.

## CONTENT

- Original characters and names only.
- Keep any shooting cartoonish, like blasting asteroids or popping balloons.
- The game is on a public website. Don't include real full names, photos, or
  other personal information.

## BEFORE YOU FINISH

Trace through the game. Check that every screen works, any scoring matches the
2D game, nothing freezes, and Play Again or Start over restarts cleanly. Fix
anything that fails.

## AFTER THE GAME

Write a short note: how to play in 2 sentences, what looks different in 3D, any
rule you changed and why, and anything you couldn't build.

Add an "Emoji in 3D" list to the note. Name each emoji in the play area and
what it became: built from shapes (and what shapes), or a 3D token. This lets
the user check that it still matches the plan.

---

Here is the game to turn into 3D:

$ARGUMENTS
