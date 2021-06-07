class GameOver extends Phaser.Scene {
    constructor() {
        super('gameover');
    }

    create() {
        this.add.text(centerX, centerY - txtSpacing, `You completed the Level!`, headerConfig).setOrigin(0.5); //Added a title header
        this.add.text(centerX, centerY, `Press N for Next Level `, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + txtSpacing, `Press M to return to Menu`, headerConfig).setOrigin(0.5); // changed the letter for future polish
        // set up cursor keys
        this.selector = this.input.keyboard.addKeys({m: "M", n:"N"});// should be enter for next level and esc for menu
    }

    update() {
        // wait for input
        if (Phaser.Input.Keyboard.JustDown(this.selector.m)) {
            this.scene.start('title');
        }
        if (Phaser.Input.Keyboard.JustDown(this.selector.n)) {
            if(completed[0] == 1){
                this.scene.start('levelOne');
            } else {
                this.scene.start('select');
            }
        }
    }
}