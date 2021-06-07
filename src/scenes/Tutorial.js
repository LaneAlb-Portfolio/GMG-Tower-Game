class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        // add level music
        this.bgm = this.sound.add('heartAtt',{
            mute: false,
            volume: 1,
            rate: 1,
            loop: true
        });
        if(!this.bgm.isPlaying){
            this.bgm.play();
        }
        // level variables
        completed[1] = 0;
        this.noPower = false;
        this.pause   = false;
        this.movementVelocity = 200;
        this.currTime = this.time.now;
        this.lastTime = this.time.now;
        // Text Bubbles Prefab
        this.tb = this.add.group(this);
        this.boxMsgs = new TextBubbles();
        // Loading Tilemap and the layers
        this.map     = this.make.tilemap({key: 'tutorialMap'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createLayer('BG', this.tileset, 0, 0);
        this.floor        = this.map.createLayer('Grounds', this.tileset, 0, 0); // make ground walkable
        const bounds      = this.map.createLayer('Grounds for the Camera', this.tileset, 0, 0);
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);     // wiring and such
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0, 0);        // climbable objects
        this.organs       = this.map.createLayer('Brain and Heart', this.tileset, 0, 0);// organs
        this.pipes        = this.map.createLayer('Pipes', this.tileset, 0, 0);          // pipe system in front of the player
        this.spikes       = this.map.createLayer('Spikes', this.tileset, 0, 0);         // danger spikes
        this.attention    = this.map.createLayer('Inital State', this.tileset, 0, 0);  // info graphics "on"
        const spawnPoint  = this.map.findObject("Spawns", obj => obj.name == "START");  // grab spawn info
        this.powerOff     = this.map.createLayer('Power Off', this.tileset, 0, 0);
        this.powerOff.setVisible(false);
        // for ease of use / math
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
        // reminder text
        this.add.text(this.mapWidthP - 3.2*this.tileWidth, this.mapHeightP - (4*this.tileHeight),
            `ESC will open\nthe controls overlay`, popUpConfig).setOrigin(0.5);

        // ALL Pointer Hover Interactions
        // "pointerover" == when pointer is hovering on object
        // "pointerout " == when pointer is NOT hovering on object
        // create invisible rectangle over interactables; 
        // this is excessive, but sprite from Tilemap has issues
        this.brainAttention = this.add.rectangle(6*this.tileWidth, 3*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.brainAttention.setInteractive({cursor: 'url(./assets/pointers/BrainPointer.png), pointer'}).on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else{this.textbox(player.x, player.y, 'brain')}});
        this.brainAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true); }); });

        this.brainObject = this.add.rectangle(2.5*this.tileWidth, 2.5*this.tileHeight, 192, 192,);//0xFFFFF, 1);
        this.brainObject.setInteractive({cursor: 'url(./assets/pointers/BrainPointer.png), pointer'});
        this.brainObject.on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else{this.textbox(player.x, player.y, 'brain0')}});
        this.brainObject.on('pointerup', () => {
            if(!this.noPower){
            this.brainsound= this.sound.add('brainsfx'),
            this.brainsound.play()}
            this.time.delayedCall(2500, () => { this.tb.clear(true, true); }); });

        this.heartAttention = this.add.rectangle(this.mapWidthP - 12*this.tileWidth, 8*this.tileHeight, 128, 128,);//0xFFFFF, 1);
        this.heartAttention.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartAttention.on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else{this.textbox(player.x, player.y, 'heart');}});
        this.heartAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.heartObject = this.add.rectangle(this.mapWidthP - 14.5*this.tileWidth, 8*this.tileHeight, 192, 128,);//0xFFFFF, 1);
        this.heartObject.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartObject.on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
          else{this.textbox(player.x, player.y, 'heart0');}});
        this.heartObject.on('pointerup', () => {
            if(!this.noPower){
            this.heartBeat= this.sound.add('heartbeat'),
            this.heartBeat.play()}            
            this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.exitObject = this.add.rectangle(23*this.tileWidth, 3*this.tileHeight, 128, 128,);//0xFFFFF, 1);
        this.exitObject.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'});
        this.exitObject.on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else{this.textbox(player.x, player.y, 'exit');} });
        this.exitObject.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true); }); });

        this.startAttention = this.add.rectangle(this.mapWidthP - 3*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.startAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else{this.textbox(player.x, player.y, 'tutorial');} });
        this.startAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.startbutton = this.add.rectangle(this.mapWidthP - 5.5*this.tileWidth, this.mapHeightP - 1.5*this.tileHeight, 64, 64,);// 0xFFFFF, 1);
        this.startbutton.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'});
        this.startbutton.on('pointerover', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else {this.textbox(player.x, player.y, 'button');} });
        this.startbutton.on('pointerout', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.spikeAttention = this.add.rectangle(19*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.spikeAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        {if(this.noPower){this.textbox(player.x, player.y, 'noPower')}
            else{this.textbox(player.x, player.y, 'spikes');} });
        this.spikeAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.lever = this.add.rectangle(4.5*this.tileWidth, 3.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.lever.setInteractive({cursor: 'url(./assets/pointers/LevelPointer.png), pointer'}).on('pointerup', () => {
            this.leverSound = this.sound.add ('leversfx');
            this.leverSound.play();
            if(this.noPower == false){
                this.powerDown = this.sound.add('poweringDown')
                this.powerDown.play();
                this.attention.setVisible(false);
                this.noPower = true;
                this.powerOff.setVisible(true);
            }
            else{
                this.powerUp = this.sound.add('poweringUp')
                this.powerUp.play();
                this.attention.setVisible(true);
                this.noPower = false;
                this.powerOff.setVisible(false); 
            }
        });

        //camera config and follow
        this.cameras.main.setBounds(0,0,this.mapWidthP,this.mapHeightP);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(player);

        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.climbable.setCollisionByExclusion(-1, true);
        this.spikes.setCollisionByExclusion(-1, true);
        bounds.setCollisionByExclusion(-1, true);
        // setup world collliders
        this.physics.add.collider(bounds, player);
        this.physics.add.collider(this.floor, player);
        this.physics.add.overlap (this.climbable, player);
        this.physics.add.overlap (this.spikes, player);
        
        // tint entire forground for the "fog of war" effect
        this.rt = new Phaser.GameObjects.RenderTexture(this, 0,0, this.mapWidthP,this.mapHeightP).setVisible(false);
        this.cover = this.add.image(0,0, 'tinter').setOrigin(0);
        this.cover.setScale(3);
        this.cover.alpha = 0.5;
        this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, this.rt);
        this.cover.mask.invertAlpha = true;
        // light around player
        this.light = this.add.circle(player.x, player.y, player.width*4, 0xffffff);
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
        //fog of war around player
        this.rt.clear();
        this.rt.draw(this.light, player.x, player.y);
        // update time
        this.currTime = this.time.now;

        if(movement.left.isUp && movement.right.isUp){
            player.anims.play('run');
        }
        if(movement.jump.isDown && this.currTime - this.lastTime >= 1000){ // make jump only once
            player.jump();
            this.lastTime = this.currTime;
        }
        // if the player hit the spikes they die
        if(this.spikes.getTileAtWorldXY(player.x, player.y)){
            this.bgm.stop();
            this.scene.start('death');
        }

        // check if player is ontop of a ladder for climbing
        if(this.climbable.getTileAtWorldXY(player.x, player.y)) 
        {
            player.climb();
        }

        // check if player is at the exit door
        if((Phaser.Math.Within(player.x, this.mapWidthP - this.tileWidth, 64) && Phaser.Math.Within(player.y, 3*this.tileHeight, 128))
          && this.currTime - this.lastTime >= 2500){ // only trigger once every 2.5 seconds
            if(this.noPower == false || this.noPower == true){ // previously was if this.NoPower for power off condition
                completed[0] = 1;  //set completed tutorial level to true
                this.bgm.stop();
                this.scene.start('gameover');
            } 
        }
        // allow restarting
        if(Phaser.Input.Keyboard.JustDown(movement.restart)){
            this.restart();
        }
    // allow restarting
        if(Phaser.Input.Keyboard.JustDown(movement.menu)){
            this.menu();
        }
        //Pause menu overlay
        if(Phaser.Input.Keyboard.JustDown(movement.esc)){
            this.pauseMenu();
        }
    }

    menu(){
        this.bgm.stop();
        this.scene.start('title');
    }

    restart(){
        this.bgm.stop();
        this.scene.start('tutorial');
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
            fixedWidth:  125,
            wordWrap: {width: 125}, // keep width the same as fixedWidth
        }
        // X is center of camera - width of message above
        // Y is based on the current scroll factor of the camera
        // if the scroll factor is > 0 or < gameH then we know the character is center of camera
        // else he is either near the top or bottom respectively
        // scrollY < NUMBER depends on the level so change accordingly
        if(this.cameras.main.scrollY < 480 && this.cameras.main.scrollY > 0){
            y = this.cameras.main.centerY / 2 - (2*height);  // give some room above player head by padding height
        } else if (this.cameras.main.scrollY == 0){
            y = this.cameras.main.centerY / 2 - 1.2*height;
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