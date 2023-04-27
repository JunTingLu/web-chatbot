
const voicesSelect = document.getElementById('voices');
const readBtn = document.getElementById('input-text');
const toggleBtn = document.getElementById('toggle-btn'); 
const closeBtn = document.getElementById('close');


// Init speech synth
const message = new SpeechSynthesisUtterance();

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

// Speak text
function speakText() {
  speechSynthesis.speak(message);
}

// Set voice
function setVoice(e) {
  message.voice = voices.find(voice => voice.name === e.target.value);
}

// Voices changed
speechSynthesis.addEventListener('voiceschanged', getVoices);

// Toggle text box
toggleBtn.addEventListener('click', (event)=>{
  document.getElementById('text-box').classList.toggle('show')
});

// Close button
closeBtn.addEventListener('click', () =>
  document.getElementById('text-box').classList.remove('show')
);

// Change voice
voicesSelect.addEventListener('change', setVoice);

// Read text button
readBtn.addEventListener('click', () => {
// import chat.js, and get the response from flask
  // setTextMessage(message);
  speakText();
});

getVoices();


export {
  // 函式內容
  getVoices,
  setTextMessage,
  speakText,
  setVoice,
}