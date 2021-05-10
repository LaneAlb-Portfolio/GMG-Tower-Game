class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        game.stage.backgroundColor = '#808080'; //temp background
        //temp text to just let us know we are in the right spot
        this.add.text(centerX, centerY + txtSpacing*2.5, `Hi I am tutorial scene`, subConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - txtSpacing*2.5, `Press Up for Level Select, Down for Title Screen`, subConfig).setOrigin(0.5);
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