// The arcade's player sprite, facing you. 20 rows of 20 letters per pose.
// A dot is an empty square; every other letter is a color from PALETTE.
// Poses: ready, forehand, backhand, won.
// Use drawPlayerFront(ctx, pose, x, y, cell) to paint it on a canvas, where
// (x, y) is the top-left corner and cell is the size of one square in pixels.
// The same pictures are also saved as SVG files next to this one.
const PLAYER_FRONT = {
  palette: {
    h: "#1a1a1a",
    s: "#a86b3c",
    e: "#1a1a1a",
    t: "#ffffff",
    p: "#6e1b2e",
    k: "#222222",
    r: "#d9d9d9",
    n: "rgba(207,233,255,0.5)",
    y: "#e6f53a"
  },
  poses: {
    ready: [
      "........hhhh........",
      ".......hhhhhh.......",
      ".......hssssh.......",
      ".......sesses.......",
      "........ssss........",
      ".........ss.........",
      "......tttttttt......",
      ".....tttttttttt.....",
      ".....stttttttts.....",
      ".....s.tttttt.s.....",
      ".....s.tttttt.s.....",
      ".....r.tttttt.......",
      ".....r.pppppp.......",
      "....rr.pppppp.......",
      "...rnnrpp..pp.......",
      "...rnnrss..ss.......",
      "...rnnrss..ss.......",
      "....rr.ss..ss.......",
      "......kkk..kkk......",
      "...................."
    ],
    forehand: [
      "........hhhh........",
      ".......hhhhhh.......",
      ".rr....hssssh.......",
      "rnnr...sesses.......",
      "rnnr....ssss........",
      "rnnr.....ss.........",
      ".rr...tttttttt......",
      "..r..tttttttttt.....",
      "...sssttttttttts....",
      ".......tttttt.s.....",
      ".......tttttt.s.....",
      ".......tttttt.......",
      ".......pppppp.......",
      ".......pppppp.......",
      ".......pp..pp.......",
      ".......ss..ss.......",
      ".......ss..ss.......",
      ".......ss..ss.......",
      "......kkk..kkk......",
      "...................."
    ],
    backhand: [
      "........hhhh........",
      ".......hhhhhh.......",
      ".......hssssh....rr.",
      ".......sesses...rnnr",
      "........ssss....rnnr",
      ".........ss.....rnnr",
      "......tttttttt...rr.",
      ".....tttttttttt..r..",
      ".....sttttttttsss...",
      ".....s.tttttt.......",
      ".....s.tttttt.......",
      ".......tttttt.......",
      ".......pppppp.......",
      ".......pppppp.......",
      ".......pp..pp.......",
      ".......ss..ss.......",
      ".......ss..ss.......",
      ".......ss..ss.......",
      "......kkk..kkk......",
      "...................."
    ],
    won: [
      "...y....hhhh........",
      "..y....hhhhhh.......",
      ".......hssssh.......",
      ".y.....sesses.......",
      "....ss..ssss........",
      ".....s...ss.........",
      ".....stttttttt......",
      ".....sttttttttt.....",
      "......ttttttttt.....",
      ".......tttttt.s.....",
      ".......tttttt.s.....",
      ".......tttttt.r.....",
      ".......pppppp.r.....",
      ".......pppppp.rr....",
      ".......pp..pprnnr...",
      ".......ss..ssrnnr...",
      ".......ss..ssrnnr...",
      ".......ss..ss.rr....",
      "......kkk..kkk......",
      "...................."
    ]
  },
};
function drawPlayerFront(ctx, pose, x, y, cell) {
  const rows = PLAYER_FRONT.poses[pose] || PLAYER_FRONT.poses.ready;
  rows.forEach((row, ry) => {
    let rx = 0;
    while (rx < row.length) {
      const ch = row[rx];
      if (ch === ".") { rx += 1; continue; }
      let len = 1;
      while (row[rx + len] === ch) len += 1;
      ctx.fillStyle = PLAYER_FRONT.palette[ch];
      ctx.fillRect(x + rx * cell, y + ry * cell, len * cell, cell);
      rx += len;
    }
  });
}
