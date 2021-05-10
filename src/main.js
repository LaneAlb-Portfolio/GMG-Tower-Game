// Phaser Game Settings
let config = {
    parent: 'Endless Runner',
    type: Phaser.AUTO,
    height: 480,
    width: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {//if we want specific settings for arcade physics put in here
        }
    },
    scene: [ Title, Load, Tutorial, Select, GameOver, Credits ] // to change where loading screen is move it around in this array
}

// define game
let game = new Phaser.Game(config);
// define game "points"
let centerX = game.config.width  / 2;
let centerY = game.config.height / 2;
let gameW   = game.config.width;
let gameH   = game.config.height;
let txtSpacing = 64;
let player; // this makes referencing player object a bit cleaner
let time;   // time in game, used for event triggers
let cursors;
// text configs use Font we want later
// change or add more configs as needed
let titleConfig = {fontFamily: 'Dagger', fontSize: '72px', color: '#FFFFFF'};
let bodyConfig  = {fontFamily: 'Dagger', fontSize: '36px', color: '#FFFFFF'};
let subConfig   = {fontFamily: 'Dagger', fontSize: '24px', color: '#FFFFFF'};
let logoConfig  = {fontFamily: 'Dagger', fontSize: '72px', backgroundColor: '#FFFFFF', color: '#000000'};