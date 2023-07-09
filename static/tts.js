const synth = new SpeechSynthesisUtterance();
const voicesSelect = document.getElementById('langs');
const select=document.getElementById('selected');
const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
// 設定語言列表
const langs={
      ja: 'ja-JP',
      en: 'en-US',
      zh: 'zh-TW'  
  } 
// speechSynthesis 語言初始化
synth.lang =langs[voicesSelect.value];

// getVoices()需搭配監聽voiceschanged事件，否則會回傳空陣列
speechSynthesis.addEventListener('voiceschanged', setVoices);

function setVoices(voices, languages) {
  languages = ["en", "ja", "zh"];
  // 取得所有語言列表資訊
  voices = speechSynthesis.getVoices();
  voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.lang;
      option.innerText = `${voice.lang}`;
      if(languages.some(lang =>option.value.includes(lang))) {  
        console.log('lang options',option)
      }
  }); 
}

select.addEventListener('click',(event)=>{
  synth.lang =langs[voicesSelect.value];
  // 選擇完語言後挑出互動視窗
  document.querySelector('.modal-backdrop').classList.remove('show')
  myModal.hide()
});

// 取消時停止撥放
function stop() {
    speechSynthesis.cancel();
}

// 接收後端回傳訊息
function setTextMessage(text) {
  synth.text = text;
  return synth
}

// 語音輸出
function speakText() {
  // 調整語速
  speechSynthesis.rate=1
  // 調整語調
  speechSynthesis.pitch=1.2
  speechSynthesis.speak(synth);
}

/* 匯出函式 */
export{
  setVoices,
  setTextMessage,
  speakText,
  stop
}