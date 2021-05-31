class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }

    create() {
        this.add.text(centerX, centerY - txtSpacing, `Press W for Menu`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + txtSpacing, `Press S for Level Select`, headerConfig).setOrigin(0.5);
        // set up cursor keys
        this.selector = this.input.keyboard.addKeys({w: "W", s:"S"});
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(this.selector.w)) {
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(this.selector.s)) {
            this.scene.start('title');
        }
    }
}