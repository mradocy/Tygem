﻿/// <reference path="../app.ts" />

// adding texture packs to the game
TexPackManager.addTexturePack("Assets/Texpacks/texpack-0.json");
//TexPackManager.addTexturePack("Assets/Texpacks/texpack-1.json");




/*

Plan:

Spritesheet:
- name: "sealime"
- filename: "sealime.png"
    - filename as specified in the texpack json
- frameWidth: 64
- frameHeight: 64
- numFrames: 10


*/

Spritesheet.addSpritesheet("sealime.png", 64, 64, 8, 41);



Animation.addAnimation("sealime_idle", "sealime.png", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
Animation.addAnimation("sealime_leap", "sealime.png", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, false);


Spritesheet.addSpritesheet("hero/walk.png", 16, 32, 13, 52);

Animation.addAnimation("hero_idle", "hero/walk.png", [0], 10, true);
Animation.addAnimation("hero_walk_down", "hero/walk.png", [0, 1, 2, 3], 10, true);
Animation.addAnimation("hero_walk_right", "hero/walk.png", [13, 14, 15, 16], 10, true);
Animation.addAnimation("hero_walk_up", "hero/walk.png", [26, 27, 28, 29], 10, true);


