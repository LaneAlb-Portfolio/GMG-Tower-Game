class UpwordsPlat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, endY, velocity, texture) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, texture);
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setImmovable();
        this.velocity = -(velocity);            // velocity is normally given as a positive, flip this as necessary
        this.start    = y;
        this.end      = endY;
        // time for the sake of not triggering update() conditions more than once per x time in ms
        this.time     = scene.time.now;
        this.currTime = scene.time.now;
    }

    update(){
        // 32 is half our tile height
        this.setVelocityY(this.velocity);
        if(this.y < this.end && (this.currTime - this.time) > 2000){
            //console.log(this.currTime - this.time);
            this.velocity = -(this.velocity);
            this.time = this.currTime;
        } else if (this.y > this.start && (this.currTime - this.time) > 2000){
            //console.log(this.currTime - this.time);
            this.time = this.currTime;
            this.velocity = -(this.velocity);
        } else {
            this.currTime += 60;
        }
    }

    setVelX(amount){this.setVelocityX(amount);}
    setVelY(amount){this.setVelocityY(amount);}
}