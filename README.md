# Game Arcade

This repo holds browser games I design and build with HTML, CSS, and
JavaScript. Every game is playable on the web at:

**https://swu-tinker.github.io/games/**

## How games are set up

Each game is one file named `index.html` inside its own folder in `games/`:

```
games/
  snake/
    index.html
  space-blaster/
    index.html
```

The `index.html` file holds everything: the HTML, the CSS (in a `<style>` tag),
and the JavaScript (in a `<script>` tag). It loads nothing from the internet.

The arcade home page finds every game folder on its own. A new game shows up
1 to 2 minutes after it is pushed to GitHub.

A game's link is its folder name:

```
https://swu-tinker.github.io/games/games/snake/
```

Design notes and plans for bigger games live in `plans/`.

## Add a game

1. Make a new folder in `games/`. Name it after the game, with lowercase
   letters and dashes only. Example: `snake`.
2. Put the game in that folder as `index.html`. The name must be exactly
   `index.html`, all lowercase.
3. Push it to GitHub.

## Rules

- If a game saves anything with localStorage, start every key with its folder
  name, such as `snake-highScore`. All the games share one website, so they
  share one storage space.
- This site is public. Don't put personal information (full names, photos) in
  a game.

## Test a game

Open the game's `index.html` file in a web browser. If the game works there, it
will work on the website.

## Build a game with Claude Code

Open this folder in Claude Code and type `/build-game`, then describe the game
or paste its plan. Claude builds the game, tests it, pushes it, and gives you
the live link.

To make a 3D version of a game that is already in the arcade, type `/make-3d`
and the game's folder name, such as `/make-3d snake`. Claude builds the 3D
version in a new folder (`snake-3d`) and leaves the 2D game as it is. 3D games
are bigger files (about 750 KB) because each one carries its own copy of the
Three.js 3D library.
