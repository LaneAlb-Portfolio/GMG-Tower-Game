class Level1 extends Phaser.Scene {
    constructor() {
        super('levelOne');
    }

    create(){
        // add level music 
        this.bgm = this.sound.add('StomachAche',{
            mute: false,
            volume: 1,
            rate: 0.5,
            loop:true
        });
        if(!this.bgm.isPlaying){
            this.bgm.play();
        }
        // level variables
        completed[1] = 1;
        this.faucetOff = false;
        this.movementVelocity = 200;
        this.currTime = this.time.now;
        this.lastTime = this.time.now;

        // Text Bubbles Prefab
        this.tb = this.add.group(this);
        this.boxMsgs = new TextBubbles();
        // Loading Tilemap and layers
        this.map     = this.make.tilemap({key: 'lvl1Map'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createLayer('BG', this.tileset, 0, 0); 
        this.floor        = this.map.createLayer('Grounds', this.tileset, 0, 0);         // make ground walkable
        this.organs       = this.map.createLayer('Brain and Heart', this.tileset, 0, 0); // organs
        this.pipes        = this.map.createLayer('Pipes', this.tileset, 0, 0);           // Everything behind player not in background
        this.pipesCollide = this.map.createLayer('Collide Pipes', this.tileset, 0, 0);
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0,0);          // climbable objects
        this.spikes       = this.map.createLayer('Spikes', this.tileset, 0,0);           // danger spikes
        this.puzzleInitial= this.map.createLayer('Puzzle Initial State', this.tileset, 0, 0); // level and drain
        this.attention    = this.map.createLayer('Initial State', this.tileset, 0, 0);   // attention panels
        const bounds      = this.map.createLayer('Grounds for the Camera', this.tileset, 0, 0);
        const spawnPoint  = this.map.findObject("Spawns", obj => obj.name == "START");   // grab spawn info
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);

        // for ease of tilemap use
        this.tileHeight = this.map.tileHeight;
        this.tileWidth  = this.map.tileWidth;
        this.mapHeightP = this.map.heightInPixels;
        this.mapWidthP  = this.map.widthInPixels;
        //console.log("TileMap Info: W/H" + this.mapHeightP + " , " + this.mapWidthP);
        //console.log("Tile W/H: " + this.tileHeight + " , " + this.tileWidth);

        // player stuff here
        let frameNames = this.anims.generateFrameNames('worker',{
            start: 1, end: 8, prefix: 'worker'
        });
        this.anims.create({
            key: 'run',
            frames: frameNames,
            frameRate: 20,
            repeat: -1
        });
        player = new Player(this, spawnPoint.x, spawnPoint.y - 64, 'worker', 0);
        player.setScale(0.6); // the character is a tad big compared to tiles
        player.anims.play('run');
        console.log(player.alpha);

        // give platforms scene, x, y, endPoint, velocity, texture)
        this.upPlatforms = new UpwordsPlat(this, 7*this.tileWidth, this.mapHeightP - 7*this.tileHeight, 7*this.tileHeight, this.movementVelocity, 'mPlat').setOrigin(0);        
        this.upPlatforms.setScale(0.5);
        
        // sparks on light under the water
        this.sparks = this.add.particles('waterdrop');
        this.sparks.createEmitter({
            x: 13*this.tileWidth,
            y: 4.5*this.tileHeight,
            lifespan: 150,
            speed: { min: 25, max: 375 },
            scale: { start: 0.5 , end: 0},
            tint: [0xe9f024],
            blendMode: 'ADD',
        });

        // drain plug
        // drain is index 109
        // this.drains = this.map.findByIndex(109, 0, false, this.foreground);
        // add water and the water particle effect
        // water == blood aethestically so its red
        this.waterDrops = this.add.particles('waterdrop');
        this.waterDrops.createEmitter({
            x: 10.5*this.tileWidth,
            y: 5*this.tileHeight,
            lifespan: 500,
            speed: { min: 150, max: 300 },
            angle: { min: 330, max: 380 },
            gravityY: 300,
            scale: { start: 0.5, end: 0 },
            tint: [0xFA0000, 0xFF5050],
            quantity: 2,
            blendMode: 'ADD'
        });
        this.water  = this.add.rectangle (14*this.tileWidth - 5, 8*this.tileHeight, 3*this.tileWidth, 4*this.tileHeight, 0xba4a34, 0.75).setOrigin(0);
        this.water.angle = 180;
        this.tweens.add({
            targets: this.water,
            scaleY: 1.025,
            x: 14*this.tileWidth,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.drainplgsprite = this.add.image(11*this.tileWidth, 8*this.tileHeight, 'drainplug').setOrigin(0); //add it to the scene
        this.drainplgsprite.setScale(0.5);   //scale it to the scene
        this.drainplgsprite.setAlpha(0.01);
        this.drainplgsprite.setInteractive({ // make sure that the object is clickable, shows hand, and enables dragablity
            cursor: 'url(./assets/pointers/DrainPointer.png), pointer',
        });
        this.drainplgsprite.on('pointerup',(pointer, dragX, dragY) => {// delete the object when let go and play sound
            console.log(this.faucetOff);
            if(this.faucetOff){
                this.sparks.destroy();
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
        // this.drainplgsprite.on('pointerover', (pointer) => {
        //     let x = this.drainplgsprite.x ;
        //     let y = this.drainplgsprite.y;
        //     y = y - 64;
        //     this.textbox(x, y, 'drain');
        // });
        // this.drainplgsprite.on('pointerout', (pointer) => {
        //     this.tb.clear(true, true);
        // });

        // setup interactables within the scene and cursors
        // turn these into a prefab at some point
        this.heartAttention = this.add.rectangle(11.5*this.tileWidth, 13*this.tileHeight, 192, 128);//, 0xFFFFF, 1);
        this.heartAttention.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartAttention.on('pointerdown', () => {this.textbox(player.x, player.y, 'heart1')});
        this.heartAttention.on('pointerup', () => {
            this.heartBeat= this.sound.add('heartbeat'),
            this.heartBeat.play(),
            this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.heartHint = this.add.rectangle(8.5*this.tileWidth, this.mapHeightP - 6.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.heartHint.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartHint.on('pointerover', () => {this.textbox(player.x, player.y, 'button2')});
        this.heartHint.on('pointerout', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.startAttention = this.add.rectangle(this.mapWidthP - 2.5*this.tileWidth, this.mapHeightP - 1.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.startAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'});
        this.startAttention.on('pointerover', () => {this.textbox(player.x, player.y, 'button1')});
        this.startAttention.on('pointerout', () =>  {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.brainAttention = this.add.rectangle(25.5*this.tileWidth, 2.5*this.tileHeight, 192, 192,);//0xFFFFF, 1);
        this.brainAttention.setInteractive({cursor: 'url(./assets/pointers/BrainPointer.png), pointer'});
        this.brainAttention.on('pointerdown', () => {this.textbox(player.x, player.y, 'brain1')});
        this.brainAttention.on('pointerup', () => {
            this.brainsound= this.sound.add('brainsfx'),
            this.brainsound.play(),
            this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });


        //Josh added door pointer, for the pupose of clicking on the door to either: let the player know to flip the switch or to open w/o flipping the switch
        this.door = this.add.rectangle(14.5*this.tileWidth, 7*this.tileHeight, 16, 128);//, 0xFFFFF, 1);
        this.door.setInteractive({cursor: 'url(./assets/pointers/DoorPointer.png), pointer'}).on('pointerdown', () => { 
            if(this.water.visible){
                this.textbox(player.x, player.y, 'leverOn');
            }
        });

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
                this.leverSound = this.sound.add ('leversfx');
                this.leverSound.play();
                this.puzzleSolved.setVisible(0); 
                //this.badCodingPractice = this.map.createLayer('HideBecauseCodeNoWork', this.tileset, 0, 0);
                this.puzzleDone = this.map.createLayer('Puzzle Done', this.tileset, 0, 0);
                this.door.setVisible(0);
                this.lever.destroy();
            }
        });
        this.faucet = this.add.rectangle(10.5*this.tileWidth, 7*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.faucet.setInteractive({cursor: 'url(./assets/pointers/FaucetPointer.png), pointer'}).on('pointerup', () => { //added in the faucet pointer just because
            if(this.faucetOff == false) {
                this.faucetSound = this.sound.add('faucet');
                this.faucetSound.play();
            }
            // stop emitter
            console.log("faucet");
            this.faucetOff = true;
            this.waterDrops.destroy();
            this.faucet.destroy();
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
        bounds.setCollisionByExclusion(-1, true);
        // setup world colliders
        this.physics.add.collider(this.floor, player);
        this.physics.add.collider(this.pipesCollide, player);
        this.physics.add.collider(this.upPlatforms, player);
        this.physics.add.overlap (this.climbable, player);
        this.physics.add.overlap (this.spikes, player);
        this.physics.add.collider(bounds, player);
        this.puzzleCollider = this.physics.add.collider(this.puzzleInitial, player);
        // tint entire forground for the "fog of war" effect
        this.rt = new Phaser.GameObjects.RenderTexture(this, 0,0, this.mapWidthP,this.mapHeightP).setVisible(false);
        this.cover = this.add.image(0,0, 'tinter').setOrigin(0);
        this.cover.setScale(3);
        this.cover.alpha = 0.5;
        this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, this.rt);
        this.cover.mask.invertAlpha = true;
        this.light = this.add.circle(player.x, player.y, player.width*2, 0xffffff);
        this.light.visible = false;

        // set up movement keys and restart
        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D", jump:"SPACE", restart: "R", menu:"M", esc:"ESC"});

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
        if(movement.left.isUp && movement.right.isUp){
            player.anims.play('run');
        }
        if(movement.jump.isDown && this.currTime - this.lastTime >= 1000){ // make jump only once
            player.jump();
            this.lastTime = this.currTime;
        }
        if(this.spikes.getTileAtWorldXY(player.x, player.y)){ //if hit spike restart level
            this.bgm.stop();
            this.scene.start('death');
        }
        if(this.climbable.getTileAtWorldXY(player.x, player.y))  // if overlapping ladder then climb it
        {
            player.climb();
        }
        // this allows the player to "swim" in the blood
        if( (player.x >= 11*this.tileWidth && player.y <= 8*this.tileHeight) && this.water.visible){
            player.climb();
        }
        // allow restarting
        if(Phaser.Input.Keyboard.JustDown(movement.restart)){
            this.bgm.stop();
            this.pause = undefined;
            this.scene.restart();
        }
        // pause overlay
        if(Phaser.Input.Keyboard.JustDown(movement.esc)){
            this.pauseMenu();
        }
        // quit to menu
        if(Phaser.Input.Keyboard.JustDown(movement.menu)){
            this.menu();
        }
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
        if(this.water.visible){ // if they remove the water they can exit
            this.lastTime = this.currTime;
            this.textbox(player.x, player.y, 'Condition not met');
            this.time.delayedCall(2500, ()=> {this.tb.clear(true, true);});
        } else {
            // completed[1] = 1;  2nd level not implemented
            this.bgm.stop();
            this.scene.start('credits');
        }
    }

    pauseMenu(){
        console.log(this.pause);
        if(this.pause){
            this.popup.clear(true, true);
        } else{
            this.popup = this.add.group();
            let back   = this.add.rectangle(135, 85, 230, 140, 0x525252, 1).setOrigin(0.5).setScrollFactor(0);
            back.setStrokeStyle(5, 0xAF2A20);
            let txt    = this.add.text(back.x, back.y, 
            "Movement: W A S D\nJump: Space\nRestart: R\nInteract: Mouse1\nMain Menu: M\nEsc to close", 
            bodyConfig).setOrigin(0.5).setScrollFactor(0);
            back.alpha = 0.7;
            txt.alpha  = 0.7;
            this.popup.add(back);
            this.popup.add(txt);
        }
        this.pause = !this.pause;
    }

    menu(){
        this.bgm.stop();
        this.scene.start('title');
    }

    restart(){
        this.bgm.stop();
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
        // X is center of camera - width of message above
        // Y is based on the current scroll factor of the camera
        // if the scroll factor is > 0 or < gameH then we know the character is center of camera
        // else he is either near the top or bottom respectively
        // scrollY < NUMBER depends on the level so change accordingly
        if(this.cameras.main.scrollY < 800 && this.cameras.main.scrollY > 0){
            y = this.cameras.main.centerY / 2 - (2.1*height);
        } else if (this.cameras.main.scrollY == 0){
            y = this.cameras.main.centerY / 2 - 1.3*height; // give some room above player head by padding height
        } else { // camera at bottom of the map, character is there too
            y = this.cameras.main.centerY;
        }
        let txt = this.add.text(this.cameras.main.centerX - 50, y, this.boxMsgs.messageFind(objName), this.txtstyle).setScrollFactor(0).setDepth(1);
        let bckg = this.add.rectangle(this.cameras.main.centerX - 50, y, txt.displayWidth, txt.displayHeight, 0x545454, 1).setOrigin(0,0).setScrollFactor(0);
        bckg.setStrokeStyle(2, 0xAF2A20);
        this.tb.add(bckg);
        this.tb.add(txt);
    }
}