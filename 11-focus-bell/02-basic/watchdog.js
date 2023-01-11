class Watchdog {
    constructor(){
        this.durationMilli = 5*60*1000;
        this.timer = null;
    }
    kick(){
        // we disable then enable to reset the timer to keep things more synchronized
        this.disable();
        this.enable();
    }
    enable(){
        if(this.timer != null){
            // throw new Exception("A timer has already been started for this watchdog.");
            console.error("A timer has already been started for this watchdog.");
            return;
        }
        this.timer = setInterval(() => {
            this._check();
        }, this.durationMilli);
    }
    disable(){
        clearInterval(this.timer);
        this.timer = null;
    }
    onAlert(){

    }
    _check(){
        this.onAlert();
    }
}
