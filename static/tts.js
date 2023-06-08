// Init speech synth
const synth = new SpeechSynthesisUtterance();
const voicesSelect = document.getElementById('langs');
const select=document.getElementById('selected');
const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'))

// getVoices()需搭配監聽voiceschanged事件，否則會回傳空陣列
speechSynthesis.addEventListener('voiceschanged', setVoices);
// 創建語言列表
const langs={
    ja: 'ja-JP',
    en: 'en-US',
    zh: 'zh-TW'  
} 

function setVoices(voices, languages) {
  languages = ["en", "ja", "zh"];
  // 取得所有語言列表資訊
  voices = speechSynthesis.getVoices();
  voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.lang;
      option.innerText = `${voice.lang}`;
      console.log(33,option.value)
      if(languages.some(lang =>option.value.includes(lang))) {  
      }
  }); 
}

select.addEventListener('click',(event)=>{
  synth.lang =langs[voicesSelect.value];
  console.log(10,synth)
  // classList 選定欲remove的class
  console.log(46,voicesSelect.value)
  // the window cancel after selected lang
  document.querySelector('.modal-backdrop').classList.remove('show')
  myModal.hide()
});

// 取消時停止撥放
function stop(){
    speechSynthesis.cancel();
}

// Set input text from flask
function setTextMessage(text) {
  synth.text = text;
  return synth
}

// Speak text
function speakText() {
  speechSynthesis.speak(synth);
  // 調整語速
  speechSynthesis.rate=1
  // 調整語調
  speechSynthesis.pitch=1.3
}


/* 匯出函式 */
export {
  // 函式內容
  setVoices,
  setTextMessage,
  speakText,
  stop
}