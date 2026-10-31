# Abu D: visual verification

Sources: eight 640 x 640 transparent WebP files in src/art/assets/d5, all opened and visually inspected. Coordinates in ABU_ANCHORS refer to the original canvas, with rotation in degrees. Head sits between the ears, neck below the jaw, torso over the chest (over the flank for sleep), eyes at the midpoint between the pupils.

Gallery: run Vite, then open /tests/abu-d-gallery.html. It renders the 12 catalog accessories across sit, stand, happy, sleep, think and lie (72 combinations). Every item is rendered individually so overlaps cannot conceal positioning defects. Capture: tests/shots/abu-d-gallery.png, inspected visually. Idle and wag share sit anchors and image; sad shares its seated body landmarks. Unit tests cover all nine public poses.

The sleeping image requires its own anchors, especially the collar at (327,369) and the rotated neck. Clothes are deliberately simple SVG silhouettes. No assets were edited or generated. The preview pose stays in memory; inventory and equipped slots persist in the profile. Default theme stays atual.
