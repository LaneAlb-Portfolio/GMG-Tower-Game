class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        this.noPower = true;
        this.movementVelocity = 200;
        this.currTime = this.time.now;
        this.lastTime = this.time.now;
        // Text Bubbles Prefab
        this.tb = this.add.group(this);
        this.boxMsgs = new TextBubbles();
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'tutorialMap'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createStaticLayer('BG', this.tileset, 0, 0); 
        this.floor        = this.map.createStaticLayer('Grounds', this.tileset, 0, 0); // make ground walkable
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0, 0);       // climbable objects
        this.pipes        = this.map.createStaticLayer('Pipes', this.tileset, 0, 0);   // Everything behind player not in background
        this.spikes       = this.map.createLayer('Spikes', this.tileset, 0, 0);        // danger spikes
        this.attention    = this.map.createLayer('Inital State', this.tileset, 0, 0);  // info graphics "on"
        // for ease of use
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
        // temp text
        this.add.text(this.mapWidthP - 3.2*this.tileWidth, this.mapHeightP - (5*this.tileHeight),
            `Use A D to Move\nW and S To Climb\nSPACE to Jump`, popUpConfig).setOrigin(0.5);
        this.add.text(this.mapWidthP - 3.2*this.tileWidth, this.mapHeightP - (3.5*this.tileHeight), 
            `Remember to use your mouse`, popUpConfig).setOrigin(0.5);
        //scene puzzle things
        this.pointerX = 0;
        this.pointerY = 0;
        this.input.on('pointermove', function(pointer){
            this.pointerX = pointer.x;
            this.pointerY = pointer.y;
        }, this);

        // ALL Pointer Hover Interactions
        // "pointerover" == when pointer is hovering on object
        // "pointerout " == when pointer is NOT hovering on object
        // create invisible rectangle over interatables
        this.brainAttention = this.add.rectangle(6*this.tileWidth, 3*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.brainAttention.setInteractive({cursor: 'url(./assets/pointers/BrainPointer.png), pointer'}).on('pointerdown', () => 
        {if(!this.NoPower){this.textbox(player.x, player.y, 'brain')}});
        this.brainAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true); }); });

        this.endAttention = this.add.rectangle(this.mapWidthP - 7*this.tileWidth, 3*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.endAttention.setInteractive().on('pointerdown', () => {
            if(this.noPower){} 
            else{
                this.textbox(player.x, player.y, 'condition not met');
            }
        });
        this.endAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.heartAttention = this.add.rectangle(this.mapWidthP - 12*this.tileWidth, 8*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.heartAttention.setInteractive({cursor: 'url(./assets/pointers/HeartPointer.png), pointer'});
        this.heartAttention.on('pointerdown', () => {if(!this.NoPower){this.textbox(player.x, player.y, 'heart');}});
        this.heartAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.startAttention = this.add.rectangle(this.mapWidthP - 3*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.startAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => {
            if(!this.NoPower){this.textbox(player.x, player.y, 'tutorial');}
        });
        this.startAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.spikeAttention = this.add.rectangle(19*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.spikeAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => {
            this.textbox(player.x, player.y, 'spikes');
        });
        this.spikeAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.lever = this.add.rectangle(4.5*this.tileWidth, 3.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.lever.setInteractive({cursor: 'url(./assets/pointers/LevelPointer.png), pointer'}).on('pointerup', () => {
            this.attention.destroy();
            this.noPower = true;
            this.powerOff = this.map.createLayer('Power Off', this.tileset, 0, 0);
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
        //fog of war around player
        this.rt.clear();
        this.rt.draw(this.light, player.x, player.y);
        //console.log(player.velocityY);
        if((movement.right.isUp || movement.left.isUp || movement.up.isUp || movement.down.isUp)
           && !(movement.right.isDown || movement.left.isDown || movement.up.isDown || movement.down.isDown)
           ){
            player.anims.play('run');
        }
        if(movement.jump.isDown && this.currTime - this.lastTime >= 1000){ // make jump only once
            player.jump();
            this.lastTime = this.currTime;
        }
        if(this.spikes.getTileAtWorldXY(player.x, player.y)){
            this.restart();
        }
        // check if player is ontop of a ladder for climbing
        if(this.climbable.getTileAtWorldXY(player.x, player.y)) 
        {
            player.climb();
        }
        this.currTime = this.time.now; //update current time
        // check if player is at the exit door
        if((Phaser.Math.Within(player.x, this.mapWidthP - this.tileWidth, 64) && Phaser.Math.Within(player.y, 3*this.tileHeight, 128))
          && this.currTime - this.lastTime >= 2500){ // only trigger once every 2.5 seconds
            if(true){ // previsouly was if this.NoPower for power off condition
                completed[0] = 1;  //set completed tutorial level to true
                this.scene.start('gameover');
            }/* else {
                this.lastTime = this.currTime;
                this.textbox(player.x, player.y, 'Condition not met');
                this.time.delayedCall(2500, ()=> {this.tb.clear(true, true);});
            }*/
        }
    }

    restart(){
        this.scene.start('tutorial');
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
        // X is center of camera - width 
        // Y is cameras current Y value + (center - height) to be above the player and give some extra space
        this.tb.add(this.add.text(this.cameras.main.centerX - 50, this.cameras.main.y + (this.cameras.main.centerY/2 - 1.2*height),
            this.boxMsgs.messageFind(objName), this.txtstyle).setScrollFactor(0) );
    }
}