class Controls extends Phaser.Scene {
    constructor() {
        super('Controls');
    }

    create() {
        // score text flying across screen
        let title = this.add.text(centerX, centerY - 2*txtSpacing, `Controls`, titleConfig).setOrigin(0.5);
        let controls = this.add.text(centerX, centerY, `"WASD" To move\nSpace to Jump\nMouse1 to Click`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, gameH - txtSpacing, 'S to go back to the Menu', bodyConfig).setOrigin(0.5);
        // set up cursor keys for title screen input
        this.selectors = this.input.keyboard.addKeys({up:"W", space:"SPACE", down:"S"});
    

        // // "back" arrow geometry
        // this.body  = this.add.rectangle(112, gameH - 74, 74, 37, 0x6666ff).setOrigin(0.5);
        // this.point = this.add.triangle(32, gameH - 74, 25, 37, 74, 74, 74, 0, 0x6666ff).setOrigin(0.5);
        // this.point.setStrokeStyle(3, 0x545454);
        // this.body .setStrokeStyle(3, 0x545454);
        // //setup click events
        // this.point.setInteractive().on('pointerdown', () => {this.down('back')});
        // this.body.setInteractive().on('pointerdown', () => {this.down('back')});
    }
    
    // down(buttonName){
    //     console.log(buttonName);
    //     this.hide();
    //     switch(buttonName){
    //         case 'back':
    //             this.hide();
    //             this.scene.start('title');
    //             break;
    //         default:
    //             console.log('Default Switch Case');
    //     }
    // }

    update() {  
        if (Phaser.Input.Keyboard.JustDown(this.selectors.down)) {
        // start play scene
        this.scene.start('title');
    } }


    // hide(){
    //     if(this.Access.visible){
    //         this.Access.setVisible(0);
    //     }
    //     if(this.WiP.visible){
    //         this.WiP.setVisible(0);
    //     }
    // }
}