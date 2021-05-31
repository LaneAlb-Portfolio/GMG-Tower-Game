class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        // setup level buttons
        this.tutorial = this.add.rectangle(centerX/3, centerY/3, 94, 94, 0x559060, 1);
        this.add.text(this.tutorial.getCenter().x,this.tutorial.getCenter().y, 'T', buttonConfg).setOrigin(0.5);

        this.lvl1     = this.add.rectangle(centerX, centerY/3, 94, 94, 0x905560, 1);
        this.add.text(centerX,this.lvl1.getCenter().y, '1', buttonConfg).setOrigin(0.5);

        this.lvl2     = this.add.rectangle(gameW - centerX/3, centerY/3, 94, 94, 0x704070, 1);
        this.add.text(this.lvl2.getCenter().x,this.lvl2.getCenter().y, '2', buttonConfg).setOrigin(0.5);
        
        //setup click events
        this.tutorial.setInteractive().on('pointerdown', () => {this.down('tutorial')});
        this.lvl1.setInteractive().on('pointerdown', () => {this.down('lvl1')});
        this.lvl2.setInteractive().on('pointerdown', () => {this.down('lvl2')});
        
        // Cannot Access Level Text
        this.Access = this.add.text(centerX,gameH - txtSpacing, 'Cannot Access this level', headerConfig).setOrigin(0.5).setVisible(0);
        this.WiP    = this.add.text(centerX,gameH - txtSpacing, 'Not Available Yet', headerConfig).setOrigin(0.5).setVisible(0);
    }

    down(buttonName){
        console.log(buttonName);
        this.hide();
        // move to specific scene heres
        // switch case
        switch(buttonName){
            case 'tutorial':
                this.scene.start('tutorial');
                break;
            case 'lvl1':
                if(completed[1] != 0){
                    this.scene.start('levelOne');
                } else{ 
                    this.Access.setVisible(1);
                }
                break;
            case 'lvl2':
                if(completed[2] != 0){
                    this.scene.start('levelTwo');
                } else{ 
                    this.WiP.setVisible(1);
                }
                break;
            default:
                console.log('Default Switch Case');
        }
    }
    
    update() {
        if(this.Access.visible || this.WiP.visible){
            this.time.delayedCall(2000, () => { this.hide(); });
        }
    }

    hide(){
        this.Access.setVisible(0); 
        this.WiP.setVisible(0);
    }
}
