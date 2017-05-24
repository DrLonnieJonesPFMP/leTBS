/*
#=============================================================================
# Web Canvas Control
# LeWebCanvasControl.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# Credit required
# Free to use for commercial and non-commercial games
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================*/
var Imported = Imported || {};
Imported.LeWebCanvasControl = true;

var Lecode = Lecode || {};
Lecode.WebCanvasControl = {};
/*:
 * @plugindesc Adds a summoning system
 * @author Lecode
 * @version 1.0
 *
 * @help
 * See the documentation
 */
//#=============================================================================

Lecode.WebCanvasControl.folderPath = "miniDemo/";
Lecode.WebCanvasControl.canvasWidth = 816;
Lecode.WebCanvasControl.canvasHeigh = 624;
Lecode.WebCanvasControl.canvasCenter = false;
Lecode.WebCanvasControl.canvasParentId = "rmmv_canvas";


/*-------------------------------------------------------------------------
* Parameters
-------------------------------------------------------------------------*/
AudioManager._path              = Lecode.WebCanvasControl.folderPath + 'audio/';
PluginManager._path             = Lecode.WebCanvasControl.folderPath + 'js/plugins/';
SceneManager._screenWidth       = Lecode.WebCanvasControl.canvasWidth;
SceneManager._screenHeight      = Lecode.WebCanvasControl.canvasHeigh;
SceneManager._boxWidth          = Lecode.WebCanvasControl.canvasWidth;
SceneManager._boxHeight         = Lecode.WebCanvasControl.canvasHeigh;

/*-------------------------------------------------------------------------
* Graphics
-------------------------------------------------------------------------*/
/*Lecode.WebCanvasControl.oldGraphics_createAllElements = Graphics._createAllElements;
Graphics._createAllElements = function() {
    var parent = document.getElementById(Lecode.WebCanvasControl.canvasParentId);
    parent.style.width = this._width;
    parent.style.height = this._height;
    console(parent.style);
    Lecode.WebCanvasControl.oldGraphics_createAllElements.call(this);
};*/

Graphics._updateCanvas = function() {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 1;
    if (Lecode.WebCanvasControl.canvasCenter)
        this._centerElement(this._canvas);
};

Graphics._updateUpperCanvas = function() {
    this._upperCanvas.width = this._width;
    this._upperCanvas.height = this._height;
    this._upperCanvas.style.zIndex = 3;
    //if (Lecode.WebCanvasControl.canvasCenter)
        this._centerElement(this._upperCanvas);
    this._upperCanvas.style.top = String(-Lecode.WebCanvasControl.canvasHeigh*2) + "px";
};

Graphics._updateErrorPrinter = function() {
    this._errorPrinter.width = this._width * 0.9;
    this._errorPrinter.height = 40;
    this._errorPrinter.style.textAlign = 'center';
    this._errorPrinter.style.textShadow = '1px 1px 3px #000';
    this._errorPrinter.style.fontSize = '20px';
    this._errorPrinter.style.zIndex = 99;
    //if (Lecode.WebCanvasControl.canvasCenter)
        this._centerElement(this._errorPrinter);
    this._errorPrinter.style.top = String(-Lecode.WebCanvasControl.canvasHeigh*2) + "px";
};

Graphics._createErrorPrinter = function() {
    this._errorPrinter = document.createElement('p');
    this._errorPrinter.id = 'ErrorPrinter';
    this._updateErrorPrinter();
    document.getElementById(Lecode.WebCanvasControl.canvasParentId).appendChild(this._errorPrinter);
};

Graphics._createCanvas = function() {
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'GameCanvas';
    this._updateCanvas();
    document.getElementById(Lecode.WebCanvasControl.canvasParentId).appendChild(this._canvas);
};

Graphics._createVideo = function() {
    this._video = document.createElement('video');
    this._video.id = 'GameVideo';
    this._video.style.opacity = 0;
    this._updateVideo();
    document.getElementById(Lecode.WebCanvasControl.canvasParentId).appendChild(this._video);
};

Graphics._createUpperCanvas = function() {
    this._upperCanvas = document.createElement('canvas');
    this._upperCanvas.id = 'UpperCanvas';
    this._updateUpperCanvas();
    document.getElementById(Lecode.WebCanvasControl.canvasParentId).appendChild(this._upperCanvas);
};

Graphics._createModeBox = function() {
    var box = document.createElement('div');
    box.id = 'modeTextBack';
    box.style.position = 'absolute';
    box.style.left = '5px';
    box.style.top = '5px';
    box.style.width = '119px';
    box.style.height = '58px';
    box.style.background = 'rgba(0,0,0,0.2)';
    box.style.zIndex = 9;
    box.style.opacity = 0;

    var text = document.createElement('div');
    text.id = 'modeText';
    text.style.position = 'absolute';
    text.style.left = '0px';
    text.style.top = '41px';
    text.style.width = '119px';
    text.style.fontSize = '12px';
    text.style.fontFamily = 'monospace';
    text.style.color = 'white';
    text.style.textAlign = 'center';
    text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
    text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode';

    document.getElementById(Lecode.WebCanvasControl.canvasParentId).appendChild(box);
    box.appendChild(text);

    this._modeBox = box;
};

Graphics._createFontLoader = function(name) {
    var div = document.createElement('div');
    var text = document.createTextNode('.');
    div.style.fontFamily = name;
    div.style.fontSize = '0px';
    div.style.color = 'transparent';
    div.style.position = 'absolute';
    div.style.margin = 'auto';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.width = '1px';
    div.style.height = '1px';
    div.appendChild(text);
    document.getElementById(Lecode.WebCanvasControl.canvasParentId).appendChild(div);
};

Graphics._disableTextSelection = function() {
    var body = document.getElementById(Lecode.WebCanvasControl.canvasParentId);
    body.style.userSelect = 'none';
    body.style.webkitUserSelect = 'none';
    body.style.msUserSelect = 'none';
    body.style.mozUserSelect = 'none';
};

Graphics._disableContextMenu = function() {
    var elements = document.getElementById(Lecode.WebCanvasControl.canvasParentId).getElementsByTagName('*');
    var oncontextmenu = function() { return false; };
    for (var i = 0; i < elements.length; i++) {
        elements[i].oncontextmenu = oncontextmenu;
    }
};

Graphics._requestFullScreen = function() {
    var element = document.getElementById(Lecode.WebCanvasControl.canvasParentId);
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

/*-------------------------------------------------------------------------
* DataManager
-------------------------------------------------------------------------*/
DataManager.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = Lecode.WebCanvasControl.folderPath + 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

/*-------------------------------------------------------------------------
* SceneManager
-------------------------------------------------------------------------*/
SceneManager.initGraphics = function() {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage(Lecode.WebCanvasControl.folderPath + 'img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};

/*-------------------------------------------------------------------------
* ImageManager
-------------------------------------------------------------------------*/
ImageManager.loadAnimation = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/animations/', filename, hue, true);
};

ImageManager.loadBattleback1 = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/battlebacks1/', filename, hue, true);
};

ImageManager.loadBattleback2 = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/battlebacks2/', filename, hue, true);
};

ImageManager.loadEnemy = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/enemies/', filename, hue, true);
};

ImageManager.loadCharacter = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/characters/', filename, hue, false);
};

ImageManager.loadFace = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/faces/', filename, hue, true);
};

ImageManager.loadParallax = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/parallaxes/', filename, hue, true);
};

ImageManager.loadPicture = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/pictures/', filename, hue, true);
};

ImageManager.loadSvActor = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/sv_actors/', filename, hue, false);
};

ImageManager.loadSvEnemy = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/sv_enemies/', filename, hue, true);
};

ImageManager.loadSystem = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/system/', filename, hue, false);
};

ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/tilesets/', filename, hue, false);
};

ImageManager.loadTitle1 = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/titles1/', filename, hue, true);
};

ImageManager.loadTitle2 = function(filename, hue) {
    return this.loadBitmap(Lecode.WebCanvasControl.folderPath + 'img/titles2/', filename, hue, true);
};