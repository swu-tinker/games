"""Paste the Three.js library into a 3D game's index.html.

Usage: python3 .claude/skills/make-3d/add_three.py games/<folder>/index.html

This script puts the library in its own script tag at the very end of the
page, just before </body>. The game's own code stays at the top of the file,
where it is easy to read and edit. Running the script again swaps in a fresh
copy of the library instead of adding a second one.

The game's own script must be <script type="module">. The browser runs module
scripts only after the whole page has loaded, so the library at the bottom is
ready before the game code needs it.
"""

import re
import sys
from pathlib import Path

START = "<!-- THREE.JS LIBRARY START: added by add_three.py. Don't edit below this line. -->"
END = "<!-- THREE.JS LIBRARY END -->"

library_path = Path(__file__).with_name("three.min.js")


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python3 add_three.py games/<folder>/index.html")

    game_path = Path(sys.argv[1])
    page = game_path.read_text(encoding="utf-8")
    library = library_path.read_text(encoding="utf-8")

    # This removes an older copy of the library so the page never has two.
    page = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n?", "", page, flags=re.S)

    if "</body>" not in page:
        sys.exit(f"{game_path} has no </body> tag, so there is nowhere to add the library.")
    if '<script type="module">' not in page:
        sys.exit(f'{game_path} needs its game code in <script type="module"> so it runs after the library.')

    block = f"{START}\n<script>\n{library}\n</script>\n{END}\n"
    # This splits at the last </body> so the library lands at the very end of the page.
    before, after = page.rsplit("</body>", 1)
    game_path.write_text(before + block + "</body>" + after, encoding="utf-8")

    size_kb = game_path.stat().st_size // 1024
    print(f"Added Three.js to {game_path} ({size_kb} KB).")


main()
