import {SpriteFactory, TextFactory, VFXFactory} from '../core/coreutilities.js'
import {screenSize, GameTex, MeteorTex, scoreTextStyle} from '../core/constants.js'
import {fixedSpawns, ProjectileType, GameState, MaxHP, ScoreIncrement,
    CruiseSpeed, MaxMeteorsCount, MaxMissilesCount, MaxExplosionsCount,
    MinShipMeteorCollisionDist, MinMissileMeteorCollisionDist,
    MeteorMaxSpeed, MissileSpeed,
    MeteorWidth, MeteorHeight,MeteorDamage
    } from '../core/constants.js'

import {MathUtils, VectorUtils} from '../utils/helpers.js';

import {GameHUD} from '../core/GameHUD.js'

import {HealthBar, BattleShip, Projectile} from '../core/gameobjects.js'
import * as PIXI from 'pixi.js';


var meteorsPool = [];
var meteorsActive = [];

var missilesPool = [];
var missilesActive = [];

var explosionsPool = [];
var explosionsActive = [];


var gameState = GameState.INITIALIZE;



var PlayerData = 
{
    hp: 100,
    score:0,
}

let loader = PIXI.Loader.shared;

let explosionTextures = [];    

export class GameboardScene
{
    constructor(app, sceneName)
    {
        this.name = sceneName;

        this.container = new PIXI.Container();

        app.stage.addChild(this.container);

        this.hud = new GameHUD(app);
        
    }

    getPlayerData()
    {
        return PlayerData;
    }
    getState()
    {
        return gameState;
    }
    setState(state)
    {
        console.log("state " + state );
        gameState = state;
    }

    initialize(app)
    {
        let screenCenter = {x:screenSize.width *0.5, y:screenSize.height *0.5}

        let bgTexture = loader.resources[GameTex.bg].texture;
        let bgObj = SpriteFactory.createSprite(bgTexture, screenCenter, screenSize.width, screenSize.height);
        this.addChild(bgObj);

        let spaceshipTexture = loader.resources[GameTex.spaceship].texture;
        this.playerShip  = new BattleShip (spaceshipTexture, screenCenter, CruiseSpeed);
        this.addChild(this.playerShip.ship);

        this.message  = TextFactory.createText(scoreTextStyle, 26, {x:60, y:40});
        this.addChild(this.message);
        this.message.text = "Score:";

        this.healthBarObj = new HealthBar({x:10, y:10}, 200, 10);
        this.addChild(this.healthBarObj.healthBar);

        
        for (var i = 0; i < 16; i++) {
            const texture = PIXI.Texture.from("explosion"+ i +".png");
            explosionTextures.push(texture);
        }
        this.hud.initialize();

        this.hud.setShipControls(this.playerShip);
        this.hud.setFireMissilesListener(this);
        this.hud.setStateListener(this);
    }
    
    onStateChange(state)
    {
        console.log("state " + state);
        gameState = state;
    }

    addChild(childObject)
    {
        this.container.addChild(childObject);
    }

    removeChild(childObject)
    {
        this.container.removeChild(childObject);
    }

    onKeyUp(key)
    {
        if (key.keyCode === 87 || key.keyCode === 38) {
            this.playerShip.move(false);
        }

        if (key.keyCode === 70) {
            this.spawnMissiles();
        }

        if ((key.keyCode === 65 || key.keyCode === 37) ||  (key.keyCode === 68 || key.keyCode === 39)) {
            this.playerShip.turnShip(0);
        }
    }

    onKeyDown(key)
    {
        if (key.keyCode === 87 || key.keyCode === 38) {
            console.log("UP");
            this.playerShip.move(true);
        }

        if (key.keyCode === 65 || key.keyCode === 37) {
            console.log("LEFT");
            this.playerShip.turnShip(-1);
        }

        if (key.keyCode === 68 || key.keyCode === 39) 
        {
            this.playerShip.turnShip(1);
        }
    }

    getRandomLocation()
    {
        var index = Math. floor((Math.random() * fixedSpawns.length));
        //console.log("Index Spawn " + index);
       
        return fixedSpawns[index];
    }

    setMeteor(meteor)
    {
        let randomMeteor = Math.floor(Math.random() * 4);
        
        meteor.projectile.texture = loader.resources[MeteorTex[randomMeteor]].texture;
        meteor.projectile.position = this.getRandomLocation();
        meteor.speed = Math.ceil(Math.random() * MeteorMaxSpeed);
        meteor.rotationSpeed = Math.random() * 10;
        meteor.rotationDirection = Math.floor(Math.random() * 2) == 0 ? -1 : 1;

        this.addChild(meteor.projectile);
        meteor.setTarget(this.playerShip.ship);
        meteorsActive.push(meteor);
        
    }
    // Pooling Meteors 
    spawnMeteor()
    {
        if(gameState != GameState.RUNNING)
            return;
            
            
        console.log("spawnMeteor");
        if(meteorsActive.length < MaxMeteorsCount && meteorsPool.length < 1)
        {
            let maxSpeed =  Math.ceil(Math.random() * MeteorMaxSpeed);
            let meteorTex = loader.resources[MeteorTex[0]].texture;
            var meteorObj = new Projectile(meteorTex, this.getRandomLocation(), maxSpeed, ProjectileType.METEOR);
            this.setMeteor(meteorObj);
           
        }
        else if (meteorsPool.length > 0)
        {
            var meteorObj = meteorsPool.pop();
            this.setMeteor(meteorObj);
        }
    }

    setMissile(missileObj)
    {
        missileObj.projectile.position = this.playerShip.ship.position;
        missileObj.projectile.rotation = this.playerShip.ship.rotation;
        this.addChild(missileObj.projectile);
        missilesActive.push(missileObj);
    }
    spawnMissiles()
    {
        if(gameState != GameState.RUNNING)
        {
            return;
        }
        //console.log("spawnMissiles " + missilesActive.length + " " + missilesPool.length);
        if(missilesActive.length < MaxMissilesCount && missilesPool.length < 1)
        {
            let missileTex = loader.resources[GameTex.missile].texture
            var missileObj = new Projectile(missileTex, this.playerShip.ship, MissileSpeed,  ProjectileType.MISSILE);
            this.setMissile(missileObj);
        }
        else if (missilesPool.length > 0)
        {
            var missileObj = missilesPool.pop();
            this.setMissile(missileObj);
        }
    }

    despawnExplosions(index)
    {
        var vfxExplosion = explosionsActive[index];
        this.container.removeChild(vfxExplosion);
        explosionsActive.splice(index, 1);
        
        explosionsPool.push(vfxExplosion);
    }

    spawnVFXExplosions(position)
    {
        if(explosionsActive.length < MaxExplosionsCount && explosionsPool.length < 1)
        {
            let vfxExplosion = VFXFactory.createExplosions(explosionTextures, position);
            this.addChild(vfxExplosion);
            explosionsActive.push(vfxExplosion);
            vfxExplosion.gotoAndPlay(0);
            
            vfxExplosion.onComplete = () =>
            {
                this.despawnExplosions(0);
            }
        }
        else if (explosionsPool.length > 0)
        {
            let vfxExplosionObj = explosionsPool.pop();
            vfxExplosionObj.x = position.x;
            vfxExplosionObj.y = position.y;
            this.addChild(vfxExplosionObj);
            explosionsActive.push(vfxExplosionObj);
            vfxExplosionObj.gotoAndPlay(0);
        }
    }

    isOutOfBounds(target)
    {
        let screenHeight = screenSize.height;
        let screenWidth = screenSize.width;
        var position = target.projectile.position;
        
        if((target.type == ProjectileType.MISSILE) 
            && (position.x > screenWidth || position.x < 0 
            || position.y < 0|| position.y > screenHeight))
        {
            return true;
        }
        else if ((target.type == ProjectileType.METEOR) 
            && (position.x > screenWidth + (MeteorWidth * 1.5) || position.x < -(MeteorWidth * 1.5) 
            || position.y < -(MeteorHeight * 1.5) || position.y > screenHeight + (MeteorHeight * 1.5)))
        {
            return true;
        }

        return false;
    }

    updatePlayerDataDisplay()
    {
        this.healthBarObj.setProgress(PlayerData.hp / MaxHP);
        this.message.text = "Score: " + PlayerData.score;
    }
    resetValues()
    {
        PlayerData.hp = MaxHP;
        PlayerData.score = 0;

        this.playerShip.ship.x = screenSize.width * 0.5; 
        this.playerShip.ship.y = screenSize.height * 0.5; 
        this.playerShip.ship.rotation = MathUtils.degToRad(-90);
    }
    update(delta)
    {
        switch(gameState)
        {
        case  GameState.INITIALIZE:
            
            this.resetValues();
            
            
            gameState = GameState.START;
        case GameState.START:
            this.updatePlayerDataDisplay();
            this.hud.setStart();
            break;
        case GameState.RUNNING:
            if(this.playerShip != null)
            {
                this.playerShip.update(delta)
            }
            
            this.updateMeteorPositions(delta);
            this.updateMissilePositions(delta);

            this.updatePlayerDataDisplay();

            if(PlayerData.hp <= 0)
            {
                console.log("Game over"); 
                this.setGameOver();
            }
            
            break;
        case  GameState.GAME_OVER:
            break;
        }
    }

    despawnMeteor(index)
    {
        var meteorObj = meteorsActive[index];
        this.container.removeChild(meteorObj.projectile);
        meteorsActive.splice(index, 1);
        
        meteorsPool.push(meteorObj);
    }

    updateMeteorPositions(delta)
    {
        if(meteorsActive.length > 0)
        {
            for(var ctr = 0; ctr < meteorsActive.length; ctr++)
            {
                if(this.isOutOfBounds(meteorsActive[ctr]))
                {
                    this.despawnMeteor(ctr);
                    ctr--;
                }
                else 
                {
                    meteorsActive[ctr].update(delta);

                    if(meteorsActive[ctr].collisionTest(this.playerShip.ship, MinShipMeteorCollisionDist))
                    {
                        console.log("PlayerShip HP deduction");
                        PlayerData.hp -= MeteorDamage;
                        this.spawnVFXExplosions(meteorsActive[ctr].projectile.position);
                        this.despawnMeteor(ctr);
                        ctr--;
                    }
                }
            }
        }
    }

    despawnMissiles(index)
    {
        var missileObj = missilesActive[index];
        this.container.removeChild(missileObj.projectile);
        missilesActive.splice(index, 1);
        missilesPool.push(missileObj);
    }

    updateMissilePositions(delta)
    {
        if(missilesActive.length > 0)
        {
            for(var ctr = 0; ctr < missilesActive.length; ctr++)
            {
                if(this.isOutOfBounds(missilesActive[ctr]))
                {
                    this.despawnMissiles(ctr);
                    ctr--;
                }
                else 
                {
                    missilesActive[ctr].update(delta);

                    for(var ctr2 = 0; ctr2 < meteorsActive.length; ctr2++)
                    {
                        // distance check between missiles and meteors
                        if(meteorsActive[ctr2].collisionTest(missilesActive[ctr].projectile, MinMissileMeteorCollisionDist))
                        {
                            console.log("Destroy meteor");
                            this.spawnVFXExplosions(missilesActive[ctr].projectile.position);
                            PlayerData.score += ScoreIncrement;
                            this.despawnMeteor(ctr2);
                            this.despawnMissiles(ctr);
                            ctr--;
                            break;
                        }
                    }
                }
            }
        }
    }

    setGameOver()
    {
        gameState = GameState.GAME_OVER;

        //gameboardScene.addChild(briefingPopup.popupContainer);
        this.hud.setGameOver();
        
        if(missilesActive.length > 0)
        {
            while( missilesActive.length > 0)
            {
                this.despawnMissiles(0);
            }
        }

        if(meteorsActive.length > 0)
        {
            while( meteorsActive.length > 0 )
            {
                this.despawnMeteor(0);
            }
        }
    }
  
}