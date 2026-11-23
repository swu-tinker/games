# Almond Allergy

A two-player, pass-the-phone game drawn as pixel art. It was first called
Almond Joy and was renamed Almond Allergy. The rules come from the original
plan for the game.

## How to play

Two players take turns on one phone. Tap a covered square of the chocolate bar
to pick it, then press Eat to open it or Almond to say an almond is hidden
there. Finding an almond is +1 and you go again. Biting an almond, or calling
a plain square an almond, is −1. When every almond is found, most points wins.
A tie goes to the player with fewer mistakes.

## The board

- 5 by 5 squares with 5 almonds. 1 square in 5 hides an almond.
- A typical game is about 15 turns, roughly 1½ to 2½ minutes.

## The look

- **Colors:** soft mint background, dark and milk chocolate bar, cream eaten
  squares. Player 1 is lime and Player 2 is magenta. Player cards and buttons
  are dark slate.
- **Font:** Press Start 2P, the same pixel font as the arcade home page,
  saved inside the game file so the game loads nothing from the internet. All
  game text shows in capitals. The font has no "−" sign, so scores use a plain
  "-".
- **Player cards:** a colored title bar with the player's name, and the score
  below. The player sprite stands left of Player 1's card and the woman sprite
  stands right of Player 2's card. Whoever is waiting has a faded card and a
  gray, faded sprite. There is no "turn" label.
- **Almonds left:** one centered line between the cards and the board. Its
  words are the same size as the Eat and Almond button text.
- **Buttons:** Eat and Almond under the board. They are gray until a square is
  picked, then light up in the active player's color.
- **Found and bitten almonds:** a ring in the player's color. These squares
  are drawn with pixels half the size, so the whole almond fits inside the
  ring. A bitten almond has a cream crack down the middle.
- **Wrong guess:** the square opens to its number with the ring of the player
  who guessed wrong.
- No intro page, no pause button, no message banner, no "All games" link. The
  game starts as soon as the page opens. Players use the browser's back button
  to leave.

## How the pictures are drawn

Every square, almond, number and person is a grid of letters in the `SPRITES`,
`DIGITS` and `PEOPLE` blocks near the top of the JavaScript. Each letter is a
color, and a dot is empty. To change a picture, change the letters. The two
people are copies of the shared sprites in `sprites/` (the player's "ready"
pose and the woman's "standing" pose).

Each block of color is snapped to the screen's real pixels, so no faint seams
show inside the squares at any zoom level.

## Storage

The key for who goes first is `almond-allergy-nextFirst`. The first player
switches every game.
