// Init speech synth
const message = new SpeechSynthesisUtterance();
const voicesSelect = document.getElementById('voices');
const select=document.getElementById('selected');
const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'))


/* 寫好特定幾種語言之下拉是選單 */
// Choose voices 
let voices = [];
function getVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.innerText = `${voice.name} ${voice.lang}`;
    voicesSelect.appendChild(option);
  });
}




// Set input text from flask
function setTextMessage(text) {
  message.text = text;
  return message
}

// Set voice
function setVoice(e) {
  message.voice = voices.find(voice => voice.name === e.target.value);
}

// Change voice
voicesSelect.addEventListener('change', setVoice);

// Voices changed
speechSynthesis.addEventListener('voiceschanged', getVoices);

// Speak text
function speakText() {
  speechSynthesis.speak(message);
}

select.addEventListener('click',(event)=>{
    // decide the choosed lang
    getVoices()
    // classList 選定欲remove的class
    document.querySelector('.modal-backdrop').classList.remove('show')
    myModal.hide()
});



/* 匯出函式 */
export {
  // 函式內容
  getVoices,
  setTextMessage,
  speakText,
  setVoice,
}