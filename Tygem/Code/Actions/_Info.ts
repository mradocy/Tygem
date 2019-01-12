/// <reference path="../../Tygem/_ref.ts" />
/// <reference path="../Components/Character.ts" />
/// <reference path="_IDs.ts" />

namespace Actions {
    
    export class Info {

        constructor(id: ID, name: string, description: string, ctor: new (character: Comps.Character) => Actions.Base) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.ctor = ctor;
        }

        id: ID;
        name: string;
        description: string;

        /**
         * Estimated range of the action.  Used for AI.
         */
        estRange: number;

        ctor: new (character: Comps.Character) => Actions.Base;

    }

    /**
     * Gets the Actions.Info with the given ID.
     * @param id ID of the Action.
     */
    export function getActionInfo(id: ID): Info {
        let idN: number = id;
        if (!map.hasOwnProperty(idN)) {
            console.warn("No Actions.Info found with the id " + ID[id] + ".  It probably needs to be added internally with Actions.addAction()");
            return null;
        }
        return map[idN];
    }

    /**
     * Used to add Actions.Infos to the map.
     * @param info Can be an instance of Action.Info or a json with all the properties of Action.Info.
     */
    export function addActionInfo(info: any): void {
        if (info == null) {
            addInfoError("info is null");
            return;
        }

        // checking id
        if (info.id == undefined) {
            addInfoError("info.id is undefined or null");
            return;
        }
        if (typeof info.id !== "number") {
            addInfoError("info.id must be an Actions.ID");
            return;
        }
        let id: ID = info.id;
        let idN: number = id;
        if (id === ID.NONE) {
            addInfoError("cannot add info with ID " + ID.NONE);
            return;
        }
        if (map.hasOwnProperty(idN)) {
            addInfoError("info with ID " + id + " already added.");
            return;
        }
        
        // checking name
        if (info.name == undefined) {
            addInfoError("info.name is undefined or null", id);
            return;
        }
        if (typeof info.name !== "string") {
            addInfoError("info.name must be a string", id);
            return;
        }

        // checking ctor
        if (info.ctor == undefined) {
            addInfoError("info.ctor is undefined or null", id);
            return;
        }

        // checking description
        if (info.description == undefined) {
            addInfoError("info.description is undefined or null", id);
            return;
        }
        if (typeof info.description !== "string") {
            addInfoError("info.description must be a string", id);
            return;
        }

        // checking estRange
        if (info.estRange == undefined) {
            addInfoError("info.estRange is undefined or null", id);
            return;
        }
        if (typeof info.estRange !== "number") {
            addInfoError("info.estRange must be a number", id);
            return;
        }


        // error checking complete, add
        map[idN] = info as Info;
        
    }
    function addInfoError(message: string, id: ID = ID.NONE): void {
        let idStr: string = id === ID.NONE ? "" : " " + ID[id];
        console.error("Error adding ActionInfo" + idStr + ": " + message);
    }
    
    
    /**
     * Maps IDs to Action.Infos.  Do not modify directly, use addActionInfo() instead.
     */
    let map: { [id: number]: Info } = {};

}