
let watchdog = new Watchdog();
watchdog.onAlert = (() => {
    // NOTE: we cannot load sounds until after a user interaction (aka NOT on page load)
    let watchdogSound = new Howl({
        src: ["bell.mp3"]
        // src: ["https://www.dropbox.com/s/nlxnvscucwz9lna/End%20Bell%201.mp3?dl=0&raw=1"]
        // src: ['https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3']
    });
    watchdogSound.play();
    console.info('Watchdog triggered!');
});
// watchdog.enable();

let speech = new SpeechCaptionerWithWatchdog();
speech.setup();
speech.watchDog = watchdog;
speech.watchDogDurationNode = document.getElementById("text-watchdog-duration");
speech.watchDogPhraseNode = document.getElementById("text-watchdog-phrase");

let langSelector = new LangSelector();
langSelector.setup();
langSelector.select_language.selectedIndex = 6;  // english
langSelector.setupDialect();
langSelector.select_dialect.selectedIndex = 6;  // united states
langSelector.onchange = (() =>{
    speech.setup();
    speech.recognition.lang = langSelector.getLang();
});

