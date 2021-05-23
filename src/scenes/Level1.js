class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
    }

    create(){ 
        console.log('lvl1 create');
        // temp text
        this.add.text(150, 340, `Hi I am Level1`, subConfig).setOrigin(0.5);
        this.add.text(150, 360, `Press W for Level Select, S for Title Screen`, subConfig).setOrigin(0.5);

        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"});
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(movement.up)) {
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(movement.down)) {
            this.scene.start('title');
        }
    }
}