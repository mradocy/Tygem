/// <reference path="../app.ts" />

// adding texture packs to the game
TexPackManager.addTexturePack("Assets/Texpacks/texpack-0.json");
TexPackManager.addTexturePack("Assets/Texpacks/texpack-1.json");




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
