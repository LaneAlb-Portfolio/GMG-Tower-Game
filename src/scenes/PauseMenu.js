class PauseMenu extends Phaser.Scene {
    constructor() {
        super('pausemenu');
    }

    create() {
        this.add.text(centerX, centerY - txtSpacing, `You Died!`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, `Press R to Retry`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + txtSpacing, `Press M for Main Menu`, headerConfig).setOrigin(0.5);
        // set up cursor keys
        this.selector = this.input.keyboard.addKeys({r: "R", m:"M"});
    }

    update() {
        // wait for input
        if (Phaser.Input.Keyboard.JustDown(this.selector.m)) {
            this.scene.start('title');
        }
        if (Phaser.Input.Keyboard.JustDown(this.selector.r)) {
            this.scene.start('select');
        }
    }
}