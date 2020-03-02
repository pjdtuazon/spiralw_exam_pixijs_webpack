import * as PIXI from 'pixi.js';
import {screenSize, ButtonTextures, defaultTextStyle, GameTex } from './constants.js';
import {ButtonFactory, TextFactory, SpriteFactory} from './coreutilities.js';

let loader = PIXI.Loader.shared;

export class Popup
{
    constructor(popupName, parent)
    {
        this.name = popupName;
        this.popupContainer = new PIXI.Container();
      
        this.parent = parent;
    }

    initialize(texture, msg)
    {

        let center = {x: screenSize.width * 0.5, y: screenSize.height * 0.5};
        
        this.bg = SpriteFactory.createSprite(loader.resources[GameTex.bgFillerPopup].texture, {x:screenSize.width, y:screenSize.height}, screenSize.width, screenSize.height);
        this.popupContainer.addChild(this.bg);
        
        this.bgPopup = SpriteFactory.createSprite(texture, center, 400, 300);
        this.popupContainer.addChild(this.bgPopup);

        this.message  = TextFactory.createText(defaultTextStyle, 26, {x:center.x, y:center.y - 50});
        this.popupContainer.addChild(this.message);
        this.message.text = msg;
        
        var texNormal = loader.resources[ButtonTextures.buttonConfirm].texture;;
        var texPressed = loader.resources[ButtonTextures.buttonConfirmPressed].texture;

        this.buttonConfirm = ButtonFactory.createButton(texNormal, texPressed, {x:center.x, y:center.y + 50});
        this.popupContainer.addChild(this.buttonConfirm.button);

        console.log("Initialize popup");
//        this.parent.addChild(this.bg);
    }

    show(isVisible)
    {
       console.log("popup is " + isVisible);
        if(isVisible){
            this.parent.addChild(this.popupContainer);
        }else{
            this.parent.removeChild(this.popupContainer);
        }
    }

    setPopupMessage(msg)
    {
        this.message.text = msg;
    }

    onButtonUp(buttonDownEventListener)
    {
        this.buttonConfirm.setButtonListeners( buttonDownEventListener );
    }
   
}