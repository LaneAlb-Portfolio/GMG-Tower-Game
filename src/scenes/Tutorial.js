class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        // Text Bubbles Prefab 
        this.boxMsgs = new TextBubbles();

        //let bg = this.add.image(0,0,'bg').setOrigin(0);
        this.map = this.make.tilemap({key: 'TEMPMAP'});
        this.tileset = this.map.addTilesetImage('Asset 1');
        this.floor = this.map.createStaticLayer('Embed', this.tileset, 0, 0); 
        this.floor = this.map.createStaticLayer('Floors', this.tileset, 0, 0); // make floors walkable / move through from bottom
        this.Wall  = this.map.createStaticLayer('Walls', this.tileset, 0, 0); // make walls be walls
        this.ts = this.map.addTilesetImage('Ladder');
        this.climbable = this.map.createLayer('Ladders', this.ts, 10,-40);
        //figure out a better solution
        this.ladderXCoords = [307];
        this.ladderYCoords = [332];
        // player stuff here
        let frameNames = this.anims.generateFrameNames('player',{
            start: 1, end: 6, prefix: 'spacemanrun'
        });
        this.anims.create({
            key: 'run',
            frames: frameNames,
            frameRate: 20,
            repeat: -1
        });
        player = new Player(this, 64, gameH/2, 'player', 0);
        player.setScale(1.25);
        player.anims.play('run');
        // temp text
        this.add.text(150, 250, `Press ↑ for Level Select, ↓ for Title Screen`, subConfig).setOrigin(0.5);
        this.add.text(200, 380, `Use the A D to Move, W and S To Climb Ladders`, subConfig).setOrigin(0.5);
        this.add.text(200, 420, `Use your mouse to interact with objects around you`, subConfig).setOrigin(0.5);
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
        this.cameras.main.setBounds(0,0,640,480);
        this.cameras.main.setZoom(1.5);
        //have the camera follow the player
        this.cameras.main.startFollow(player);
        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.Wall.setCollisionByExclusion(-1, true);
        this.climbable.setCollision(16, true); //ladder is index 16
        this.physics.add.collider(this.floor, player);
        this.physics.add.collider(this.Wall, player);
        this.physics.add.overlap(this.climbable, player);
        // tint entire forground for the "fog of war" effect
        this.rt = new Phaser.GameObjects.RenderTexture(this, 0,0, gameW, gameH).setVisible(false);
        this.cover = this.add.image(0,0, 'tinter').setOrigin(0);
        this.cover.alpha = 0.5;
        this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, this.rt);
        this.cover.mask.invertAlpha = true;
        this.light = this.add.rectangle(player.x, player.y, 150, 50, 0xffffff);
        this.light.visible = false;
        // set up cursor keys and movement keys
        cursors  = this.input.keyboard.createCursorKeys();
        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"});

        //debug rendering
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.climbable.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
    }

    update() {
        player.update();
        //fog of war around player
        this.rt.clear();
        this.rt.draw(this.light, player.x, player.y);
        // commented out the solution that just wont work at 7am
        /*
        if(this.map.getTileAtWorldXY(player.x, player.y, this.cameras.main, 3) != null){
            player.climb();
        }*/
         // if player is within 15 pixels total, find a better solution
        if( (Phaser.Math.Within(player.x, this.ladderXCoords[0], 20) && (Phaser.Math.Within(player.y, this.ladderYCoords[0], 20)))
            ) 
        {
            player.climb();
        }else{
            player.setGravityY(1000);
        }
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