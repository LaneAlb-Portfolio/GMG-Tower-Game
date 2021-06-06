class TextBubbles {
    constructor(){
        // add messages as needed
        // we can have any number of messages
        this.faucet   = 'Click to Stop the flow';
        this.faucetOn = 'The water is still coming out of the pipe';
        this.drain    = 'Click to Drain the Water';
        this.brain    = "This seems to supply power to the house";
        this.heart    = "This seems to move liquid around the pipes";
        this.noExit   = "I still have things to do here...";
        this.tut      = "I'll Need to shut off power to continue on";
        this.level1   = "The Heart is out of control here";
        this.cantYet  = "I need to Drain this 'Water' first";
        this.spikes   = "I better not touch those things";
    }

    messageFind(objectName){
        // make sure to add your above message into the cases in this switch!
        switch(objectName){
            case 'faucet':
                return this.faucet;
            case 'faucetOn':
                return this.faucetOn;
            case 'drain':
                return this.drain;
            case 'brain':
                return this.brain;
            case 'tutorial':
                return this.tut;
            case 'lvl1':
                return this.level1;
            case 'heart':
                return this.heart;
            case 'spikes':
                return this.spikes;
            case 'cantYet':
                return this.cantYet;
            case 'condition not met':
                return this.noExit;
            default:
                console.log('Txtbubbles invalid objectName returning empty string');
                return '';
        }
    }

    messageLength(objectName){
        // make sure to add your above message into the cases in this switch!
        // this is called when we want to determine textbox height
        switch(objectName){
            case 'faucet':
                return this.faucet.length;
            case 'faucetOn':
                return this.faucetOn.length;
            case 'drain':
                return this.drain.length;
            case 'brain':
                return this.brain.length;
            case 'tutorial':
                return this.tut.length;
            case 'lvl1':
                return this.level1.length;
            case 'heart':
                return this.heart.length;
            case 'spikes':
                return this.spikes.length;
            case 'cantYet':
                return this.cantYet.length;
            case 'condition not met':
                return this.noExit.length;
            default:
                console.log('Txtbubbles invalid objectName for length find');
                return 1;
        }
    }

}