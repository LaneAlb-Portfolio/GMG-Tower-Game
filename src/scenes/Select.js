class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        // setup level buttons
        this.tutorial = this.add.sprite(centerX/3, centerY/3, 'buttons').setOrigin(0.5);
        //setup button
        this.tutorial.setInteractive();
        this.input.on('gameobjectdown',this.down);
        // maybe remove cursor key function later but for now its testing sake
        cursors = this.input.keyboard.createCursorKeys();
    }

    over(){
        console.log('Hovered over a Button');
    }
    down(buttonName){
        console.log(buttonName);
        // move to specific scene heres
        // switch case
        this.scene.scene.start('tutorial'); // why is this like this i hate it but it works
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            // start play scene
            this.scene.start('title');
        }
    }
}
