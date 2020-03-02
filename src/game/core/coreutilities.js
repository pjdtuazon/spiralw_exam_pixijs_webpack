import * as PIXI from 'pixi.js';
import { screenSize } from './constants.js';

export class VFXFactory
{
    static createExplosions(explosionTextures, position)
    {
       
        let explosion = new PIXI.AnimatedSprite(explosionTextures);
        explosion.name = name;
        explosion.x = screenSize.width * 0.5;
        explosion.y = screenSize.height * 0.5;
        explosion.anchor.set(0.5);

        explosion.x = position.x;
        explosion.y = position.y;

        explosion.rotation = Math.random() * Math.PI;
       // explosion.scale.set(0.75 + Math.random() * 0.5);
        explosion.animationSpeed = 0.75;
        explosion.loop = false;
       
        return explosion;
    }
}

export class SpriteFactory
{
    static createSprite(texture, position, width, height)
    {
        //let texture = Resources[spriteName].texture;
        var sprite = new PIXI.Sprite(texture);

        sprite.x = position.x;
        sprite.y = position.y;

        sprite.pivot.set(0.5, 0.5);
        sprite.anchor.set(0.5, 0.5);

        sprite.width = width;
        sprite.height = height;

        return sprite;
    }

    static createSpriteFromAtlas(spriteName, position, rect)
    {
        //TODO
    }
}

export class TextFactory
{
    static createText(style, fontSize, position)
    {
        style.fontSize = fontSize;
        var message = new PIXI.Text("", style);
        message.pivot.set(0.5, 0.5);
        message.anchor.set(0.5, 0.5);
        message.x = position.x;
        message.y = position.y;

        return message;
    }

}
export class Button
{
    constructor(spriteNormalTex, spritePressedTex)
    {
        this.button = new PIXI.Sprite(spriteNormalTex);

        this.button.pivot.set(0.5, 0.5);
        this.button.anchor.set(0.5, 0.5);

        this.button.interactive = true;
        this.button.buttonMode = true;

        this.spriteNormalTex = spriteNormalTex;
        this.spritePressedTex = spritePressedTex;

        this.button
            .on('pointerupoutside', () => { this.isPressed(false); } )
            .on('pointerover', () => { this.isPressed(false); } )
            .on('pointerout', () => { this.isPressed(false); } );
    }

    setButtonListeners(buttonDown, buttonUp)
    {
        this.button.on('pointerdown', delta => { 
                this.isPressed(true);
                if(buttonDown!=null)
                buttonDown();
            })
            .on('pointerup',  delta => { 
                this.isPressed(false); 
                
                if(buttonUp!=null)
                    buttonUp();
                });
    }

    setPosition(position)
    {
        this.button.x = position.x;
        this.button.y = position.y;
    }

    isPressed(pressed)
    {
        if(pressed)
        {
            this.button.texture = this.spritePressedTex;
        }
        else
        {
            this.button.texture = this.spriteNormalTex;
        }
    }
}
export class ButtonFactory
{
    static createButton(textureNormal,texturePressed, position)
    {
        // let textureNormal = Resources[spriteName].texture;
        // let texturePressed = Resources[spritePressed].texture;

        var buttonObj = new Button(textureNormal, texturePressed);

        buttonObj.setPosition(position);

        return buttonObj;
    }

    static createButtonFromAtlas(spriteName, position, rect)
    {
        // let texture = Resources[spriteName].texture;
        // var rectangle = new PIXI.Rectangle(rect.x, rect.y, rect.width, rect.height);
        // texture.frame = rectangle;
        // var button = new Sprite(texture);

        // button.x = position.x;
        // button.y = position.y;

        // button.pivot.set(0.5, 0.5);
        // button.anchor.set(0.5, 0.5);

        // button.interactive = true;
        // button.buttonMode = true;

        // return button;
    }
}



