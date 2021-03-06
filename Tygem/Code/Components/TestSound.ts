﻿/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class TestSound extends Component {

        constructor() {
            super();
            this.name = "TestSound";
            
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => { }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            if (Keys.keyPressed(Key.Num2)) {
                let sn: string = "music/level_white";
                if (AudioManager.isSoundPlaying(sn)) {
                    console.log("Sound already playing");
                } else {
                    console.log("Sound not playing yet");
                    AudioManager.playMusic(sn, .7, 1, true);
                }
            }

            if (Keys.keyPressed(Key.Num3)) {
                AudioManager.playSFX("sfx/boop1", .8);
            }
            
        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

    }

}