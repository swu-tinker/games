# Shared sprites

Pixel art that any page in the arcade can use: the home page, a game, or a
new game. Everything here is drawn as a grid of colored squares, 20 by 20.

## The player, facing you

Black hair, brown skin, white shirt, burgundy shorts. Four poses:

| File | Pose |
| --- | --- |
| `player-front-ready.svg` | standing ready, racket down |
| `player-front-forehand.svg` | forehand swing (racket out to your left) |
| `player-front-backhand.svg` | backhand swing (racket out to your right) |
| `player-front-won.svg` | fist up with sparkles, for winning a point |
| `player-front.js` | the same four poses as letter grids, plus a helper that paints them on a canvas |

The same character seen from behind lives inside the Turn Based Tennis game
(`games/turn-based-tennis/index.html`, in the `SPRITES` block).

## The woman, facing you

Black shoulder-length hair, light skin, brown eyes, red dress with straps.
One pose so far:

| File | Pose |
| --- | --- |
| `woman-front-standing.svg` | standing, arms at her sides |
| `woman-front.js` | the same pose as a letter grid, plus `drawWomanFront(ctx, "standing", x, y, cell)` |

## How to use

**As an image** (simplest, works anywhere):

    <img src="sprites/player-front-ready.svg" width="100" height="100" alt="">

From the home page the path is `sprites/...`. From inside a game folder it is
`../../sprites/...`. Pick a width that is a multiple of 20 (60, 80, 100, 120)
so each square lands on whole pixels and stays crisp.

**On a canvas** (for a game that draws its own screen): load
`player-front.js`, then call

    drawPlayerFront(ctx, "ready", x, y, cell)

where `(x, y)` is the top-left corner and `cell` is the size of one square in
pixels. Games are meant to be self-contained, so paste the contents of the
file into the game rather than linking to it.

**Changing a square:** each pose is 20 rows of 20 letters. A dot is empty;
each other letter is a color from the palette at the top of `player-front.js`
or `woman-front.js`.
Change a letter, then make the matching change in the SVG file (one `<rect>`
per run of same-colored squares, 1 unit per square).
