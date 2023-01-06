
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

    // for debugging
    prettyTime(date){
        return date.toTimeString().split(' ')[0];
        // return date.toLocaleString();
    }
    toHtml(){
        let html = [];
        for( let i=0, l=this.captions.length; i<l; i+=1 ){
            let caption = this.captions[i];
            html.push(`<div class="line"><div class="gutter">${this.prettyTime(caption.startTime)}</div><div class="content">${caption.text}</div></div>`);
        }
        return html.join('');
    }
}
