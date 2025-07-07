let AUDIOFILE = "audiofile";
let TEXT = "TextToSpeech";
let LINK = "link";
let AUDIOELEMENT = null;
function TTS(s,volume=1){
  let utterance = new SpeechSynthesisUtterance(s);
  utterance.volume = volume;
  speechSynthesis.speak(utterance);
  return utterance;
}

function buttonFactory(options){
  let button = document.createElement("button");
  button.innerHTML = options.label;
  button.value = options.value;
  button.type = options.type;

  if(options.parent){
    options.parent.appendChild(button);
  }
  return button;
}

const AudioManager = {};
AudioManager.speaking = false;
AudioManager.speechDelay = 200;
AudioManager.play = function(type, value, volume = 1){
  if(AudioManager.speaking) return;
  AudioManager.speaking = true;
  switch(type){
    case TEXT:
      let utterance = TTS(value, volume);
      utterance.addEventListener('end',(e)=>{
        setTimeout(()=>{
          console.log("speech over")
        AudioManager.speaking = false;
      },AudioManager.speechDelay);
      });
      break;
    default:
      AudioManager.speaking=false;
      break;
  }
}
AudioManager.cancel = function(){
  speechSynthesis.cancel();
}

class AudioElement{
  constructor(type, value, label, parent=null){
    this.type = type;
    this.value = value;
    this.label = label;
    this.button = buttonFactory({
      type:type,
      value:value, 
      label:label
    });
    this.button.onclick = this.play.bind(this);
    if(parent){
      parent.appendChild(this.button);
    }
  }

  play(){
    AudioManager.play(this.type, this.value, 1);
  }

  readLabel(volume = 0.75){
    AudioManager.play(TEXT, this.label, volume);
  }
}
function init(){
  AUDIOELEMENT = document.createElement('audio');
}
init();
export {AudioElement}
