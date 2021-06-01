class Level1 extends Phaser.Scene {
    constructor() {
        super('levelOne');
    }

    create(){ 
        this.movementVelocity = 200;
        this.currTime = this.time.now;
        this.lastTime = this.time.now;
        // Text Bubbles Prefab
        this.tb = this.add.group(this);
        this.boxMsgs = new TextBubbles();
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'lvl1Map'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createStaticLayer('BG', this.tileset, 0, 0); 
        this.floor        = this.map.createStaticLayer('Grounds', this.tileset, 0, 0); // make ground walkable
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);
        this.pipes        = this.map.createStaticLayer('Pipes', this.tileset, 0, 0);  // Everything behind player not in background
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0,0);       // climbable objects
        this.spikes       = this.map.createLayer('Spikes', this.tileset, 0,0);        // danger spikes
        // for  ease of use
        this.tileHeight = this.map.tileHeight;
        this.tileWidth  = this.map.tileWidth;
        this.mapHeightP = this.map.heightInPixels;
        this.mapWidthP  = this.map.widthInPixels;
        console.log("TileMap Info: W/H" + this.mapHeightP + " , " + this.mapWidthP);
        console.log("Tile W/H: " + this.tileHeight + " , " + this.tileWidth);

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
        player = new Player(this, this.mapWidthP - 2*this.tileWidth, this.mapHeightP - (3*this.tileHeight), 'player', 0);
        player.setScale(1.8);
        player.anims.play('run');

        // give platforms scene, x, y, endPoint, velocity, texture)
        this.upPlatforms = new UpwordsPlat(this, this.tileWidth, this.mapHeightP - 2*this.tileHeight, 14*this.tileHeight, this.movementVelocity, 'mPlat').setOrigin(0);        

        //drain plug
        // drain is index 109
        //this.drains = this.map.findByIndex(109, 0, false, this.foreground);
        this.water  = this.add.rectangle (11*this.tileWidth, 4*this.tileHeight, 3*this.tileWidth, 4*this.tileHeight, 0xfa2d1, 1).setOrigin(0);
        this.drainplgsprite = this.add.image(11*this.tileWidth, 8*this.tileHeight, 'drainplug').setOrigin(0); //add it to the scene
        this.drainplgsprite.setScale(0.5); //scale it to the scene
        this.drainplgsprite.setAlpha(0.01);
        this.drainplgsprite.setInteractive({ // make sure that the object is clickable, shows hand, and enables dragablity
            cursor: 'url(./assets/pointers/DrainPointer.png), pointer',
        });
        this.drainplgsprite.on('pointerup',(pointer, dragX, dragY) => {// delete the object when let go and play sound
            this.drainplgsprite.destroy();
            this.water.destroy();
            this.tb.clear(true, true); // make sure the tooltip isnt left behind
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
            this.tb.clear(true, true);
        });
        // bottom pipe is id 123 we put water particles here
        let waterfall = new Phaser.Geom.Line(player.x,player.y, player.x + 240, player.y);
        this.waterManager = this.add.particles('waterdrop');
        this.waterManager.createEmitter({
            gavityY: 150,
            lifespan: 1500,
            alpha: {start: 1, end: 0.01},
            scale: 5,
            tint: [0x03bafc, 0x1384ad, 0x325ed9, 0x6186ed, 0x1269b0], // blue tints
            emiteZone: {type: 'random', source: waterfall, quantity: 150},
        });

        //camera things
        //configuration
        this.cameras.main.setBounds(0,0,this.mapWidthP,this.mapHeightP);
        this.cameras.main.setZoom(1);
        //have the camera follow the player
        this.cameras.main.startFollow(player);

        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.climbable.setCollisionByExclusion(-1, true);
        this.spikes.setCollisionByExclusion(-1, true);
        // setup world collliders
        this.physics.add.collider(this.floor, player);
        this.physics.add.collider(this.upPlatforms, player);
        this.physics.add.overlap (this.climbable, player);
        this.physics.add.overlap (this.spikes, player);

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
        this.upPlatforms.update();
        //fog of war around player
        this.rt.clear();
        this.rt.draw(this.light, player.x, player.y);
        if(movement.jump.isDown){ // make jump only once
            player.jump();
        }
        if(this.spikes.getTileAtWorldXY(player.x, player.y)){ //if hit spike restart level
            this.restart();
        }
        if(this.climbable.getTileAtWorldXY(player.x, player.y))  // if overlapping ladder then climb it
        {
            player.climb();
        }
        /* can try collide tiles later or the actual overlaps
        this.physics.world.overlap(player, this.sidePlatforms, this.platformMovement('side'), null, this);
        this.physics.world.overlap(player, this.upPlatforms, this.platformMovement('up'), null, this);
        the above didnt work, possibly interaction between tilemap and the actual collider?
        not really sure just dont understand why it doesnt work, but automcatic moving platforms
        will have to do */
        this.currTime = this.time.now; //update current time
        // check if player is at the exit door && reduce function calls overall using game clock
        if((Phaser.Math.Within(player.x, this.mapWidthP - this.tileWidth, 64) && Phaser.Math.Within(player.y, 3*this.tileHeight, 128))
          && this.currTime - this.lastTime >= 2500){ // only trigger once every 2.5 seconds
            this.completed();
        }
    }

    platformMovement(direction){
        if(direction == 'up'){ // only vertical platform in level1
            this.upPlatforms.move();
        }
    }

    completed(){
        if(this.water){ // if they shut off the power they can exit
            this.lastTime = this.currTime;
            this.textbox(player.x, player.y, 'Condition not met');
            this.time.delayedCall(2500, ()=> {this.tb.clear(true, true);});
        } else {
            completed[1] = 1;  //set completed level to true
            this.scene.start('gameover');
        }
    }

    restart(){
        this.scene.start('levelOne');
    }

    textbox(x, y, objName){
        //console.log("Txtbox being made for:" + objName);
        let height = Phaser.Math.FloorTo((this.boxMsgs.messageLength(objName) * 16) / 100 );
        //console.log("Expected wordWrap == " + height);
        this.txtstyle = {
            fontFamily: 'thinPixel', 
            fontSize: '32px',
            color: '#FFFFFF',
            strokeThickness: 1,
            stroke: '#000000',
            backgroundColor: '#000000',
            align: 'center',
            fixedWidth:  100,
            wordWrap: {width: 100}, // keep width the same as fixedWidth
        }
        this.tb.add(this.add.text(x, y-((height-1)*10) - 32, // clamp to the middle of the camera
            this.boxMsgs.messageFind(objName), this.txtstyle).setScrollFactor(0) );
    }
}