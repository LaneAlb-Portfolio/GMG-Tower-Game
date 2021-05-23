class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        // Text Bubbles Prefab 
        this.boxMsgs = new TextBubbles();

        //temp background
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
            cursor: 'url(./assets/pointers/FaucetPointer.png), pointer',
        });
        this.facuetsprite.on('pointerdown',(pointer, dragX, dragY) => {// play looped sound when pressed, loop will be later though
            this.sound.play('faucet', {
                volume: 0.15
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
            cursor: 'url(./assets/pointers/DrainPointer.png), pointer',
        });
        this.drainplgsprite.on('drag',(pointer, dragX, dragY) => {// drag the object when hold click
            this.drainplgsprite.x = dragX;
            this.drainplgsprite.y = dragY;
        });
        this.drainplgsprite.on('pointerup',(pointer, dragX, dragY) => {// delete the object when let go and play sound
            this.drainplgsprite.destroy();
            this.water.destroy();
            this.tb.destroy(); // make sure the tooltip isnt left behind
            this.sound.play('drain');
        });

        // ALL Pointer Hover Interactions
        // "pointerover" == when pointer is hovering on object
        // "pointerout " == when pointer is NOT hovering on object
        this.drainplgsprite.on('pointerover', (pointer) => {
            let x = this.drainplgsprite.x ;
            let y = this.drainplgsprite.y;
            y = y - y / 10;
            this.textbox(x, y, 'drain');
        });
        this.drainplgsprite.on('pointerout', (pointer) => {
            this.tb.destroy();
        });
        this.facuetsprite.on('pointerover',(pointer) => {
            let x = this.facuetsprite.x;
            let y = this.facuetsprite.y;
            y = y - y / 10;
            this.textbox(x, y, 'faucet');
        });
        this.facuetsprite.on('pointerout',(pointer) => {
            this.tb.destroy();
        });

        //camera things
        //configuration
        this.cameras.main.setBounds(0,0,bg.displayWidth,480);
        this.cameras.main.setZoom(1.5);
        //have the camera follow the player
        this.cameras.main.startFollow(player);

        // tint entire forground for the "fog of war" effect
        this.rt = new Phaser.GameObjects.RenderTexture(this, 0,0, gameW, gameH).setVisible(false);
        this.cover = this.add.image(0,0, 'tinter').setOrigin(0);
        this.cover.alpha = 0.5;
        this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, this.rt);
        this.cover.mask.invertAlpha = true;
        this.light = this.add.rectangle(player.x, player.y, 100, 150, 0xffffff);
        this.light.visible = false;
        // set up cursor keys and movement keys
        cursors  = this.input.keyboard.createCursorKeys();
        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"});
    }

    update() {
        player.update();
        //fog of war around player
        this.rt.clear();
        this.rt.draw(this.light, player.x, player.y);
        // if player is "wading through water"
        this.physics.world.overlap(player, this.water, player.slow(), null, this);
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.scene.start('title');
        }
    }

    textbox(x, y, objName){
        //console.log("Txtbox being made for:" + objName);
        let height = Phaser.Math.FloorTo((this.boxMsgs.messageLength(objName) * 16) / 80 );
        //console.log("Expected wordWrap == " + height);
        this.txtstyle = {
            fontFamily: 'Dagger', 
            fontSize: '16px',
            color: '#FFFFFF',
            strokeThickness: 1,
            stroke: '#000000',
            backgroundColor: '#81468f',
            align: 'center',
            fixedWidth:  80,
            wordWrap: {width: 80}, // keep width the same as fixedWidth
        }
        this.tb = this.add.text(x, y-((height-1)*10), this.boxMsgs.messageFind(objName), this.txtstyle).setOrigin(0,0);
    }

    ptrMovement(pointer){
        const x = pointer.x - this.cover.x + this.cover.width * 0.5;
        const y = pointer.y - this.cover.y + this.cover.height* 0.5;
        this.rt.clear();
        this.rt.draw(this.ptrLight, x, y);
    }
}