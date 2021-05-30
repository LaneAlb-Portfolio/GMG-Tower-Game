class MovingPlat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, velocity, angle, texture) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, texture);
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setImmovable();
        this.angle = 1;
        this.velocity = velocity;
    }

    update(){

    }

    move() {
        if(this.angle == 1){
            this.setVelocityY(this.velocity);
        } else {
            this.setVelocityX(this.velocity);
        }
    }

    setVelX(amount){this.setVelocityX(amount);}
    setVelY(amount){this.setVelocityY(amount);}
}