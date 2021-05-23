class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        // setup level buttons
        this.tutorial = this.add.sprite(centerX/3, centerY/3, 'buttons').setOrigin(0.5);
        this.lvl1     = this.add.sprite(centerX, centerY/3, 'button2').setOrigin(0.5);
        //setup button
        this.tutorial.setInteractive().on('pointerdown', () => {this.down('tutorial')});
        this.lvl1.setInteractive().on('pointerdown', () => {this.down('lvl1')});
        // maybe remove cursor key function later but for now its testing sake
        cursors = this.input.keyboard.createCursorKeys();
    }

    down(buttonName){
        console.log(buttonName);
        // move to specific scene heres
        // switch case
        switch(buttonName){
            case 'tutorial':
                this.scene.start('tutorial');
                break;
            case 'lvl1':
                this.scene.start('level1');
                break;
            default:
                console.log('Default Switch Case');
        }
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            // start play scene
            this.scene.start('title');
        }
    }
}
