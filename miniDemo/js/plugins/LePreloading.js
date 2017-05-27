/*
#=============================================================================
# Preloading
# LePreloading.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# -Credits me
# -Free to use for both commercial and non-commercial games
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported.LePreloading = true;

var Lecode = Lecode || {};
Lecode.S_Preloading = {};
/*:
 * @plugindesc Preload entire folder of images
 * @author Lecode
 * @version 1.0
 *
 * 
* @param Folders
* @desc ...
* @default [/img/animations]
*
* @param Preload Sounds
* @desc ...
* @default true
*
 * @help
 * See the documentation
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LePreloading');

Lecode.S_Preloading.folders = String(parameters["Folders"] || "[/img/animations]");
Lecode.S_Preloading.preloadSounds = String(parameters["Preload Sounds"] || 'true') === 'true';


/*-------------------------------------------------------------------------
* Determine base url
-------------------------------------------------------------------------*/
var script = document.currentScript;
var fullUrl = script.src;
var baseUrl = fullUrl.replace(/\/js\/plugins\/(.+)\.js/i, "")
    .replace("file:///", "")
    .replace(/%20/ig, " ");
var fs = require('fs');

var uniqArray = function (array) {
    var func = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    return array.filter(func);
};

/*-------------------------------------------------------------------------
* Scene_Boot
-------------------------------------------------------------------------*/
Lecode.S_Preloading.oldSceneBoot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function () {
    Lecode.S_Preloading.oldSceneBoot_start.call(this);
    this.preloadImages();
    if (Lecode.S_Preloading.preloadSounds)
        this.preloadSounds();
};

Scene_Boot.prototype.preloadImages = function () {
    for (var i = 0; i < Lecode.S_Preloading.folders.length; i++) {
        var folderPath = Lecode.S_Preloading.folders[i];
        var path = baseUrl + folderPath;
        var files = fs.readdirSync(path);
        for (var j = 0; j < files.length; j++) {
            var filename = files[j]
                .replace(".png", "")
                .replace(/%20/ig, " ");
            if (path.match("/img")) {
                console.log("File preloaded: ", folderPath + "/" + filename);
                ImageManager.loadBitmap(folderPath.replace("/", "") + "/", filename, 0, true);
            }
        }
    }
};

Scene_Boot.prototype.preloadSounds = function () {
    var sounds = [];
    var path = baseUrl + "/audio/se";
    var files = fs.readdirSync(path).map(function (file) {
        return file.slice(0, file.length - 4);
    });
    files = uniqArray(files);
    $dataSystem.sounds.forEach(function(se){
        sounds.push(se);
    });
    files.forEach(function (filename) {
        sounds.push({
            name: filename,
            volume: 90,
            pitch: 100
        });
    });
    for(var i = 0; i < sounds.length; i++) {
        var se = sounds[i];
        console.log("Audio preloaded: ", "/audio/se/" + se.name);
        AudioManager.loadStaticSe(se);
    }
};
