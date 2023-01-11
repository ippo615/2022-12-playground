var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

class SpeechRecognizer{
    constructor(){
        this.recognition = new SpeechRecognition();
        this._eventIndex = 0;
    }
    setup(){
        // grammar
        var phrase = 'hello world';
        var grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        this.recognition = new SpeechRecognition();
        this._eventIndex = 0;
        this.recognition.grammars = speechRecognitionList;
        // lang stuff
        this.recognition.lang = 'en-US';
        // interim stuff
        this.recognition.interimResults = true;  // waits for "final" recognition
        this.recognition.continuous = true;
        this.recognition.maxAlternatives = 4;  // there are multiple options when isFinal

        // add event handlers
        this.registerEventHandlers();
    }
    registerEventHandlers(){
        this.recognition.onspeechend = ((event) => this.onSpeechEnd(event));
        this.recognition.onerror = ((event) => this.onError(event));
        this.recognition.onaudiostart = ((event) => this.onAudioStart(event));
        this.recognition.onaudioend = ((event) => this.onAudioEnd(event));
        this.recognition.onend = ((event) => this.onEnd(event));
        this.recognition.onnomatch = ((event) => this.onNoMatch(event));
        this.recognition.onsoundstart = ((event) => this.onSoundStart(event));
        this.recognition.onsoundend = ((event) => this.onSoundEnd(event));
        this.recognition.onspeechstart = ((event) => this.onSpeechStart(event));
        this.recognition.onstart = ((event) => this.onStart(event));
        this.recognition.onresult = ((event) => this._onresult(event));
    }
    _onresult = function(event) {
        // event.results[eventIndex][0] changes with interimResults
        // once event.results[eventIndex].isFinal then you can have multiple
        // options if specified with maxAlternatives so you can access:
        // event.results[eventIndex][0..maxAlternatives-1] 
        // which will each have a .transcript and a .confidence
        // You may even be able to access the alternatives sooner but I dont
        // see why you would want to yet.
        let speechResult = event.results[this._eventIndex][0].transcript.toLowerCase();
        let confidence = event.results[this._eventIndex][0].confidence;
        let isFinal = event.results[this._eventIndex].isFinal;
        if(isFinal){
            this.onResultFinal(event.results[this._eventIndex], event);
            this._eventIndex += 1;
        }else{
            this.onResultInterim(event.results[this._eventIndex], event);
        }
    }
    onError(event){}
    onResultInterim(result, event){}
    onResultFinal(result, event){}
    onNoMatch(event){}
    onSoundStart(event){}
    onSoundEnd(event){}
    onAudioStart(event){}
    onAudioEnd(event){}
    onSpeechStart(event){}
    onSpeechEnd(event){}
    onStart(event){}
    onEnd(event){}

    start(){
        this._eventIndex = 0;
        this.recognition.start();
    }
    stop(){
        this.recognition.stop();
    }
}

class SpeechRecognizerUI extends SpeechRecognizer {
    constructor(){
        super()
        this.btnStates = [
            "I have something to say...",
            "Stop listening!"
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
        this.btnStart.onclick = (() => this.onBtnClick());
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
