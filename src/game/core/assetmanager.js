import * as PIXI from 'pixi.js';
import {GameTex, ButtonTextures, MeteorTex} from './constants.js'

let explosionTextures = [];    

let TextureLoader = PIXI.Loader.shared;

export class AssetManager
{
    constructor()
    {

    }

    getExplosionTextures()
    {
        return explosionTextures;
    }

    loadAssets(callback)
    {
        for (var key in GameTex){
            TextureLoader.add(GameTex[key])
        };
        for (var key in ButtonTextures){
            TextureLoader.add(ButtonTextures[key])
        };
        for (var i = 0; i < MeteorTex.length; i++)
        {
            TextureLoader.add(MeteorTex[i]);
        };

        TextureLoader.load(()=> {
            // for (var i = 0; i < 16; i++) {
            //     const texture = PIXI.Texture.from("explosion"+ i +".png");
            //     explosionTextures.push(texture);
            // }
            callback();
        });
    }

}