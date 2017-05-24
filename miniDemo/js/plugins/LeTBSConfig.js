Lecode.S_TBS.Config = {};


/*-------------------------------------------------------------------------
* Sprites Poses
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Battler_Sprites = {

    // Config_name: data
    "Default": [
        // [pose_name,filename,frames]
        ["idle", "_idle", 3],
        ["dead", "_dead", 1]
    ]

};

/*-------------------------------------------------------------------------
* Tile effects
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Tile_Effects = {

};

/*-------------------------------------------------------------------------
* Marks
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Marks = {

    "explosive_mark": {
        body_anim: 139,
        disappearing_anim: 140,
        size: "square(1)",
        triggers: {
            "turn_end": {
                stop_movement: false,
                skill_effects: 32,
                effects_aoe: "circle(0)"
            }
        },
        max: 1,
        duration: [3, "turn_end"]
    }
};

/*-------------------------------------------------------------------------
* Aura
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Aura = {

    "intimidating_aura": {
        size: "circle(1)",
        affect_caster: false,
        target_type: "enemy",
        states: [13],
        trigger_anim: 142
    }

};

/*-------------------------------------------------------------------------
* Projectiles
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Projectiles = {

    "bow_arrow": {
        filename: "Arrow",
        adapt_angle: true,
        speed: 5,
        jump: 150
    },

    "great_wind": {
        anim: [168, 56, 50],
        adapt_angle: true,
        speed: 14,
        jump: 0
    },

    "shuriken": {
        filename: "Shuriken",
        adapt_angle: true,
        speed: 14,
        jump: 0
    },

    "kunai": {
        filename: "Kunai",
        adapt_angle: true,
        speed: 14,
        jump: 0
    },

};

/*-------------------------------------------------------------------------
* Summons
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Summons = {

    "wind_spirit": {
        active: true,
        turn_order: "after_caster",
        visible_in_timeline: true,
        type: "user_playable",
        kind: "actor",
        id: 10,
        tied_to_caster: true,
        stats: {
            default: "90%",
            mhp: "70%",
            mmp: "+10%"
        }
    }
};

/*-------------------------------------------------------------------------
* Custom Scopes
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Custom_Scopes = {

    "ice_fury": {
        data_right: "[cx,cy],[cx+1,cy],[cx+2,cy]",
        data_left: "[cx-2,cy],[cx-1,cy],[cx,cy]",
        data_up: "[cx,cy-2],[cx,cy-1],[cx,cy]",
        data_down: "[cx,cy],[cx,cy+1],[cx,cy+2]"
    }

};

/*-------------------------------------------------------------------------
* Sequences
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Sequences = {

    /*-------------------------------------------------------------------------
    * Events Sequences
    -------------------------------------------------------------------------*/

    "battle_start": [

    ],

    "turn_start": [
        "play_pose: user, turn_start"
    ],

    "victory": [
        "play_pose: user, victory, victory"
    ],

    "dead": [
        "anim: user, collapse_anim",
        "play_pose: user, dead, dead",
        "wait: 40"
        //"perform_collapse: user"
    ],

    "revived": [
        "play_pose: user, idle, idle",
    ],

    "damaged": [
        "sprite_shake: user, 6, 30",
        "play_pose: user, hit",
        "set_frame: user, hit, last",
        "wait: 5",
        "play_pose: user, idle"
    ],

    "evaded": [

    ],

    "healed": [

    ],

    "buffed": [

    ],

    "weakened": [

    ],

    /*-------------------------------------------------------------------------
    * Default Action Sequences
    -------------------------------------------------------------------------*/

    "atk": [
        "play_pose: user, atk",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "cast(loop)": [
        "play_pose: user, cast, cast",
        "wait: 4",
        "map_anim: user_cell, 123, 0, true"
    ],

    "pre-skill": [
        "call: cast(loop)",
        "wait: 4",
        "play_pose: user, atk, wait",
        "set_frame: user, atk, last",
        "wait: 2"
    ],

    "post-skill": [
        "wait: 10",
        "play_pose: user, idle",
        "wait: 10"
    ],

    "skill": [
        "call: pre-skill",
        "effects: {aoe}_battlers, current_obj, obj_anim, 0, true",
        "call: post-skill"
    ],

    "map_skill": [
        "call: pre-skill",
        "map_effects: aoe, current_obj, obj_anim, 0, true",
        "call: post-skill"
    ],

    "item": [
        "play_pose: user, item",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "skill_neutral": [
        "play_pose: user, cast",
        "wait: 15",
        "effects: {aoe}_battlers, current_obj, obj_anim, 0, true",
        "play_pose: user, idle",
        "wait: 20"
    ],

    "map_skill_neutral": [
        "play_pose: user, cast",
        "wait: 15",
        "map_effects: aoe, current_obj, obj_anim, 0, true",
        "play_pose: user, idle",
        "wait: 20"
    ],

    "bow": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: bow_arrow, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],
    
    "projectile": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: $1, user_cell, {aoe}",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "counter": [
        "anim: user, 177, 0, true",
        "wait: 15"
    ],

    "summon": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 15",
        "summon: $1, cursor_cell",
        "call: post-skill"
    ],

    /*-------------------------------------------------------------------------
    * Your Sequences
    -------------------------------------------------------------------------*/

    "repulsive_blow": [
        "play_pose: user, atk",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "set_speed: {aoe}_battlers, +6",
        "push: {aoe}_battlers, user_cell, 1",
        "set_speed: {aoe}_battlers, reset",
        "wait: 60"
    ],

    "bolt_jump": [
        "set_frame: user, atk, 0",
        "wait: 15",
        "jump_to_cell: user, cursor_cell",
        "play_pose: user, atk",
        "map_effects: {aoe}-user_cell, current_obj, obj_anim"
    ],

    "rush": [
        "wait: 10",
        "set_frame: user, atk, 0",
        "wait: 30",
        "play_pose: user, atk",
        "directional_anim: user, user, 131, 132, 133, 134",
        "look_at: user, cursor_cell",
        "set_speed: user, +6",
        "move_straight: user, 2",
        "set_speed: user, reset",
        "set_frame: user, atk, last",
        "wait: 12",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 20",
        "play_pose: user, idle",
        "wait: 10"
    ],

    "phantom_slash": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: phantom_slash, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, 153",
        "anim: user, 154",
        "wait: 20",
        "reach_target: user, {aoe}_battlers, back, true",
        "anim: user, 155",
        "look_at: user, {aoe}_battlers",
        "play_pose: user, atk",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    //-

    "spark": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "effects: {aoe}_battlers, current_obj",
        "call: post-skill"
    ],


    //-

    "heal": [
        "call: pre-skill",
        "anim: {aoe}_battlers, obj_anim",
        "wait: 20",
        "effects: {aoe}_battlers, current_obj",
        "call: post-skill"
    ],

    "teleportation": [
        "call: pre-skill",
        "anim: user, 129",
        "wait: 40",
        "move_to_cell: user, cursor_cell, true",
        "anim: user, 130",
        "wait: 60",
        "call: post-skill"
    ],

    "explosive_mark": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "mark: explosive_mark, cursor_cell",
        "wait: 60",
        "call: post-skill"
    ],

    "wind_spirit": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 15",
        "summon: wind_spirit, cursor_cell",
        "call: post-skill"
    ],

    "great_wind": [
        "call: pre-skill",
        "projectile: great_wind, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "set_speed: {aoe}_battlers, +12",
        "push: {aoe}_battlers, user_cell, 3",
        "set_speed: {aoe}_battlers, reset",
        "call: post-skill"
    ],

    "transposition": [
        "call: pre-skill",
        "anim: user, obj_anim",
        "anim: {aoe}_battlers, obj_anim",
        "wait: 40",
        "switch_cells: user, {aoe}_battlers",
        "call: post-skill"
    ],

    //-
    
    "magic_kunai": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: kunai, user_cell, {aoe}_enemies",
        "effects: {aoe}_enemies, current_obj, obj_anim",
        "wait: 60"
    ],

};

/*-------------------------------------------------------------------------
* AI
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.AI = {

    BehaviorsOrder: [
        "healing",
        "escape",
        "summon",
        "support",
        "offense" // <- Keep offense at the end, for now
    ],

    "default": [
        "process_behaviors",
        "call_behavior: end_of_turn"
    ],

    "end_of_turn": [
        "wait: 5",
        "pass: look_closest_enemy"
    ],


    /*-------------------------------------------------------------------------
    * Default behaviors
    -------------------------------------------------------------------------*/

    "use_healing": [
        "search_target: self, 100%, healing",
        "if: !isTargetValid()",
            "search_target: lowest_ally, 100%, healing",
            "if: !isTargetValid()",
                "search_target: closest_ally, 100%, healing",
            "endif",
        "endif",
        "if: isTargetValid()",
            "set_action: healing, average",
            "move_for_action: null",
            "use: defined_action",
        "end",
        "call_behavior: after_healing"
    ],

    "after_healing": [
        "if: user.hpRate() <= 0.3",
            "call_behavior: smart_move_away_enemies",
        "else",
            "call_behavior: after_offense",
        "endif"
    ],

    "use_support": [
        "search_target: lowest_ally, 100%, support",
        "if: !isTargetValid()",
            "search_target: self, 100%, support",
            "if: !isTargetValid()",
                "search_target: closest_ally, 100%, support",
            "endif",
        "endif",
        "if: isTargetValid()",
            "set_action: support, average",
            "move_for_action: null",
            "use: defined_action",
            "call_behavior: after_support",
        "else",
            "move: toward_enemies, 20%",
        "endif"
    ],

    "after_support": [
        "if: canUseEscape()",
            "call_behavior: escape",
        "else",
            "if: pattern('ranged_fighter')",
                "move: away_enemies, 25%",
            "else",
                "move: toward_enemies, 100%",
            "endif",
        "endif"
    ],
    
    "use_summon": [
        "if: distanceToEnemies() > entity.getMovePoints() + 1",
            "move: toward_enemies, 75%",
        "endif",
        "set_action: summon",
        "move_for_action: null",
        "use: defined_action",
        "call_behavior: after_summon"
    ],

    "after_summon": [
        "call_behavior: after_support"
    ],

    "use_offense": [
        /*"if: chance(70)",
            "search_target: lowest_enemy, 100%, offense",
            "if: !isTargetValid()",
                "search_target: closest_enemy, 100%, offense",
            "endif",
        "else",
            "search_target: closest_enemy, 100%, offense",
        "endif",*/
        "search_target: closest_enemy, 100%, offense",
        "if: isTargetValid()",
            "set_action: damage, average",
            "move_for_action: null",
            "use: defined_action",
            "call_behavior: after_offense",
        "else",
            "script: console.log('TARGET NOT VALID')",
            "move: toward_enemies, 100%",
        "endif"
    ],

    "cant_use_offense": [
        "if: failureCode() === 'out_of_range'",
            "call_behavior: out_of_range",
        "else",
            "move: away_enemies, 100%",
        "endif"
    ],

    "after_offense": [
        "if: canUseEscape()",
            "call_behavior: escape",
        "else",
            "if: pattern('ranged_fighter')",
                "call_behavior: smart_move_away_enemies",
            "else",
                "if: !isInMeleeWith('defined_target')",
                    "move: toward_enemies, 50%",
                "endif",
            "endif",
        "endif"
    ],

    "out_of_range": [
        "if: canUseRush()",
            "set_action: move, toward",
            "move_for_action: null",
            "use: defined_action",
        "endif",
        "if: chance(40)",
            "move: toward_enemies, 80%",
        "else",
            "move: toward_enemies, 100%",
        "endif"
    ],

    "escape": [
        "set_action: move, away",
        "move_for_action: null",
        "use: defined_action",
        "wait: 10",
        "call_behavior: smart_move_away_enemies",
    ],

    "smart_move_away_enemies": [
        "if: distanceToEnemies() >= entity.getMovePoints() * 2",
            "move: toward_enemies, 50%",
        "else",
            "move: away_enemies, 100%",
        "endif",
    ]

    /*-------------------------------------------------------------------------
    * Your behaviors
    -------------------------------------------------------------------------*/
};