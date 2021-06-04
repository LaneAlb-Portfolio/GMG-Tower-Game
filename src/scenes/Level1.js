class Level1 extends Phaser.Scene {
    constructor() {
        super('levelOne');
    }

    create(){
        this.faucetOff = false;
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
        this.floor        = this.map.createLayer('Grounds', this.tileset, 0, 0); // make ground walkable
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);
        this.pipes        = this.map.createLayer('Pipes', this.tileset, 0, 0);   // Everything behind player not in background
        this.pipesCollide = this.map.createLayer('Collide Pipes', this.tileset, 0, 0);
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0,0);        // climbable objects
        this.spikes       = this.map.createLayer('Spikes', this.tileset, 0,0);         // danger spikes
        this.puzzleInitial= this.map.createStaticLayer('Puzzle Initial State', this.tileset, 0, 0); // level and drain
        this.attention    = this.map.createLayer('Initial State', this.tileset, 0, 0); // attention panels

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
        player.setScale(1.7);
        player.anims.play('run');

        // give platforms scene, x, y, endPoint, velocity, texture)
        this.upPlatforms = new UpwordsPlat(this, 7*this.tileWidth, this.mapHeightP - 7*this.tileHeight, 7*this.tileHeight, this.movementVelocity, 'mPlat').setOrigin(0);        
        this.upPlatforms.setScale(0.5);
        // bottom pipe is id 123 we put water particles here
        // add water emitter
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

        // drain plug
        // drain is index 109
        // this.drains = this.map.findByIndex(109, 0, false, this.foreground);
        this.water  = this.add.rectangle (11*this.tileWidth, 4*this.tileHeight, 3*this.tileWidth, 4*this.tileHeight, 0xba4a34, 0.75).setOrigin(0);
        this.drainplgsprite = this.add.image(11*this.tileWidth, 8*this.tileHeight, 'drainplug').setOrigin(0); //add it to the scene
        this.drainplgsprite.setScale(0.5);   //scale it to the scene
        this.drainplgsprite.setAlpha(0.01);
        this.drainplgsprite.setInteractive({ // make sure that the object is clickable, shows hand, and enables dragablity
            cursor: 'url(./assets/pointers/DrainPointer.png), pointer',
        });
        this.drainplgsprite.on('pointerup',(pointer, dragX, dragY) => {// delete the object when let go and play sound
            console.log(this.faucetOff);
            if(this.faucetOff){
                this.drainplgsprite.destroy();
                this.water.setVisible(0);
                this.puzzleSolved = this.map.createLayer('Puzzle Solved', this.tileset, 0, 0);
                this.puzzleCollider.destroy(); // destroy collision first
                this.puzzleInitial.setVisible(0); 
                this.tb.clear(true, true);     // make sure the tooltip isnt left behind
                this.drainSound = this.sound.add('drain');
                this.drainSound.play();
                this.time.delayedCall(1500, () => {this.drainSound.stop();}); // drain sound is a little bit to long
            } else{
                this.textbox(player.x, player.y, 'faucetOn');
                this.time.delayedCall(2000, () => {this.tb.clear(true, true);}); // drain sound is a little bit to long
            }
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

        // setup interactables within the scene and cursors
        // turn these into a prefab at some point
        this.heartAttention = this.add.rectangle(11.5*this.tileWidth, 13*this.tileHeight, 192, 128);//, 0xFFFFF, 1);
        this.heartAttention.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartAttention.on('pointerdown', () => {this.textbox(player.x, player.y, 'heart')});
        this.heartAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.heartHint = this.add.rectangle(8.5*this.tileWidth, this.mapHeightP - 6.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.heartHint.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartHint.on('pointerover', () => {this.textbox(player.x, player.y, 'heart')});
        this.heartHint.on('pointerout', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.startAttention = this.add.rectangle(this.mapWidthP - 2.5*this.tileWidth, this.mapHeightP - 1.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.startAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'});
        this.startAttention.on('pointerover', () => {this.textbox(player.x, player.y, 'lvl1')});
        this.startAttention.on('pointerout', () =>  {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.lever = this.add.rectangle(13.5*this.tileWidth, 7.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.lever.setInteractive({cursor: 'url(./assets/pointers/LevelPointer.png), pointer'}).on('pointerdown', () => { 
            if(this.water.visible){
                this.textbox(player.x, player.y, 'Cant Do Yet');
            }
        });
        this.lever.on('pointerup', () => {
            if(this.water.visible){
                this.time.delayedCall(2500, () => { this.tb.clear(true, true); });
            } else {
                this.puzzleSolved.setVisible(0); 
                //this.badCodingPractice = this.map.createLayer('HideBecauseCodeNoWork', this.tileset, 0, 0);
                this.puzzleDone = this.map.createLayer('Puzzle Done', this.tileset, 0, 0);
            }
        });
        this.faucet = this.add.rectangle(10.5*this.tileWidth, 7*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.faucet.setInteractive().on('pointerup', () => { 
            // stop emitter
            console.log("faucet");
            this.faucetOff = true;
            this.waterManager.destroy();
        });

        // camera things
        // configuration
        this.cameras.main.setBounds(0,0,this.mapWidthP,this.mapHeightP);
        this.cameras.main.setZoom(1);
        // have the camera follow the player
        this.cameras.main.startFollow(player);

        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.climbable.setCollisionByExclusion(-1, true);
        this.spikes.setCollisionByExclusion(-1, true);
        this.pipesCollide.setCollisionByExclusion(-1, true);
        this.puzzleInitial.setCollisionByExclusion(-1, true);
        // setup world colliders
        this.physics.add.collider(this.floor, player);
        this.physics.add.collider(this.pipesCollide, player);
        this.physics.add.collider(this.upPlatforms, player);
        this.puzzleCollider = this.physics.add.collider(this.puzzleInitial, player);
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
        if((movement.right.isUp || movement.left.isUp || movement.up.isUp || movement.down.isUp)
           && !(movement.right.isDown || movement.left.isDown || movement.up.isDown || movement.down.isDown)
           ){
            player.anims.play('run');
        }
        if(movement.jump.isDown && this.currTime - this.lastTime >= 1000){ // make jump only once
            player.jump();
            this.lastTime = this.currTime;
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

    swim(){
        player.slow();
        player.climb();
    }

    platformMovement(direction){
        if(direction == 'up'){ // only vertical platform in level1
            this.upPlatforms.move();
        }
    }

    completed(){
        if(this.water.visible){ // if they remove the water they can exit
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
        console.log("Txtbox being made for:" + objName);
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
        // X is center of camera - width 
        // Y is cameras current Y value + (center - height) to be above the player and give some extra space
        this.tb.add(this.add.text(this.cameras.main.centerX - 50, this.cameras.main.y + (this.cameras.main.centerY/2 - 1.2*height),
            this.boxMsgs.messageFind(objName), this.txtstyle).setScrollFactor(0) );
    }
}