import * as PIXI from 'pixi.js';
import {MathUtils, VectorUtils} from '../utils/helpers.js';
import { screenSize, BattleShipTurnSpeed, ProjectileType } from './constants.js';

export class BattleShip 
{
    constructor(texture, position, velocity)
    {
        this.ship =  new PIXI.Sprite(texture);
        this.ship.anchor.set(0.5, 0.5);
        this.ship.pivot.set(0.5, 0.5);
        this.ship.x = position.x;
        this.ship.y = position.y;
        this.velocity = velocity;

        this.ship.rotation = MathUtils.degToRad(-90);

        this.turnDirection = 0;
    }

    turnShip(turn)
    {
        this.turnDirection = turn;
    }

    move (moveForward) {
        this.moveShip = moveForward;
    }
    
    update (delta)
    {
        if(this.turn != 0)
        {
            this.ship.rotation += MathUtils.degToRad(BattleShipTurnSpeed * this.turnDirection);   
        }

        if(this.moveShip)
        {
           
            this.ship.x += this.velocity * Math.cos(this.ship.rotation);
            this.ship.y += this.velocity * Math.sin(this.ship.rotation);

            if(this.ship.x < 0)
            {
                this.ship.x = screenSize.width;
            }
            else if (this.ship.x > screenSize.width)
            {
                this.ship.x = 0;
            }

            if(this.ship.y < 0)
            {
                this.ship.y = screenSize.height;
            }
            else if (this.ship.y > screenSize.height)
            {
                this.ship.y = 0;
            }
        }

    }

}

export class Projectile
{
    constructor(texture, position, speed, projectileType)
    {
        this.projectile = new PIXI.Sprite(texture);
        this.projectile.x = position.x;
        this.projectile.y = position.y;
        
        this.projectile.anchor.set(0.5, 0.5);
        this.projectile.pivot.set(0.5, 0.5);

        this.speed = speed;
        this.type = projectileType;

        this.rotationSpeed = 0;
        this.rotationDirection = 0;
        
    }

    setTarget(target)
    {
        this.direction = VectorUtils.normalize(target, this.projectile);
    }
    
    update (delta)
    {
        if(this.type == ProjectileType.METEOR)
        {
            this.moveToTarget();
        }
        else if(this.type == ProjectileType.MISSILE)
        {
            this.moveTowardsRotation();
        }

        if(this.rotationSpeed > 0)
        {
            this.projectile.rotation += MathUtils.degToRad(this.rotationSpeed * this.rotationDirection); 
        }

    }

    moveToTarget()
    {
        this.projectile.x += this.direction.x * this.speed;
        this.projectile.y += this.direction.y * this.speed;
    }

    moveTowardsRotation()
    {
        this.projectile.x += this.speed * Math.cos(this.projectile.rotation);
        this.projectile.y += this.speed * Math.sin(this.projectile.rotation);
    }

    collisionTest(target, maxDistance)
    {
        var deltaX = target.x - this.projectile.x;
        var deltaY = target.y - this.projectile.y;
        var norm = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));


        return norm < maxDistance;
    }
}


export class HealthBar
{
    constructor(position, maxWidth, height)
    {
        this.healthBar = new PIXI.Container();
        this.healthBar.position.set(position.x, position.y);
        //gameScene.addChild(healthBar);

        //Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, maxWidth, height);
        innerBar.endFill();
        this.healthBar.addChild(innerBar);

        //Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(0x00FF00);
        outerBar.drawRect(0, 0, maxWidth, height);
        outerBar.endFill();
        this.healthBar.addChild(outerBar);

        this.healthBar.outer = outerBar;

        this.maxWidth = maxWidth;
    }

    setProgress(percentProgress)
    {
        if(percentProgress > 1)
        {
            percentProgress = 1;
        }

        if(percentProgress < 0)
        {
            percentProgress = 0;
        }

        this.healthBar.outer.width = this.maxWidth * percentProgress;
    }
}