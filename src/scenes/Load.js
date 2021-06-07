class Load extends Phaser.Scene {
    constructor() {
        super('loading');
    }

    preload() {
        this.load.path = './assets/';
        // BE REALLY GOOD WITH COMMENTS HERE
        // Foreground Tint Image
        this.load.image('tinter', 'imgs/screenTint.jpg');
        // Background Menu Image
        this.load.image('brickBg', 'imgs/spacefg.png');
        // Player
        this.load.atlas('worker', 'imgs/worker_run.png', 'imgs/worker.json');
        this.load.image('work_still', 'imgs/pc_still.png');
        // Tilemap loading
        this.load.image('tilemap 2', 'tilemaps/tilemap 2.png'); // load png
        this.load.tilemapTiledJSON('MainMenu', 'tilemaps/MainMenu.json');
        this.load.tilemapTiledJSON('tutorialMap', 'tilemaps/Tutorial.json'); //load json
        this.load.tilemapTiledJSON('lvl1Map', 'tilemaps/Level1.json'); //load json
        this.load.image('bg', 'imgs/black.jpg');
        //temp drain plug image
        this.load.image('drainplug','imgs/drain_plug.png');
        // waterdrops
        this.load.image('waterdrop', 'imgs/Water Drop.png');
        // moving platform
        this.load.image('mPlat', 'tilemaps/MovingPlat.png');
        // sounds
        this.load.audio('runmp3','sound/EndlessRunSong.mp3');
        this.load.audio('faucet','sound/Wheel Turn.mp3');
        this.load.audio('waterrun','sound/Running Water.mp3');
        this.load.audio('drain','sound/Water Drain.mp3');
        this.load.audio('heartAtt','sound/HeartAttackv1.wav');
        this.load.audio('StomachAche','sound/StomachAche.wav');
        this.load.audio('heartbeat','sound/Heartbeat.mp3');
        this.load.audio('poweringUp','sound/Power up 2.mp3');
        this.load.audio('poweringDown','sound/Power down.mp3');
        this.load.audio('leversfx','sound/Lever Pull.mp3');
        this.load.audio('brainsfx','sound/Brain Electric.mp3');
        // fancified loading screen stuff below
        let width  = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.loadingNum = 0;
        this.add.text(centerX, centerY - txtSpacing, ' GMG ', logoConfig).setOrigin(0.5);
        let loadingText = this.add.text(
            width / 2,
            height / 2 + 185,
            'Loading...',
            {fontFamily: 'thinPixel',
            fontSize: '36px',
            color: '#FFFFFF'}
        );
        loadingText.setOrigin(0.5, 0.5);
        
        let percentText = this.add.text(
            width / 2,
            height / 2 + 215,
            '0%',
            {fontFamily: 'thinPixel',
            fontSize: '24px',
            color: '#FFFFFF'      
        });
        percentText.setOrigin(0.5, 0.5);
                         
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%'); 
        });
            
        this.load.on('complete', function () {
            loadingText.destroy();
            percentText.destroy();
        });

        for (let i = 0; i < 4000; i++) {
            this.load.image('black', 'imgs/black.jpg');
        }
    }

    update(){
        if(true){
        this.scene.start('title');
        }
    }
}