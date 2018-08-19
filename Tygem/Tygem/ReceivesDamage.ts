/// <reference path="_ref.ts" />

/**
 * Messages received:
    
    // Will be called when receiveDamage is called, just before damage is subtracted from health.
    // Use PreReceiveDamage to alter the given AttackInfo, changing some info of the attack.
    // Do not save a reference to the given AttackInfo, as it will be recycled shortly.
    preReceiveDamage = (ai: AttackInfo): void => { }
    
    // Will be called when receiveDamage is called, just after damage is subtracted from health.
    // Use OnReceiveDamage to affect the GameObject as a result of taking damage.
    // Do not save a reference to the given AttackInfo, as it will be recycled shortly.
    onReceiveDamage = (ai: AttackInfo): void => { }

*/
class ReceivesDamage extends Component {

    constructor() {
        super();
        this.name = "ReceivesDamage";
    }

    /**
     * health is set to this amount in onStart().
     */
    maxHealth: number = 10;

    health: number = 0;
    
    /**
     * The "team" this actor belongs to.  Affects which attacks this actor gets hit by.
     */
    team: Team = Team.PLAYERS;

    /**
     * If this receivesDamage is included in the given team.
     */
    isInTeam = (team: Team): boolean => {
        return (team & this.team) != 0;
    }
    
    /**
     * Receives damage, sending preReceiveDamage and onReceiveDamage messages.  The given AttackInfo may change based on how much damage was actually dealt and other conditions.
     */
    receiveDamage = (ai: AttackInfo): void => {

        if (!this.isActiveAndEnabled()) return;

        this.gameObject.sendMessage("preReceiveDamage", ai);

        this.health = Math.max(0, this.health - ai.damage);

        this.gameObject.sendMessage("onReceiveDamage", ai);
    }

    onStart = (): void => {
        this.health = this.maxHealth;
    }
    
}

/**
 * 
 */
enum Team {
    NONE = 0,

    //PLAYER_1 = 1 << 0,
    //PLAYER_2 = 1 << 1,
    //PLAYER_3 = 1 << 2,
    //PLAYER_4 = 1 << 3,
    //PLAYERS = PLAYER_1 | PLAYER_2 | PLAYER_3 | PLAYER_4,
    PLAYERS = 15,

    //ENEMY_1 = 1 << 8,
    //ENEMY_2 = 1 << 9,
    //ENEMY_3 = 1 << 10,
    //ENEMY_4 = 1 << 11,
    //ENEMIES = ENEMY_1 | ENEMY_2 | ENEMY_3 | ENEMY_4,
    ENEMIES = 3840,
    
    /**
     * Represents all players and all enemies.
     */
    ALL = 0x7FFFFFFF
}

class AttackInfo {

    static DEFAULT_KNOCKBACK_SPEED: number = 120;
    static DEFAULT_KNOCKBACK_DURATION: number = .2;

    /**
     * Damage dealt to the ReceivesDamage.
     */
    damage: number = 0;
    /**
     * Angle (in degrees) of the direction of the knockback
     */
    knockbackHeading: number = 0;

    /**
     * Initial speed of the knockback.  Can be altered on the receiving end.
     */
    knockbackSpeed: number = AttackInfo.DEFAULT_KNOCKBACK_SPEED;
    /**
     * How long receiver will be in the knockback state.  Can be altered on the receiving end.
     */
    knockbackDuration: number = AttackInfo.DEFAULT_KNOCKBACK_DURATION;

    resetValues = (): void => {
        this.damage = 0;
        this.knockbackHeading = 0;
        this.knockbackSpeed = AttackInfo.DEFAULT_KNOCKBACK_SPEED;
        this.knockbackDuration = AttackInfo.DEFAULT_KNOCKBACK_DURATION;
    }

    private recycled: boolean = false;

    static createNew(): AttackInfo {

        let ret: AttackInfo = null;
        if (AttackInfo.privateAIs.length > 0) {
            ret = AttackInfo.privateAIs.pop();
            ret.recycled = true;
        } else {
            ret = new AttackInfo();
        }
        ret.resetValues();
        return ret;
    }

    static recycle(ai: AttackInfo): void {
        if (ai.recycled) return;

        ai.recycled = true;
        AttackInfo.privateAIs.push(ai);
    }

    private static privateAIs: Array<AttackInfo> = [];

}
