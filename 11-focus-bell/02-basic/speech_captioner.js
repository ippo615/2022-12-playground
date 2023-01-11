
class Caption {
    constructor(){
        this.startTime = new Date();
        this.text = '';
    }
}

class SpeechCaptioner extends SpeechRecognizer {
    constructor(){
        super()
        this.btnStates = [
            "Start Listening",
            "Stop Listening"
        ];
        this.btnStart = document.getElementById("btn-speech-start"); 
        this.statusBar = document.getElementById("status-bar");
        this.nodeSpeechInterim = document.getElementById("speech-interim");
        this.captions = [];
        this.isNewCaption = true;
    }
    // internal stuff
    setStatusMessage(msg){
        //console.info(msg);
        this.statusBar.innerHTML = msg;
    }
    onBtnClick(){
        // if running - stop
        if( this.btnStart.textContent == this.btnStates[1] ){
            this.stop();
            return;
        }
        
        // if not running - start
        this.btnStart.textContent = this.btnStates[1];
        // this.setup();
        this.start();
    }
    registerEventHandlers(){
        super.registerEventHandlers();
        this.btnStart.onclick = (() => this.onBtnClick());
    }
    
    // Main events
    onResultInterim(result, event){
        if(this.isNewCaption){
            this.captions.push(new Caption(result[0].transcript));
            this.isNewCaption = false;
        }else{
            this.captions[this.captions.length-1].text = result[0].transcript;
        }
        document.getElementById("editor").innerHTML = this.toHtml();
        // this.nodeSpeechInterim.textContent = result[0].transcript;
    }
    onResultFinal(result, event){
        this.captions[this.captions.length-1].text = result[0].transcript;
        this.isNewCaption = true;
        document.getElementById("editor").innerHTML = this.toHtml();
        // this.nodeSpeechInterim.insertAdjacentHTML("beforeBegin", result[0].transcript);
        // this.nodeSpeechInterim.textContent = "";
    }
    start(){
        this.isNewCaption = true;
        super.start();
    }
    stop(){
        super.stop();
        this.btnStart.textContent = this.btnStates[0];
    }
    // Logging/debug
    onError(event){
        this.stop();
        this.setStatusMessage('Error occurred in recognition: ' + event.error);
    }
    onNoMatch(event){this.setStatusMessage('SpeechRecognition.onnomatch');}
    onSoundStart(event){this.setStatusMessage('SpeechRecognition.onsoundstart');}
    onSoundEnd(event){this.setStatusMessage('SpeechRecognition.onsoundend');}
    onAudioStart(event){this.setStatusMessage('SpeechRecognition.onaudiostart');}
    onAudioEnd(event){this.setStatusMessage('SpeechRecognition.onaudioend');}
    onSpeechStart(event){this.setStatusMessage('SpeechRecognition.onspeechstart');}
    onSpeechEnd(event){this.setStatusMessage('SpeechRecognition.onspeechend');}
    onStart(event){this.setStatusMessage('SpeechRecognition.onstart');}
    onEnd(event){this.setStatusMessage('SpeechRecognition.onend');}

    simpleDateStringDiff(oldString, newString){
        let oldParts = oldString.split(/\s+/);
        let newParts = newString.split(/\s+/);
        
        // If a section has been added/removed: return the entire new string
        if(oldParts.length != newParts.length){
            return newString;
        }

        // Otherwise: return the changed section
        for(let i=0, l=oldParts.length; i<l; i+=1 ){
            if(oldParts[i] != newParts[i]){
                return newParts[i];
            }
        }

        // when the same return nothing
        return '';

    }

    // for debugging
    prettyTime(date){
        // kinda odd/ugly
        // return (new Intl.DateTimeFormat(navigator.language, {
        //     month:"long",
        //     day: "numeric",
        //     year: "numeric",
        //     hour: "2-digit",
        //     minute: "2-digit",
        // })).format(date);
        // by default it includes seconds so we remove seconds
        return date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        // return date.toTimeString().split(' ')[0];
        // return date.toLocaleString();
    }
    toHtml(){
        let html = [];
        let lastTime = '';
        for( let i=0, l=this.captions.length; i<l; i+=1 ){
            let caption = this.captions[i];
            let thisTime = this.prettyTime(caption.startTime);
            // Handle time only
            let printTime = thisTime;
            if(thisTime == lastTime){
                printTime = '';
            }
            // Uncomment for different formatting but looks odd with AM/PM
            // let printTime = this.simpleDateStringDiff(''+lastTime, ''+thisTime);
            if(printTime){
                html.push(`<div class="line"><div class="gutter">${printTime}</div><div class="content">${caption.text}</div></div>`);
            }else{
                html.push(`<div class="line"><div class="gutter"> </div><div class="content">${caption.text}</div></div>`);
            }
            lastTime = thisTime;
        }
        return html.join('');
    }
}
