import { ButtonFactory, Button} from './coreutilities.js'
import {screenSize, GameTex, ButtonTextures, GameState} from './constants.js'
import {Popup} from './popup.js'

import * as PIXI from 'pixi.js';

let loader = PIXI.Loader.shared;


export class GameHUD
{
    constructor(app)
    {
        this.container = new PIXI.Container();

        app.stage.addChild(this.container);

        this.briefingPopup = new Popup("briefingpopup", this.container);
        this.debriefingPopup = new Popup("debriefingpopup", this.container);
    }

    initialize()
    {
        let screenX = screenSize.width * 0.5;
        var buttonNormal = loader.resources[ButtonTextures.buttonMove].texture;
        var buttonPress = loader.resources[ButtonTextures.buttonMovePressed].texture;
        this.buttonMove = ButtonFactory.createButton(buttonNormal, buttonPress, {x:screenX, y:580});
        
        buttonNormal = loader.resources[ButtonTextures.buttonRight].texture;
        buttonPress = loader.resources[ButtonTextures.buttonRightPressed].texture;
        this.buttonRight = ButtonFactory.createButton(buttonNormal, buttonPress, {x:screenX + 100, y:660});

        buttonNormal = loader.resources[ButtonTextures.buttonLeft].texture;
        buttonPress = loader.resources[ButtonTextures.buttonLeftPressed].texture;
        this.buttonLeft = ButtonFactory.createButton(buttonNormal, buttonPress, {x:screenX - 100, y:660});

        buttonNormal = loader.resources[ButtonTextures.buttonFire].texture;
        buttonPress = loader.resources[ButtonTextures.buttonFirePressed].texture;
        this.buttonFire = ButtonFactory.createButton(buttonNormal, buttonPress, {x:screenX, y:670});

        this.container.addChild(this.buttonMove.button);
        this.container.addChild(this.buttonRight.button);
        this.container.addChild(this.buttonLeft.button);
        this.container.addChild(this.buttonFire.button);

        let bgTex = loader.resources[GameTex.bgPopup].texture;
        
        this.briefingPopup.initialize(bgTex, "Get Ready! When using keyboard, use arrow keys to move, press F to launch missile.");
        this.debriefingPopup.initialize(bgTex, "Game Over");

        this.briefingPopup.onButtonUp(() => {
            this.briefingPopup.show(false);
            this.stateListener.setState(GameState.RUNNING);
        });
        this.debriefingPopup.onButtonUp(() => {
            this.debriefingPopup.show(false);
            this.stateListener.setState(GameState.INITIALIZE);    
        });

    }

    setShipControls(ship)
    {
        this.buttonRight.setButtonListeners( delta => { ship.turnShip(1); }, delta => { ship.turnShip(0); })
        this.buttonLeft.setButtonListeners( delta => { ship.turnShip(-1); }, delta => { ship.turnShip(0); })
        this.buttonMove.setButtonListeners( delta => { ship.move(true); }, delta => { ship.move(false); })
    }

    setFireMissilesListener(inputListener)
    {
        this.buttonFire.setButtonListeners(()=> {}, () => { inputListener.spawnMissiles(); });
    }

    setStateListener(stateListener)
    {
        this.stateListener = stateListener;
    }

    setStart()
    {
        this.briefingPopup.show(true);
    }
    setGameOver()
    {
        this.debriefingPopup.show(true);
    }

    update(delta)
    {
        
    }
}