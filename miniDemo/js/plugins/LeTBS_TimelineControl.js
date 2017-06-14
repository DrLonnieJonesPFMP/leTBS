/*
#=============================================================================
# LeTBS: Timeline Control
# LeTBS_TimelineControl.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeTBS_TimelineControl = true;

var Lecode = Lecode || {};
Lecode.S_TBS.TimelineControl = {};
/*:
 * @plugindesc Add features related to the timeline
 * @author Lecode
 * @version 1.0
 *
 * @help
 * See the documentation
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters out_of_timeline
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_TimelineControl');


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.TimelineControl.oldTBSEntity_initialize = TBSEntity.prototype.initialize;
TBSEntity.prototype.initialize = function (battler, layer) {
    Lecode.S_TBS.TimelineControl.oldTBSEntity_initialize.call(this, battler, layer);
    this._gotExtraTurn = false;
    this._chargingData = null;
};

TBSEntity.prototype.getExtraTurnRate = function () {
    var value = 0;
    value += this.rpgObject().leTbs_extraTurn;
    this.battler().states().forEach(function (state) {
        if (state) {
            value += state.leTbs_extraTurn;
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function (equip) {
            if (equip) {
                value += equip.leTbs_extraTurn;
            }
        });
    }
    return value * 0.01;
};

Lecode.S_TBS.TimelineControl.oldTBSEntity_onTurnEnd = TBSEntity.prototype.onTurnEnd;
TBSEntity.prototype.onTurnEnd = function () {
    Lecode.S_TBS.TimelineControl.oldTBSEntity_onTurnEnd.call(this);
    if (!this._gotExtraTurn && Math.random() < this.getExtraTurnRate()) {
        BattleManagerTBS.addExtraTurn(this);
    }
    if (this.isCharging() && this._chargingData.turns === 0) {
        this._chargingData = null;
        this.setPose("idle");
        this._sprite.checkLoopAnimations();
    }
};

Lecode.S_TBS.TimelineControl.oldTBSEntity_getLoopAnimations = TBSEntity.prototype.getLoopAnimations;
TBSEntity.prototype.getLoopAnimations = function () {
    var anims = Lecode.S_TBS.TimelineControl.oldTBSEntity_getLoopAnimations.call(this);
    if (this.isCharging()) {
        anims.push(this._chargingData.anim);
    }
    return anims;
};

Lecode.S_TBS.TimelineControl.oldTBSEntity_playableByAI = TBSEntity.prototype.playableByAI;
TBSEntity.prototype.playableByAI = function () {
    return Lecode.S_TBS.TimelineControl.oldTBSEntity_playableByAI.call(this)
        || this.isCharging();
};

TBSEntity.prototype.isCharging = function () {
    return !!this._chargingData;
};

Lecode.S_TBS.TimelineControl.oldTBSEntity_defaultPose = TBSEntity.prototype.defaultPose;
TBSEntity.prototype.defaultPose = function () {
    if (this.isCharging() && this._sprite.isValidPose("cast"))
        return "cast";
    return Lecode.S_TBS.TimelineControl.oldTBSEntity_defaultPose.call(this);
};

Lecode.S_TBS.TimelineControl.oldTBSEntity_setPose = TBSEntity.prototype.setPose;
TBSEntity.prototype.setPose = function (pose, afterPose) {
    if (this.isCharging()) {
        if (pose === "turn_start" || pose === "hit")
            return;
        afterPose = this.defaultPose();
    }
    Lecode.S_TBS.TimelineControl.oldTBSEntity_setPose.call(this, pose, afterPose);
};

Lecode.S_TBS.TimelineControl.oldTBSEntity_setFixedPose = TBSEntity.prototype.setFixedPose;
TBSEntity.prototype.setFixedPose = function (pose, frame) {
    if (this.isCharging()) {
        if (pose === "turn_start" || pose === "hit")
            return;
    }
    Lecode.S_TBS.TimelineControl.oldTBSEntity_setFixedPose.call(this, pose, frame);
};


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_processAction = BattleManagerTBS.processAction;
BattleManagerTBS.processAction = function () {
    var action = this.activeAction();
    var item = action.item();
    var entity = this.activeEntity();
    var chargeTurns = item.leTbs_charge.turns;
    if (!entity.isCharging() && chargeTurns) {
        var x = this.cursor().cellX;
        var y = this.cursor().cellY;
        var cursorCell = this.getCellAt(x, y);
        entity.setPose("cast", "cast");
        entity._chargingData = {
            turns: chargeTurns,
            anim: item.leTbs_charge.anim,
            cell: cursorCell,
            actionScope: this._actionScope,
            actionAoE: this._actionAoE,
            item: item
        };
        entity.lookAt(this._activeCell);
        this.processCommandPass();
        return;
    }
    Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_processAction.call(this);
};

Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_startAiTurn = BattleManagerTBS.startAiTurn;
BattleManagerTBS.startAiTurn = function (entity, battler) {
    if (entity.isCharging()) {
        entity._chargingData.turns--;
        if (entity._chargingData.turns === 0) {
            this.activeAction().setItemObject(entity._chargingData.item);
            this.setCursorCell(entity._chargingData.cell);
            this._actionAoE = entity._chargingData.actionAoE;
            this._actionScope = entity._chargingData.actionScope;
            this.processAction();
        } else {
            this.processCommandPass();
        }
        return;
    }
    Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_startAiTurn.call(this, entity, battler);
};

BattleManagerTBS.addExtraTurn = function (entity) {
    var indexToInsert = null;
    for (var i = 0; i < this._turnOrder.length; i++) {
        var e = this._turnOrder[i];
        if (entity === e)
            indexToInsert = i;
    }
    if (indexToInsert >= 0) {
        entity.addTextPopup("Extra Turn");
        if (entity.battler().isActor())
            this.wait(40);
        entity._gotExtraTurn = true;
        this._turnOrder.splice(indexToInsert + 1, 0, entity);
        this._turnOrderVisual.updateOnExtraTurn(this._turnOrder, this._activeIndex);
    }
};

Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_onTurnOrderEnd = BattleManagerTBS.onTurnOrderEnd;
BattleManagerTBS.onTurnOrderEnd = function () {
    this.removeExtraTurns();
    Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_onTurnOrderEnd.call(this);
};

BattleManagerTBS.removeExtraTurns = function () {
    this._turnOrder = LeUtilities.uniqArray(this._turnOrder);
    this._turnOrderVisual.updateOnExtraTurn(this._turnOrder, this._activeIndex);
    this.allEntities().forEach(function (entity) {
        entity._gotExtraTurn = false;
    });
};

Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_onActionEnd = BattleManagerTBS.onActionEnd;
BattleManagerTBS.onActionEnd = function () {
    var entity = this.activeEntity();
    if(entity.isCharging()) {
        this.processCommandPass();
        return;
    }
    Lecode.S_TBS.TimelineControl.oldBattleManagerTBS_onActionEnd.call(this);
};

/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
TBSTurnOrderVisual.prototype.updateOnExtraTurn = function (newOrder, oldIndex) {
    this.set(newOrder);
    this._activeIndex = oldIndex;
    this.setPositions();
    this.updateOrderState();
};


/*-------------------------------------------------------------------------
* DataManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.TimelineControl.oldDataManager_processLeTBSTags = DataManager.processLeTBSTags;
DataManager.processLeTBSTags = function () {
    Lecode.S_TBS.TimelineControl.oldDataManager_processLeTBSTags.call(this);
    this.processLeTBS_TimelineControlTagsForBattlers();
    this.processLeTBS_TimelineControlTagsForEquipmentsAndStates();
    this.processLeTBS_TimelineControlTagsForObjects();
};


DataManager.processLeTBS_TimelineControlTagsForBattlers = function () {
    var groups = [$dataActors, $dataEnemies, $dataClasses];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_extraTurn = 0;

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/extra_turn\s?:\s?(.+)\%/i)) {
                        obj.leTbs_extraTurn = Number(RegExp.$1);
                    }
                }
            }
        }
    }
};

DataManager.processLeTBS_TimelineControlTagsForEquipmentsAndStates = function () {
    var groups = [$dataWeapons, $dataArmors, $dataStates];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_extraTurn = 0;

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/extra_turn\s?:\s?(.+)\%/i)) {
                        obj.leTbs_extraTurn = Number(RegExp.$1);
                    }
                }
            }
        }
    }
};

DataManager.processLeTBS_TimelineControlTagsForObjects = function () {
    var groups = [$dataSkills, $dataItems, $dataWeapons];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_charge = {
                turns: null,
                anim: 0
            };

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/charge\s?:\s?(.+)/i)) {
                        var strs = RegExp.$1.split(",");
                        obj.leTbs_charge.turns = Number(strs[0].trim());
                        obj.leTbs_charge.anim = Number(strs[1].trim());
                    }
                }
            }
        }
    }
};