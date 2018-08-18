/// <reference path="../app.ts" />

// master list of actions being added to the game
// add ID's in Actions._ID.ts


/// <reference path="Actions/SwordSlash.ts" />


Actions.addActionInfo({

    id: Actions.ID.SWORD_SLASH,
    name: "Sword Slash",
    ctor: Actions.SwordSlash,

    description: "Slashes foes with a sword."

});



