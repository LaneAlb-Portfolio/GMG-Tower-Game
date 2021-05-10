class Load extends Phaser.Scene {
    constructor() {
        super('loading');
    }

    preload() {
        this.load.path = './assets/';
        // BE REALLY GOOD WITH COMMENTS HERE
        // LEVEL SELECT Assets
        game.load.spritesheet('buttons', 'imgs/number-buttons-90x90.png', 90, 90);
        // Tutorial Loadin Assets
        
        // fancified loading screen stuff below
        let width  = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.loadingNum = 0;
        let GMG = this.add.text(centerX, centerY - txtSpacing, ' GMG ', logoConfig).setOrigin(0.5);
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
            this.load.image('black', 'img/black.png')
        }
    }

    update(){
        if(true){
        this.scene.start('select');
        }
    }
}