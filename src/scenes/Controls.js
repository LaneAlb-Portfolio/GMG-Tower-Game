class Controls extends Phaser.Scene {
    constructor() {
        super('controls');
    }

    create() {

         // Loading Tilemap
         this.map     = this.make.tilemap({key: 'MainMenu'});
         this.tileset = this.map.addTilesetImage('tilemap 2');
         this.map.createLayer('BG', this.tileset, -64, -64);
        
        this.add.text(centerX, centerY - 3*txtSpacing, "Controls", titleConfig).setOrigin(0.5).setScrollFactor(0);
        this.add.text(centerX, centerY - 0.25*txtSpacing, "Move: W A S D\nJump: Space\nInteract: Mouse1", headerConfig).setOrigin(0.5).setScrollFactor(0);
        this.add.text(centerX, centerY + 3*txtSpacing, `Press Esc to go to Main Menu`, headerConfig).setOrigin(0.5);
        // set up cursor keys
        this.selector = this.input.keyboard.addKeys({esc: "ESC"});
    }

   

    update() {
        // wait for input
        if (Phaser.Input.Keyboard.JustDown(this.selector.esc)) {
            this.scene.start('title');
        }
    }
}