class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        game.stage.backgroundColor = '#ffa500';
        // setup level buttons
        tutorial = game.add.button(centerX, centerY, 'buttons', down(), this, 1, 0 ,2);
        // set up cursor keys for level select input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            // start play scene
            this.scene.start('title');
        }
    }

    over(){
        console.log('Hovered over a Button');
    }
    down(){
        console.log('Clicked Down on button');
        // move to specific scene heres
        this.scene.start('tutorial');
    }
}