class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        // set up cursor keys for title screen input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            // start play scene
            this.scene.start('title');
        }
    }
}