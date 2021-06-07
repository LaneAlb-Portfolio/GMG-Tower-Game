class YouDied extends Phaser.Scene {
    constructor() {
        super('death');
    }

    create() {
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'MainMenu'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createLayer('BG', this.tileset, -64, -64);

        this.add.text(centerX, centerY - txtSpacing, `You Died!`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, `Press A to return to Menu`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + txtSpacing, `Press D to go to level select`, headerConfig).setOrigin(0.5);
        // set up cursor keys
        this.selector = this.input.keyboard.addKeys({a: "A", d:"D"});
    }

    update() {
        // wait for input
        if (Phaser.Input.Keyboard.JustDown(this.selector.a)) {
            this.scene.start('title');
        }
        if (Phaser.Input.Keyboard.JustDown(this.selector.d)) {
            this.scene.start('select');
        }
    }
}