class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        // background music
        backmusic = this.sound.add('runmp3',{
            mute: false,
            volume: 0.8,
            rate: 0.5,
            loop:true
        });
        backmusic.play();
        // Background
        this.add.image(centerX, 0, 'brickBg').setOrigin(0).setTint(0xb1741a).setRotation(1.5708);
        this.add.image(gameW, 0, 'brickBg').setOrigin(0).setTint(0xdf7544).setRotation(1.5708);
        // Title Txt
        let title = this.add.text(centerX - 15, centerY - txtSpacing, 'Tower Demo', titleConfig).setOrigin(0.5).setTint(0x887255);
        // Body
        this.add.text(centerX, centerY + txtSpacing, 'Press W for Level Select', headerConfig).setOrigin(0.5);
        this.add.text(centerX, gameH - txtSpacing*2, 'Space for Credits', headerConfig).setOrigin(0.5);
        this.add.text(centerX, gameH - txtSpacing, 'GMG 2021', bodyConfig).setOrigin(0.5);
        this.add.text(centerX, gameH - txtSpacing/2, 'Font by Style-7', bodyConfig).setOrigin(0.5);
        // Mess with below so its cooler
        this.tweens.add({
            targets: title,
            duration: 1500,
            x: { from: centerX - 15, to: centerX + 15 },
            yoyo: true,
            repeat: -1,
            onRepeat: function() {
                this.cameras.main.shake(50, 0.025); //simple shake
            },
            onRepeatScope: this
        });

        // set up cursor keys for title screen input
        this.selectors = this.input.keyboard.addKeys({up:"W", space:"SPACE"});
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.selectors.up)) {
            // start play scene
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(this.selectors.space)) {
            // start play scene
            this.scene.start('credits');
        }
    }
}