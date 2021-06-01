class TextBubbles {
    constructor(){
        // add messages as needed
        // we can have any number of messages
        this.faucet = 'Click to Stop the flow';
        this.drain  = 'Click to Drain the Water';
        this.brain  = "This seems to supply power to the house";
        this.heart  = "This seems to move liquid around the pipes";
        this.noExit = "I still have things to do here...";
    }

    messageFind(objectName){
        // make sure to add your above message into the cases in this switch!
        switch(objectName){
            case 'faucet':
                return this.faucet;
            case 'drain':
                return this.drain;
            case 'brain':
                return this.brain;
            case 'heart':
                return this.heart;
            case 'condition not met':
                return this.noExit;
            default:
                console.log('Txtbubbles invalid objectName returning empty string');
                return '';
        }
    }

    messageLength(objectName){
        // make sure to add your above message into the cases in this switch!
        switch(objectName){
            case 'faucet':
                return this.faucet.length;
            case 'drain':
                return this.drain.length;
            case 'brain':
                return this.brain.length;
            case 'heart':
                return this.heart.length;
            case 'condition not met':
                return this.noExit.length;
            default:
                console.log('Txtbubbles invalid objectName for length find');
                return 1;
        }
    }

}