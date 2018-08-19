/// <reference path="../app.ts" />

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
Spritesheet.addSpritesheet("hero/attack.png", 32, 32, 4, 16);

Animation.addAnimation("hero_idle_down", "hero/walk.png", [0], 10, true);
Animation.addAnimation("hero_idle_right", "hero/walk.png", [13], 10, true);
Animation.addAnimation("hero_idle_up", "hero/walk.png", [26], 10, true);
Animation.addAnimation("hero_walk_down", "hero/walk.png", [0, 1, 2, 3], 8, true);
Animation.addAnimation("hero_walk_right", "hero/walk.png", [13, 14, 15, 16], 8, true);
Animation.addAnimation("hero_walk_up", "hero/walk.png", [26, 27, 28, 29], 8, true);

Animation.addAnimation("hero_attack_down", "hero/attack.png", [0, 1, 2, 3], 4 / .2, false);
Animation.addAnimation("hero_attack_up", "hero/attack.png", [4, 5, 6, 7], 4 / .2, false);
Animation.addAnimation("hero_attack_right", "hero/attack.png", [8, 9, 10, 11], 4 / .2, false);

Spritesheet.addSpritesheet("hero/sword slash.png", 32, 48, 8, 8);
Animation.addAnimation("hero_sword_slash", "hero/sword slash.png", [0, 1, 2, 3, 4, 5, 6, 7], 8 / .25, false);


Spritesheet.addSpritesheet("log/log.png", 32, 32, 6, 23);
Animation.addAnimation("log_idle_down", "log/log.png", [0], 10, true);
Animation.addAnimation("log_idle_up", "log/log.png", [6], 10, true);
Animation.addAnimation("log_idle_right", "log/log.png", [12], 10, true);
Animation.addAnimation("log_idle_left", "log/log.png", [18], 10, true);
Animation.addAnimation("log_walk_down", "log/log.png", [0, 1, 2, 3], 10, true);
Animation.addAnimation("log_walk_up", "log/log.png", [6, 7, 8, 9], 10, true);
Animation.addAnimation("log_walk_right", "log/log.png", [12, 13, 14, 15], 10, true);
Animation.addAnimation("log_walk_left", "log/log.png", [18, 19, 20, 21], 10, true);

Animation.addAnimation("log_attack_down", "log/log.png", [2], 10, false); // get better animation
Animation.addAnimation("log_attack_up", "log/log.png", [8], 10, false); // get better animation
Animation.addAnimation("log_attack_right", "log/log.png", [14], 10, false); // get better animation
Animation.addAnimation("log_attack_left", "log/log.png", [20], 10, false); // get better animation



Spritesheet.addSpritesheet("Goblin/goblin.png", 26, 26, 4, 36);
Animation.addAnimation("goblin_idle_down", "goblin/goblin.png", [32, 33], 8, true);
Animation.addAnimation("goblin_idle_up", "goblin/goblin.png", [20, 21], 8, true);
Animation.addAnimation("goblin_idle_right", "goblin/goblin.png", [8, 9], 8, true);
Animation.addAnimation("goblin_walk_down", "goblin/goblin.png", [28, 29, 30, 31], 10, true);
Animation.addAnimation("goblin_walk_up", "goblin/goblin.png", [16, 17, 18, 19], 10, true);
Animation.addAnimation("goblin_walk_right", "goblin/goblin.png", [4, 5, 6], 10, true);
Animation.addAnimation("goblin_attack_down", "goblin/goblin.png", [24, 25, 26], 4 / .2, false);
Animation.addAnimation("goblin_attack_up", "goblin/goblin.png", [12, 13, 14], 4 / .2, false);
Animation.addAnimation("goblin_attack_right", "goblin/goblin.png", [0, 1, 2], 4 / .2, false);




