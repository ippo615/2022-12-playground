
class SpeechCaptionerWithWatchdog extends SpeechCaptioner {
    constructor(){
        super()
        this.watchDog = new Watchdog();
        this.watchDogPhrase = 'hello';
        this.watchDogDurationNode = null;
        this.watchDogPhraseNode = null;
        this.watchDogMinDurationMilli = 30000; // 30 seconds
    }
    // registerEventHandlers(){
    //     super.registerEventHandlers();
    //     this.btnStart.onclick = (() => this.onBtnClick());
    // }
    
    // Main events
    onResultInterim(result, event){
        super.onResultInterim(result, event);
        this.checkForWatchdogPhraseInText(result[0].transcript);
    }
    onResultFinal(result, event){
        super.onResultFinal(result, event);
        this.checkForWatchdogPhraseInText(result[0].transcript);
    }
    checkForWatchdogPhraseInText(text){
        if( text.toLowerCase().indexOf(this.watchDogPhrase) > -1 ){
            this.watchDog.kick()
        }
    }
    start(){
        super.start();
        // update the target phrase
        this.watchDogPhrase = this.watchDogPhraseNode.value.toLowerCase();
        // get the entered duration and enforce a minimum duration of 30 seconds
        let durationMilli = this.parseDurationStringToMs(this.watchDogDurationNode.value);
        if(durationMilli < this.watchDogMinDurationMilli) {
            durationMilli = this.watchDogMinDurationMilli;
        }
        this.watchDog.durationMilli = durationMilli;
        this.watchDog.enable();
    }
    stop(){
        super.stop();
        this.watchDog.disable();
    }
    onEnd(){
        console.info('Ending and restarting...')
        // we only want to restart the capturing not the watchdog
        // note we need to change some other state so we should change this
        // but we'll leave it quick+dirty for now
        super.start();
    }
    

    parseDurationStringToMs(timeText){
        // assume lazy time format
        let hmsReg = /\s*((?<hours>\d+)\s*h[ours]*\s*)?((?<minutes>\d+)\s*m[inutes]*\s*)?((?<seconds>\d+)\s*s[econds]*)?/;
        let result = hmsReg.exec(timeText);
        console.info(result);
        if(result == null){
            return;
        }
        // if there are values parse them otherwise use 0
        let hours = result.groups.hours ? parseFloat(result.groups.hours) : 0;
        let minutes = result.groups.minutes ? parseFloat(result.groups.minutes) : 0;
        let seconds = result.groups.seconds ? parseFloat(result.groups.seconds) : 0;
        return hours*60*60*1000 + minutes*60*1000 + seconds*1000;
    }

}
