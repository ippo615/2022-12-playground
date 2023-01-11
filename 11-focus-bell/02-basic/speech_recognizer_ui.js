// needs html like the following: (contenteditable is optional)
//
// <button id="btn-speech-start">I have something to say!</button>
// <div id="speech-result" class="editor" contenteditable="true">
//     <span id="speech-interim"></span>
// </div>
// <div id="status-bar">Status</div>
// 
class SpeechRecognizerUI extends SpeechRecognizer {
    constructor(){
        super()
        this.btnStates = [
            "Start Listening",
            "Stop Listening"
        ];
        this.btnStart = document.getElementById("btn-speech-start"); 
        this.statusBar = document.getElementById("status-bar");
        this.nodeSpeechInterim = document.getElementById("speech-interim");
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
        this.btnStart.onclick = (() => speech.onBtnClick());
    }
    
    // Main events
    onResultInterim(result, event){
        this.nodeSpeechInterim.textContent = result[0].transcript;
    }
    onResultFinal(result, event){
        this.nodeSpeechInterim.insertAdjacentHTML("beforeBegin", result[0].transcript);
        this.nodeSpeechInterim.textContent = "";
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
}
