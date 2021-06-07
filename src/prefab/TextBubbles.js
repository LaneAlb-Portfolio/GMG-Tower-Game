class TextBubbles {
    constructor(){
        // add messages as needed
        // we can have any number of messages

    
        //main menu
        this.elevator = "This must go somewhere";
        this.falsebutton = "Faulty Button, check other side"
        this.lever    = "This lever must do something";


        //Intuitive thoughts: when power is off
        this.noPower = "Maybe I should turn the brain on first.";

        //tutorial
        this.tut      = "Welcome to the tutorial! Explore and have fun.";
        this.but      = "Hello I am a button, you don't need to click me to read me";
        this.spikes   = "Beware of the spikes, they will kill you!";
        this.brain    = "This is the brain, it powers everything here.";
        this.brain0    = "Hello, Im the brain. I. HAVE. POWER!"; //this should be on the brain popup itself
        this.heart    = "This is the heart, it supplies blood through pipes.";
        this.heart0    = "Hello Im... the heart... thump thump... thump thump"; //this should be on the heart popup itself
        this.exit = "You are nearing the end, normally this is where you would double check your game objectives.";

        //level 1
        this.button1 = "Heart is causing problems, Worker needed.";
        this.button2 = "Liquid Leaking Elsewhere";
        this.heart1 = "thump thump... thump thump... thump thump...";
        this.brain1 = "bzzt.. bzzt.. bzzt..";
        this.faucetOn = 'Blood is still spewing out of the pipe.'; //intuiton 1:  when the player clicks no on the pipe first (ie. the drain, or the lever)
        this.cantYet  = 'The room is still flooded with blood.'; //intuiton 2: when the player hasn't opened the drain
        this.leverOn = "The door won't open without flipping the switch"; //intuition 3 (if we choose to keep it): when the player clicks the door and not the switch
        
        //level 2 things
        //this.noExit   = "I still have things to do here...";
        
    }

    messageFind(objectName){
        // make sure to add your above message into the cases in this switch!
        // dont need break; since we just return immediately
        switch(objectName){
            //main menu things
            case 'elevator':
                return this.elevator;
            case 'buttonFalse':
                return this.falsebutton;
            case 'lever':
                return this.lever;

            //tutorial
            case 'noPower':
                return this.noPower;
            case 'tutorial':
                return this.tut;
            case 'button':
                return this.but;
            case 'spikes':
                return this.spikes;
            case 'brain':
                return this.brain;
            case 'brain0':
                return this.brain0;
            case 'heart':
                return this.heart;
            case 'heart0':
                return this.heart0;
            case 'exit':
                    return this.exit;
            
            //level1
            case 'button1':
                return this.button1;
            case 'button2':
                return this.button2;
            case 'heart1':
                    return this.heart1;
            case 'brain1':
                    return this.brain1;
            case 'faucetOn':
                return this.faucetOn;
            case 'Cant Do Yet':
                return this.cantYet;
            case 'leverOn':
                    return this.leverOn;
            
            //non level things
            //case 'condition not met':
                //return this.noExit;
            

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
            case 'Cant Do Yet':
                return this.cantYet.length;
            case 'condition not met':
                return this.noExit.length;
            case 'elevator':
                return this.elevator.length;
            case 'lever':
                return this.lever.length;
            default:
                console.log('Txtbubbles invalid objectName for length find');
                return 1;
        }
    }

}