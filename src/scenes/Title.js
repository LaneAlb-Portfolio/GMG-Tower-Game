class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        // Title Txt
        let title = this.add.text(centerX, centerY - txtSpacing, 'Tower Demo', titleConfig).setOrigin(0.5).setTint(0xff00ff);
        // Body
        this.add.text(centerX, centerY + txtSpacing*2, 'Press UP ARROW to Select Levels', bodyConfig).setOrigin(0.5);
        this.add.text(centerX, gameH - txtSpacing, 'GMG 2021', bodyConfig).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            duration: 1500,
            angle: { from: 1, to: -1 },
            yoyo: true,
            repeat: -1,
            onRepeat: function() {
                this.cameras.main.shake(100, 0.025); //simple shake
            },
            onRepeatScope: this
        });

        // set up cursor keys for title screen input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // start play scene
            this.scene.start('loading');
        }
    }
}