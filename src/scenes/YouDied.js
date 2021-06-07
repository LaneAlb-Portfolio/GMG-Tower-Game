class YouDied extends Phaser.Scene {
    constructor() {
        super('death');
    }

    create() {
        this.add.text(centerX, centerY - 2*txtSpacing, `You Died!`, titleConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, `Press R to Retry the Level`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + txtSpacing, `Press M to go to Main Menu`, headerConfig).setOrigin(0.5);
        // set up cursor keys
        this.selector = this.input.keyboard.addKeys({m: "M", r:"R"});
    }

    update() {
        // wait for input
        if (Phaser.Input.Keyboard.JustDown(this.selector.m)) {
            this.scene.start('title');
        }
        if (Phaser.Input.Keyboard.JustDown(this.selector.r)) {
                    if(completed[1] == 1){
                        this.scene.start('levelOne');
                    } else {
                        this.scene.start('tutorial');
                    }
                }
    }
}