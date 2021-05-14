class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        // fog of war attempting
        // when you get some temp assets try https://blog.ourcade.co/posts/2020/phaser3-fog-of-war-field-of-view-roguelike/

        //temp background (i think is being used for camera things)
        let bg = this.add.image(0,0,'bg').setOrigin(0);
        // player stuff here
        player = new Player(this, 128, gameH-32, 'player', 0);
        player.setScale(1);
        // temp text
        this.add.text(150, 340, `Hi I am tutorial scene`, subConfig).setOrigin(0.5);
        this.add.text(150, 360, `Press ↑ for Level Select, ↓ for Title Screen`, subConfig).setOrigin(0.5);
        this.add.text(150, 380, `Use the ← → Arrows to Move`, subConfig).setOrigin(0.5);
        this.add.text(600, 420, `Use the mouse to click on the faucet`, subConfig).setOrigin(0.5);
        //scene puzzle things

        this.water = this.add.rectangle (0, 450, 640, 20, 0xfa2d1).setOrigin(0)

        //faucet
        this.facuetsprite = this.add.image(575, 350, 'faucet').setOrigin(0); // add it to the scene
        this.facuetsprite.setScale(0.25); // scale it to the scene
        this.facuetsprite.setInteractive({ // make sure that the object is clickable, and shows hand
            useHandCursor: true
        });
        this.facuetsprite.on('pointerdown',(pointer, dragX, dragY) => {// play looped sound when pressed, loop will be later though
            this.sound.play('faucet', {
                volume: 0.25
            });
        });
        // this.facuetsprite.on('pointerup',(pointer, dragX, dragY) => {// stop playing sound when let go
        //     this.sound.stop()
        // });



        //drain plug
        this.drainplgsprite= this.add.image(25, 457, 'drainplug').setOrigin(0); //add it to the scene
        this.drainplgsprite.setScale(0.15); //scale it to the scene
        this.drainplgsprite.setInteractive({ // make sure that the object is clickable, shows hand, and enables dragablity
            draggable: true,
            useHandCursor: true
        });
        this.drainplgsprite.on('drag',(pointer, dragX, dragY) => {// drag the object when hold click
            this.drainplgsprite.x = dragX;
            this.drainplgsprite.y = dragY;
        });
        this.drainplgsprite.on('pointerup',(pointer, dragX, dragY) => {// delete the object when let go and play sound
            this.drainplgsprite.destroy();
            this.water.destroy();
            this.sound.play('drain')
        });
        

        //camera things
        //configuration
        this.cameras.main.setBounds(0,0,bg.displayWidth,480);
        this.cameras.main.setZoom(1.5);
        //have the camera follow the player
        this.cameras.main.startFollow(player);

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        player.update();
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.scene.start('title');
        }
    }
}