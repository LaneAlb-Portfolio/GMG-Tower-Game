// Phaser Game Settings
let config = {
    parent: 'Endless Runner',
    type: Phaser.FIT,
    scale: {
        width: 680,
        height: 480,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {//if we want specific settings for arcade physics put in here
            //gravity: {y: 1000},
            tileBias: 32,
            debug: true,
        }
    },
    scene: [ Load, Title, Tutorial, Level1, Select, GameOver, Credits, StaticCredits ] // to change where loading screen is move it around in this array
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
let movement;
let completed = [0,0,0,0,0]; // check for completed levels
let backmusic;
// text configs use Font we want later
// change or add more configs as needed
let titleConfig = {fontFamily: 'thinPixel', fontSize: '128px', color: '#FFFFFF'};
let headerConfig= {fontFamily: 'thinPixel', fontSize: '72px', color: '#FFFFFF'};
let bodyConfig  = {fontFamily: 'thinPixel', fontSize: '36px', color: '#FFFFFF'};
let subConfig   = {fontFamily: 'thinPixel', fontSize: '15px', color: '#FFFFFF'};
let logoConfig  = {fontFamily: 'thinPixel', fontSize: '72px', backgroundColor: '#FFFFFF', color: '#000000'};
let buttonConfg = {fontFamily: 'thinPixel', fontSize: '128px', color: '#FFFFFF', align: 'center'};