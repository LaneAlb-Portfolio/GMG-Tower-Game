class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        this.movementVelocity = 200;
        this.currTime = this.time.now;
        this.lastTime = -1000;
        // Text Bubbles Prefab
        this.tb = this.add.group(this);
        this.boxMsgs = new TextBubbles();
        // background music
        backmusic = this.sound.add('runmp3',{
            mute: false,
            volume: 0.7,
            rate: 0.5,
            loop:true
        });
        if(!backmusic.isPlaying){
            backmusic.play();
        }
        // Background
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'MainMenu'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createLayer('BG', this.tileset, 0, 0); 
        this.floor        = this.map.createLayer('Ground', this.tileset, 0, 0); // make ground walkable
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0, 0);       // climbable objects
        this.attention    = this.map.createLayer('Inital State', this.tileset, 0, 0); // info graphics "on"
        this.noPower = this.map.createLayer('Power off', this.tileset, 0, 0);
        this.map.createLayer('Special State', this.tileset, 0, 0);
        // const bounds   = this.map.createLayer('Grounds for the Camera');
        const spawnPoint  = this.map.findObject("Spawns", obj => obj.name == "START");        // grab spawn info
        this.noPower.visible = false;
        // for ease of use
        this.tileHeight = this.map.tileHeight;
        this.tileWidth  = this.map.tileWidth;
        this.mapHeightP = this.map.heightInPixels;
        this.mapWidthP  = this.map.widthInPixels;
        console.log("TileMap Info: W/H" + this.mapHeightP + " , " + this.mapWidthP);
        console.log("Tile W/H: " + this.tileHeight + " , " + this.tileWidth);

        // Title Txt
        this.add.text(10*this.tileWidth, 6*this.tileHeight, 'Living Demolition', headerConfig).setOrigin(0.5);
        this.add.text(10*this.tileWidth, 6*this.tileHeight + 32, 'Use your mouse to Interact with Panels', bodyConfig).setOrigin(0.5);
        this.add.text(46, gameH - txtSpacing/2, 'GMG 2021', bodyConfig).setOrigin(0.5).setScrollFactor(0);
        this.add.text(75, gameH - txtSpacing/4, 'Font by Style-7', bodyConfig).setOrigin(0.5).setScrollFactor(0);

        // interaction setup
        this.startAttention = this.add.rectangle(10*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.startAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        {this.scene.start('select');});
        this.startAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.creditsAttention = this.add.rectangle(this.mapWidthP - 5*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.creditsAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        {backmusic.stop(); this.scene.start('staticCredits');});
        this.creditsAttention.on('pointerup', () => {this.time.delayedCall(2500, () => { this.tb.clear(true, true);   }); });

        this.lever = this.add.rectangle(6.5*this.tileWidth, 2.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.lever.setInteractive({cursor: 'url(./assets/pointers/LevelPointer.png), pointer'}).on('pointerup', () => {
            this.attention.destroy();
            if(!this.noPower.visible){ // if power is ON
                this.noPower.visible = true;
                this.attention.visible = false;
            } else{ // let the player turn power back on
                this.noPower.visible = false;
                this.attention.visible = true;
            }
        });

        // give platforms scene, x, y, endPoint, velocity, texture)
        this.upPlatforms = new UpwordsPlat(this, this.tileWidth, this.mapHeightP - 2*this.tileHeight, 3*this.tileHeight, this.movementVelocity, 'mPlat').setOrigin(0);        
        this.upPlatforms.setScale(0.5);
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
        player = new Player(this, spawnPoint.x, spawnPoint.y, 'player', 0);
        player.setScale(1.8);
        player.anims.play('run');

        //camera things
        //configuration
        this.cameras.main.setBounds(0,0,this.mapWidthP,this.mapHeightP);
        this.cameras.main.setZoom(1);
        //have the camera follow the player
        this.cameras.main.startFollow(player);
        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.climbable.setCollisionByExclusion(-1, true);
        //bounds.setCollisionByExclusion(-1, true);
        // setup world collliders
        this.physics.add.collider(this.floor, player);
        this.physics.add.overlap (this.climbable, player);
        this.physics.add.collider(this.upPlatforms, player);
        //this.physics.add.collider(bounds, player);
        // set up cursor keys for title screen input
        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D", jump:"SPACE"});
    }

    update() {
        player.update();
        this.upPlatforms.update();
        this.currTime = this.time.now; //update current time
        if(movement.left.isUp && movement.right.isUp){
            player.anims.play('run');
        }
        if(movement.jump.isDown && this.currTime - this.lastTime >= 1000){ // make jump only once
            player.jump();
            this.lastTime = this.currTime;
        }
        if(this.climbable.getTileAtWorldXY(player.x, player.y)) 
        {
            player.climb();
        }
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
        // X is center of camera - width of message above
        // Y is based on the current scroll factor of the camera
        // if the scroll factor is > 0 or < gameH then we know the character is center of camera
        // else he is either near the top or bottom respectively

        if(this.cameras.main.scrollY < 480 && this.cameras.main.scrollY > 0){
            y = this.cameras.main.centerY / 2 - (2*height);
        } else if (this.cameras.main.scrollY == 0){
            y = this.cameras.main.centerY / 2 - 1.2*height; // give some room above player head by padding height
        } else { // camera at bottom of the map, character is there too
            y = this.cameras.main.centerY;
        }

        this.tb.add(this.add.text(this.cameras.main.centerX - 50, y,
            this.boxMsgs.messageFind(objName), this.txtstyle).setScrollFactor(0) );
    }
}