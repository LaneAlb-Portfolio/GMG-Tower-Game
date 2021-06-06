class Select extends Phaser.Scene {
    constructor() {
        super('select');
    }

    create() {
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'MainMenu'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createLayer('BG', this.tileset, -64, -64);
        if(!backmusic.isPlaying){
            backmusic.play();
        }
        // "back" arrow geometry
        this.body  = this.add.rectangle(112, gameH - 74, 74, 37, 0x6666ff).setOrigin(0.5);
        this.point = this.add.triangle(32, gameH - 74, 25, 37, 74, 74, 74, 0, 0x6666ff).setOrigin(0.5);
        this.point.setStrokeStyle(3, 0x545454);
        this.body .setStrokeStyle(3, 0x545454);

        // setup level buttons
        this.tutorial = this.add.rectangle(centerX/3, centerY/3, 94, 94, 0x559060, 1);
        this.tutorial.setStrokeStyle(4, 0x545454);
        this.add.text(this.tutorial.getCenter().x,this.tutorial.getCenter().y, 'T', buttonConfg).setOrigin(0.5);

        this.lvl1  = this.add.rectangle(centerX, centerY/3, 94, 94, 0x7da4e3, 1);
        this.l1Txt = this.add.text(centerX + 5,this.lvl1.getCenter().y, '1', buttonConfg).setOrigin(0.5);
        this.lvl1.setStrokeStyle(4, 0x545454);

        this.lvl2  = this.add.rectangle(gameW - centerX/3, centerY/3, 94, 94, 0x704070, 1);
        this.l2Txt = this.add.text(this.lvl2.getCenter().x + 5,this.lvl2.getCenter().y, '2', buttonConfg).setOrigin(0.5);
        this.lvl2.setStrokeStyle(4, 0x545454);
        
        //setup click events
        this.tutorial.setInteractive().on('pointerdown', () => {this.down('tutorial')});
        this.lvl1 .setInteractive().on('pointerdown',  ()   => {this.down('lvl1')});
        this.lvl2 .setInteractive().on('pointerdown',  ()   => {this.down('lvl2')});
        this.point.setInteractive().on('pointerdown',  ()   => {this.down('back')});
        this.body .setInteractive().on('pointerdown',  ()   => {this.down('back')});

        // Cannot Access Level Text
        this.Access = this.add.text(centerX,gameH - txtSpacing, 'Cannot Access this level', headerConfig).setOrigin(0.5).setVisible(0);
        this.WiP    = this.add.text(centerX,gameH - txtSpacing, 'Not Available Yet', headerConfig).setOrigin(0.5).setVisible(0);

        // level completion checks
        if(completed[0] == 0){ // this means tutorial is not done
            // grey X on lvl1
            this.l1Txt.tint = 0x525252;
        }
        if(completed[1] == 0){ // this means lvl1 is not done
            // grey X on lvl2
            this.l2Txt.tint = 0x525252;
        }
    }

    down(buttonName){
        console.log(buttonName);
        this.hide();
        // move to specific scene heres
        // switch case
        switch(buttonName){
            case 'tutorial':
                this.hide();
                backmusic.stop();
                this.scene.start('tutorial');
                break;
            case 'lvl1':
                this.hide();
                if(completed[0] != 0){
                    backmusic.stop();
                    this.scene.start('levelOne');
                } else{ 
                    this.Access.setVisible(1);
                }
                break;
            case 'lvl2':
                this.hide();
                this.WiP.setVisible(1);
                break;
            case 'back':
                this.hide();
                this.scene.start('title');
                break;
            default:
                console.log('Default Switch Case');
        }
    }
    
    update() { }

    hide(){
        if(this.Access.visible){
            this.Access.setVisible(0);
        }
        if(this.WiP.visible){
            this.WiP.setVisible(0);
        }
    }
}
