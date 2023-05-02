// Init speech synth
const message = new SpeechSynthesisUtterance();
const voicesSelect = document.getElementById('voices');
const readBtn = document.getElementById('input-text');
const toggleBtn = document.getElementById('toggle-btn'); 
const select=document.getElementById('selected');
const closeBtn = document.getElementById('close');
const textbox= document.getElementById('text-box');
const textwindow=document.getElementById('staticBackdrop')

// Store voices
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

// Toggle text box
toggleBtn.addEventListener('click', (event)=>{
    textbox.classList.toggle('show')
});

// Close button
closeBtn.addEventListener('click', ()=>{
  // 針對class屬性
    textbox.classList.remove('show')
});


// Read text button
// readBtn.addEventListener('click', () => {
//   // import chat.js, and get the response from flask
//     // setTextMessage(message);
//     console.log(67)
//     speakText();
//   });

select.addEventListener('click',(event)=>{
  // decide the choosed lang
    getVoices();
    textwindow.classList.remove('show');
});

// speakText();


/* 匯出函式 */
export {
  // 函式內容
  getVoices,
  setTextMessage,
  speakText,
  setVoice,
}