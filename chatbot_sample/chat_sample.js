const content=document.querySelector('#messages-content')
const msginput=document.querySelector('#message-input')
let d, h, m;
let i=0;

// 網頁載入完成後觸發
document.addEventListener('DOMContentLoaded',function() {
  // content.mCustomScrollbar();
  // const scrollbar = new SimpleBar(content);
  function trigger_fake(){
  // fakeMessage 函式延遲 100 毫秒後再執行
    setTimeout(function() {
    fakeMessage();
  }, 100);
}
  msginput.addEventListener('click',trigger_fake());
});


// function updateScrollbar() {
//   scrollbar.getScrollElement().scrollTop = scrollbar.getScrollElement().scrollHeight;
// }

// 取得當時間(min)
// function setDate(){
//   d = new Date()
//   if (m != d.getMinutes()) { // 判斷分鐘是否有變更
//     m = d.getMinutes(); // 記錄目前分鐘
//     // 可用css 中message:last微調
//     $('.message:last')[0].appendChild($('<div class="timestamp">' + d.getHours() + ':' + m + '</div>')[0]);
//   }
// }

const container=document.querySelector('#mCSB_container')
// 插入訊息
function insertMessage() {
  const msg=msginput.value.trim();
  const newmsg=document.createElement('div');
  // 將 class 屬性塞入div中
  newmsg.classList.add('message', 'message-personal', 'new');
  newmsg.textContent = msg;
  container.appendChild(newmsg)

  fetch('/',{
    method:'POST',
    body:JSON.stringify({'userinput':input}),
  })
  .then(response=>response.json())
  .then(data=>{
    // insert fakemassge



  });
  // setDate();
  // 清空對話框內容
  msginput.value='';
  // 更新消息窗口的滾動條位置
  // updateScrollbar();
  // 在 1000 毫秒後（即 1 秒後）觸發 fakeMessage() 函式，該函式會自動回復一條虛假的消息
  setTimeout(function() {
    fakeMessage();
  }, 1000); //
}


const messagesubmit=document.querySelector('#message-submit')
messagesubmit.addEventListener('click',()=>{
  insertMessage();
});


// 監聽鍵盤(enter觸發)
window.addEventListener('keydown', function(e) {
  if (e.key === "Enter") {
    insertMessage();
    // 避免瀏覽器預設的enter行為提交表單或換行
    e.preventDefault();
  }
});


// 製造假訊息
var Fake = [
  'Hi there, I\'m Fabio and you?',
  'Nice to meet you'
]

// 假訊息回復
function fakeMessage() {
  //若為空則返回false
  if (content=== '') {
  return false;
  }
  const newMsg=document.createElement('div')
  newMsg.classList.add('message', 'new');
  // 插入圖片回應
  newMsg.innerHTML = '<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" /></figure>' + Fake[i];
  // updateScrollbar();
  console.log(97,newMsg)
  container.appendChild(newMsg);

  setTimeout(function() {
    newMsg.innerHTML = '<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" /></figure>' + Fake[i];
    container.appendChild(newMsg).classList.add('new');
    // setDate();
    // updateScrollbar();
    i++;
  }, 1000);
}