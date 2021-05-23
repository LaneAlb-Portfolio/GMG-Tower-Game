class TextBubbles {
    constructor(){
        // add messages as needed
        // we can have any number of messages
        this.drain  = 'Click to Drain the Water';
        this.faucet = 'Click to ...';
    }

    messageFind(objectName){
        // make sure to add your above message into the cases in this switch!
        switch(objectName){
            case 'faucet':
                return this.faucet;
            case 'drain':
                return this.drain;
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
            default:
                console.log('Txtbubbles invalid objectName for length find');
                return 1;
        }
    }

}