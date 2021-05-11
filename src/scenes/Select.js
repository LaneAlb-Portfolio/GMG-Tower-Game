class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        // setup level buttons
        this.tutorial = this.add.sprite(centerX/3, centerY/3, 'buttons').setOrigin(0.5);
        this.lvl2     = this.add.sprite(centerX, centerY/3, 'button2').setOrigin(0.5);
        //setup button
        this.tutorial.setInteractive().on('pointerdown', () => {this.down('tutorial')});
        this.lvl2.setInteractive().on('pointerdown', () => {this.down('lvl2')});
        // maybe remove cursor key function later but for now its testing sake
        cursors = this.input.keyboard.createCursorKeys();
    }

    down(buttonName){
        console.log(buttonName);
        // move to specific scene heres
        // switch case
        switch(buttonName){
            case 'tutorial':
                this.scene.start('tutorial'); // why is this like this i hate it but it works
                break;
            case 'lvl2':
                //change elow when lvl2 is made
                console.log('Lvl2 Not Implemented switching to tutorial');
                this.scene.start('tutorial'); // why is this like this i hate it but it works
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
