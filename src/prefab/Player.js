// this entire thing is copied from our Endless Runner, full replace the bitch
// once we figure out proper stuff
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, velocity) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, texture, velocity); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setImmovable(false);    
        this.setCollideWorldBounds(true);
        this.setDepth(1); // set z height to 
        this.setBlendMode('SCREEN');
        this.setMaxVelocity(200,300);
        this.setDragY(0);
        this.setBounce(0);
    }
    update() {
        // get movement based on input
        if(movement.right.isDown){
            this.setVelocityX(160);
        } else if(movement.left.isDown) {
            this.setVelocityX(-160);
        } else {
            this.setVelocityX(0);
        }
    }

    // flip sprite vertical axis
    flip(){
        // play animation ifneeded yada yada flipper
        this.flipped = !this.flipped;
        this.setFlipY(this.flipped);
    }

    slow(){
        // slow player for some reason 
        this.VelocityX = this.VelocityX/2;
    }
}