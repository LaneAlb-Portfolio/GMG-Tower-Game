class Load extends Phaser.Scene {
    constructor() {
        super('loading');
    }

    preload() {
        this.load.path = './assets/';
        // BE REALLY GOOD WITH COMMENTS HERE
        // LEVEL SELECT Assets
        this.load.spritesheet('buttons', 'imgs/number-buttons-90x90.png', {frameWidth: 90, frameHeight: 90});
        this.load.image('button2', 'imgs/tempButton2.png');
        // Foreground Tint Image
        this.load.image('tinter', 'imgs/screenTint.jpg');
        // Tutorial Loadin Assets
        // temp player
        this.load.atlas('player', 'imgs/spaceman.png', 'imgs/spaceman.json');
        //temp background
        this.load.image('tilemap', 'tilemaps/tilemap.png'); // load png
        this.load.tilemapTiledJSON('tempAssetMap', 'tilemaps/Tutorial.json'); //load json
        this.load.image('bg', 'imgs/black.jpg');
        //temp faucet image
        this.load.image('faucet', "imgs/faucet.png");
        //temp drain plug image
        this.load.image('drainplug','imgs/drain_plug.png');
        // waterdrops
        this.load.image('waterdrop', 'imgs/Water Drop.png');
        //temp sounds
        this.load.audio('faucet','sound/Turning Off Faucet.mp3');
        this.load.audio('waterrun','sound/Running Water.mp3');
        this.load.audio('drain','sound/Water Drain.mp3');

        // fancified loading screen stuff below
        let width  = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.loadingNum = 0;
        this.add.text(centerX, centerY - txtSpacing, ' GMG ', logoConfig).setOrigin(0.5);
        let loadingText = this.add.text(
            width / 2,
            height / 2 + 185,
            'Loading...',
            {fontFamily: 'Dagger',
            fontSize: '36px',
            color: '#FFFFFF'}
        );
        loadingText.setOrigin(0.5, 0.5);
        
        let percentText = this.add.text(
            width / 2,
            height / 2 + 215,
            '0%',
            {fontFamily: 'Dagger',
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