class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }

    create() {
        this.add.text(centerX, centerY + txtSpacing*2.5, `Press Down ARROW for Menu`, subConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - txtSpacing*2.5, `Press Down Up for Level Select`, subConfig).setOrigin(0.5);
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.scene.start('title');
        }
    }
}