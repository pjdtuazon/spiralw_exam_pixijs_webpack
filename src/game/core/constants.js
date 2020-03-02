export var GameState = {
    INITIALIZE: 0, //no state, not running and pre-start
    START: 1, // initializing
    RUNNING: 2,
    PAUSED: 3, // pause ticker
    GAME_OVER: 4, // set game over
};

export var ProjectileType = {
    METEOR: 0,
    MISSILE: 1,
};

export const screenSize = {
    width: 480,
    height: 720
}

export const fixedSpawns = [
    {x:100, y:-100},
    {x:200, y:-100},
    {x:480, y:-100},
    {x:100, y:820},
    {x:200, y:820},
    {x:480, y:820},
    {x:580, y:200},
    {x:580, y:600},
    {x:580, y:400},
    {x:-100, y:200},
    {x:-100, y:600},
    {x:-100, y:400},
    ];

export const BattleShipTurnSpeed = 5;
export const SpawnMeteorWaitTime = 1500;
export const CruiseSpeed=2.5;
export const MissileSpeed=7;
export const MeteorMaxSpeed=4;
export const MinShipMeteorCollisionDist= 70;
export const MinMissileMeteorCollisionDist=40;
export const MaxHP = 50;
export const ScoreIncrement = 10;
export const MeteorWidth = 96;
export const MeteorHeight = 96;
export const MeteorDamage = 10;

export const MaxMeteorsCount = 10;
export const MaxMissilesCount = 1;
export const MaxExplosionsCount = 5;

export const GameTex = {
    bg: "img/game/background.png", 
    play_button: "img/ui/button_test1.png",
    spaceship: "img/game/playerShip3_blue.png",
    missile: "img/game/missile.png",
    bgPopup: "img/ui/popup_bg1.png",
    bgFillerPopup: "img/ui/popupbg_filler.png",
    explosionAnim: "img/game/explosion.json"
};
export const ButtonTextures = 
{
    buttonMove: "img/ui/buttonmove.png",
    buttonMovePressed: "img/ui/buttonmove_pressed.png",
    buttonRight: "img/ui/buttonright.png",
    buttonRightPressed: "img/ui/buttonright_pressed.png",
    buttonLeft: "img/ui/buttonleft.png",
    buttonLeftPressed: "img/ui/buttonleft_pressed.png",
    buttonFire: "img/ui/buttonfire.png",
    buttonFirePressed: "img/ui/buttonfire_pressed.png",
    buttonConfirm: "img/ui/buttonconfirm.png",
    buttonConfirmPressed: "img/ui/buttonconfirm_pressed.png",
}

export const MeteorTex = [
    "img/game/meteorBrown_big1.png",
    "img/game/meteorBrown_big2.png",
    "img/game/meteorBrown_big3.png",
    "img/game/meteorBrown_big4.png",
];

export const scoreTextStyle = {
    fontFamily: "Futura",
    fontSize: 26,
    fill: "white"
    };

export const defaultTextStyle = {
    fontFamily: "Tahoma",
    fontSize: 34,
    fill: "black",
    breakWords: true,
    wordWrap:true,
    wordWrapWidth: 360
    
    };

