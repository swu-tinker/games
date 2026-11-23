# Game Arcade

This is the user's personal game repo. It hosts browser games they design for
fun, built from their own ideas and plans.
GitHub Pages publishes it at https://swu-tinker.github.io/games/

The user is a teacher and designer, not an engineer. Explain things in plain
English.

## Building a new game

Use the `/build-game` skill for every new game, even when the user asks
casually ("make a game from this idea"). The skill holds the build rules and the
publishing steps.

## Making a 3D version of a game

Use the `/make-3d` skill when the user asks to turn a game into 3D. It builds
the 3D version in a new `<folder>-3d` folder and leaves the 2D game untouched.
3D games are the one exception to the "no libraries" rule: each one carries its
own copy of the Three.js library, pasted in by the skill's `add_three.py`
script. Don't read the library part of a 3D game file. It starts at the line
`THREE.JS LIBRARY START`.

## How the site works

- Each game lives in its own folder: `games/<folder-name>/index.html`.
- Each game is one self-contained HTML file. It loads nothing from the internet.
- The root `index.html` is the arcade home page. It lists every
  `games/*/index.html` automatically when GitHub Pages builds the site. Don't add
  games to it by hand. Each game's tile gets its title, emoji and short blurb
  from `_data/games.yml`. A game missing from that list still shows, with a
  plain tile.
- The home page's two fonts (Press Start 2P and Nunito) are saved in `fonts/`,
  so the page loads nothing from the internet.
- `sprites/` at the repo root holds pixel art any page can use, such as the
  player sprite facing you. Its README says how to use the files.
- `gate.js` at the repo root is the password screen. The home page and
  every game load it with one line in `<head>`. It stores only a scrambled copy
  of the password, so never write the real password into the repo. It is a
  "please knock" sign, not real security.
- GitHub Pages rebuilds the site 1 to 2 minutes after each push to `main`.

## Rules

- Only change files inside a game's folder when the user is working on that
  game.
- Every localStorage key starts with the game's folder name and a dash. All the
  games share one website, so they share one storage space.
- The site is public. Keep personal information (full names, photos) out of
  every game.
- Don't write `{{`, `}}`, `{%`, or `%}` in Markdown files. GitHub Pages reads
  them as template code, and a broken template stops the whole site from
  updating.
- Push new game folders straight to `main`. The user approved this.
- Write commit messages in plain English, such as "Add the Space Blaster game".

## Testing

The `arcade` server in `.claude/launch.json` serves the repo at
http://localhost:8000. Games work there. The home page shows raw template code
locally because only GitHub Pages fills in the game list.
