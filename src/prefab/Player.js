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
        //this.setCollideWorldBounds(true);
        this.setDepth(1); // set z height to 
        this.setBlendMode('SCREEN');
        this.setMaxVelocity(1000,1000);
        this.setDragY(0);
        this.setBounce(0);
        this.setGravityY(1000);
    }
    update() {
        // get movement based on input
        if(movement.right.isDown){
            this.setVelocityX(500);
            this.setFlipX(false);
        } else if(movement.left.isDown) {
            this.setVelocityX(-500);
            this.setFlipX(true);
        } else {
            this.setVelocityX(0);
        }
    }

    slow(){
        // slow player for some reason
        this.VelocityX = this.VelocityX/2;
    }

    climb(){
        if(movement.up.isDown){
            this.setVelocityY(-150);
        } else if(movement.down.isDown) {
            this.setVelocityY(150);
        }
    }

    jump(){
        this.setVelocityY(-500);
    }

    setVelX(amount){this.setVelocityX(amount);}
    setVelY(amount){this.setVelocityY(amount);}
}