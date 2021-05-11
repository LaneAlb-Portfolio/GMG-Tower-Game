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
        // use velocity instead?
        if(cursors.left.isDown){
            this.x -= 2;
            this.setFlipX(true);
        }
        if(cursors.right.isDown){
            this.x += 2;
            this.setFlipX(false);
        }
    }

    // flip sprite vertical axis
    flip(){
        // play animation ifneeded yada yada flipper
        this.flipped = !this.flipped;
        this.setFlipY(this.flipped);
    }
}