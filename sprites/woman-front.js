// The arcade's woman sprite, facing you. 20 rows of 20 letters per pose.
// A dot is an empty square; every other letter is a color from PALETTE.
// Poses: standing.
// Use drawWomanFront(ctx, pose, x, y, cell) to paint it on a canvas, where
// (x, y) is the top-left corner and cell is the size of one square in pixels.
// The same picture is also saved as an SVG file next to this one.
const WOMAN_FRONT = {
  palette: {
    h: "#1a1a1a",
    s: "#f0c8a0",
    e: "#67443b",
    d: "#d6263a",
    k: "#222222"
  },
  poses: {
    standing: [
      "........hhhh........",
      ".......hhhhhh.......",
      "......hhsssshh......",
      "......hsessesh......",
      "......hhsssshh......",
      "......hhhsshhh......",
      "......sdssssds......",
      "......sdddddds......",
      "......sdddddds......",
      "......sdddddds......",
      ".......dddddd.......",
      "......dddddddd......",
      "......dddddddd......",
      ".....dddddddddd.....",
      ".....dddddddddd.....",
      ".......ss..ss.......",
      ".......ss..ss.......",
      ".......ss..ss.......",
      "......kkk..kkk......",
      "...................."
    ]
  },
};
function drawWomanFront(ctx, pose, x, y, cell) {
  const rows = WOMAN_FRONT.poses[pose] || WOMAN_FRONT.poses.standing;
  rows.forEach((row, ry) => {
    let rx = 0;
    while (rx < row.length) {
      const ch = row[rx];
      if (ch === ".") { rx += 1; continue; }
      let len = 1;
      while (row[rx + len] === ch) len += 1;
      ctx.fillStyle = WOMAN_FRONT.palette[ch];
      ctx.fillRect(x + rx * cell, y + ry * cell, len * cell, cell);
      rx += len;
    }
  });
}
