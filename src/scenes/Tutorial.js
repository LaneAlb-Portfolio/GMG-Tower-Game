class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        this.movementVelocity = 200;
        // Text Bubbles Prefab 
        this.boxMsgs = new TextBubbles();
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'tempAssetMap'});
        this.tileset = this.map.addTilesetImage('tilemap');
        this.map.createStaticLayer('Background', this.tileset, 0, 0); 
        this.floor        = this.map.createStaticLayer('Platforms', this.tileset, 0, 0); // make platforms
        this.information  = this.map.createDynamicLayer('Behind Player', this.tileset, 0, 0);  // Everything behind player not in background
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0,0);                // climbable objects
        // for  ease of use
        this.tileHeight = this.map.tileHeight;
        this.tileWidth  = this.map.tileWidth;
        this.mapHeightP = this.map.heightInPixels;
        this.mapWidthP  = this.map.widthInPixels;
        console.log("TileMap Info: W/H" + this.mapHeightP + " , " + this.mapWidthP);
        console.log("Tile W/H: " + this.tileHeight + " , " + this.tileWidth);

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
        player = new Player(this, (2*this.tileWidth), this.mapHeightP - (3*this.tileHeight), 'player', 0);
        player.setScale(1.8);
        player.anims.play('run');
        // temp text
        this.add.text(150, 250, `Press ↑ for Level Select, ↓ for Title Screen`, subConfig).setOrigin(0.5);
        this.add.text(200, 380, `Use the A D to Move, W and S To Climb Ladders, SPACE to Jump`, subConfig).setOrigin(0.5);
        this.add.text(200, 420, `Use your mouse to interact with objects around you`, subConfig).setOrigin(0.5);
        //scene puzzle things
        this.pointerX = 0;
        this.pointerY = 0;
        this.input.on('pointermove', function(pointer){
            this.pointerX = pointer.x;
            this.pointerY = pointer.y;
        }, this);
        //faucet
        /*
        this.facuetsprite = this.add.image(575, 350, 'faucet').setOrigin(0); // add it to the scene
        this.facuetsprite.setScale(0.25); // scale it to the scene
        this.facuetsprite.setInteractive({ // make sure that the object is clickable, and shows hand
            cursor: 'url(./assets/pointers/FaucetPointer.png), pointer',
        });
        this.facuetsprite.on('pointerdown',(pointer, dragX, dragY) => {// play looped sound when pressed, loop will be later though
            this.sound.play('faucet', {
                volume: 0.15
            });
        });*/
        // this.facuetsprite.on('pointerup',(pointer, dragX, dragY) => {// stop playing sound when let go
        //     this.sound.stop()
        // });

        //drain plug
        // drain is index 132 and 133
        this.drains = this.map.findByIndex(133, 0, true, this.information);
        this.water  = this.add.rectangle (this.drains.pixelX - (5*this.tileWidth), this.drains.pixelY - this.tileHeight, 512, 64, 0xfa2d1).setOrigin(0);
        //console.log(this.drains.pixelX + "," + this.drains.pixelY);
        this.drainplgsprite = this.add.image(this.drains.pixelX, this.drains.pixelY, 'drainplug').setOrigin(0); //add it to the scene
        //console.log(this.drainplgsprite.x +","+ this.drainplgsprite.y);
        this.drainplgsprite.setScale(0.5); //scale it to the scene
        this.drainplgsprite.setAlpha(0.01);
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
            y = y - 64;
            this.textbox(x, y, 'drain');
        });
        this.drainplgsprite.on('pointerout', (pointer) => {
            this.tb.destroy();
        });
        // bottom pipe is id 123 we put water particles here
        this.bottomPipe = this.map.findByIndex(123, 0, true, this.floor); // the drain can be collided with so its on this layer
        console.log(this.bottomPipe);
        let waterfall = new Phaser.Geom.Line((39*this.tileWidth),(35*this.tileHeight),(40*this.tileWidth),(35*this.tileHeight));
        this.waterManager = this.add.particles('waterdrop');
        this.waterEmitter = this.waterManager.createEmitter({
            gavityY: 150,
            lifespan: 500,
            alpha: {start: 1, end: 0.01},
            scale: 1.5,
            tint: [0x03bafc, 0x1384ad, 0x325ed9, 0x6186ed, 0x1269b0], // blue tints
            emiteZone: {type: 'edge', source: waterfall, quantity: 150},
        });
        //console.log("Waterfall:" + this.waterEmitter);
        //this.movingGroup = this.add.group({
        //    runChildUpdate: true
        //});
        // give platforms scene, x, y, endPoint, velocity, texture)
        this.sidePlatforms = new SidewaysPlat(this, 20*this.tileWidth, 15*this.tileHeight, 11*this.tileWidth,this.movementVelocity, 'mPlat').setOrigin(0);
        this.upPlatforms   = new UpwordsPlat(this, 4*this.tileWidth, 13*this.tileHeight, 7*this.tileHeight, this.movementVelocity, 'mPlat').setOrigin(0);

        //camera things
        //configuration
        this.cameras.main.setBounds(0,0,this.mapWidthP,this.mapHeightP);
        this.cameras.main.setZoom(1);
        //have the camera follow the player
        this.cameras.main.startFollow(player);
        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.climbable.setCollisionByExclusion(-1, true);
        // setup world collliders
        this.physics.add.collider(this.floor, player);
        this.physics.add.collider(this.upPlatforms, player);
        this.physics.add.collider(this.sidePlatforms, player);
        this.physics.add.collider(this.water, player);
        this.physics.add.overlap (this.climbable, player);
        // tint entire forground for the "fog of war" effect
        this.rt = new Phaser.GameObjects.RenderTexture(this, 0,0, this.mapWidthP,this.mapHeightP).setVisible(false);
        this.cover = this.add.image(0,0, 'tinter').setOrigin(0);
        this.cover.setScale(3);
        this.cover.alpha = 0.5;
        this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, this.rt);
        this.cover.mask.invertAlpha = true;
        this.light = this.add.circle(player.x, player.y, player.width*4, 0xffffff);
        this.light.visible = false;
        // set up cursor keys and movement keys
        cursors  = this.input.keyboard.createCursorKeys();
        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D", jump:"SPACE"});

        //debug rendering
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.floor.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
    }

    update() {
        player.update();
        this.sidePlatforms.update();
        this.upPlatforms.update();
        //fog of war around player
        this.rt.clear();
        this.rt.draw(this.light, player.x, player.y);
        if(movement.jump.isDown){ // make jump only once
            player.jump();
        }
        if(this.climbable.getTileAtWorldXY(player.x, player.y)) 
        {
            player.climb();
        }
        /* can try collide tiles later or the actual overlaps
        this.physics.world.overlap(player, this.sidePlatforms, this.platformMovement('side'), null, this);
        this.physics.world.overlap(player, this.upPlatforms, this.platformMovement('up'), null, this);
        the above didnt work, possibly interaction between tilemap and the actual collider?
        not really sure just dont understand why it doesnt work, but automcatic moving platforms
        will have to do */
        if(player.x >= 47* this.tileWidth && player.y <= 7*this.tileHeight){
            console.log("Exit Time");
        }
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('select');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.scene.start('title');
        }
    }

    stopPlayer(){
        if(this.water && player.VelocityX < 0){
            player.setVelX(0);
        }
    }

    platformMovement(direction){
        if(direction == 'up'){
            this.upPlatforms.move();
        } else {
            this.sidePlatforms.move();
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