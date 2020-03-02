import {MathUtils, VectorUtils} from './game/utils/helpers.js';
import {screenSize, GameTex, GameState, SpawnMeteorWaitTime} from './game/core/constants.js';
import {AssetManager} from './game/core/assetmanager.js';
import {GameboardScene} from './game/scenes/GameboardScene.js';

import * as PIXI from 'pixi.js';

const canvas = document.getElementById("gamecanvas");

let app = new PIXI.Application({
    view: canvas, 
    width: screenSize.width, 
    height: screenSize.height,
    resolution: window.devicePixelRatio,
    autoDensity: true
    });
    
app.render(app.stage);

let assetManager = new AssetManager();

assetManager.loadAssets(setup);

let gameboardScene = new GameboardScene(app, "GameboardScene");

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function setup()
{
    console.log(">> " + GameTex.bg);
    gameboardScene.initialize(app);
    app.ticker.add(delta => {gameboardScene.update(delta);});

    setTimeout(triggerMeteorFire, SpawnMeteorWaitTime);
    gameboardScene.setState(GameState.INITIALIZE);
}

function triggerMeteorFire()
{
    setTimeout(triggerMeteorFire, SpawnMeteorWaitTime);

    gameboardScene.spawnMeteor();
}

function onKeyDown(key)
{
    gameboardScene.onKeyDown(key);
}
function onKeyUp(key)
{
    gameboardScene.onKeyUp(key);
}