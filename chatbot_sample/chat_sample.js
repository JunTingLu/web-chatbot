const content=document.querySelector('#messages-content')
const msginput=document.querySelector('#message-input')
let d, h, m;


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


/* 文字聊天功能 */
// 插入訊息
function insertMessage() {
  const container=document.querySelector('#mCSB_container')
  const msg=msginput.value.trim();
  const newmsg=document.createElement('div');
  // 將 class 屬性塞入div中
  newmsg.classList.add('message', 'message-personal', 'new');
  newmsg.textContent = msg;
  container.appendChild(newmsg)
  // clear after sending message
  msg.value='';
  fetch('http://127.0.0.1:5000/text_message',{
    method:'POST',
    body:JSON.stringify({prompt: msg+'。'}),//設定訊息為肯定句
     headers:{
            'Content-Type':'application/json'
        }  
  })
  .then(response=>response.json())
  .then(({data})=>{
    // insert fakemassge
      // 判斷回傳是否為圖片url
      if (data.type==='image'){
        img_display.src=data.image;
        return 
        }
        // 在text area回傳文字
        const outputText=data.result;
        console.log(61,outputText)
        // msginput.value+=msg;
        // 製造假訊息
        const response =outputText
        // 假訊息回復
        function Message() {
          const newMsg=document.createElement('div')
          newMsg.classList.add('message', 'new');
          // 插入圖片回應
          newMsg.innerHTML = '<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" /></figure>' + response;
          // updateScrollbar();
          container.appendChild(newMsg);
        
          setTimeout(function() {
          newMsg.innerHTML = '<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" /></figure>' + response;
          container.appendChild(newMsg).classList.add('new');
          // setDate();
          // updateScrollbar();
          }, 500);
        }
        // msginput.value+='\n'+outputText+'\n'; 
      // setDate();
      // 更新消息窗口的滾動條位置
      // updateScrollbar();
      // 在 1000 毫秒後（即 1 秒後）觸發 fakeMessage() 函式，該函式會自動回復一條虛假的消息
      setTimeout(function() {
        Message();
      }, 500); //
    })
    .catch(error=>console.error(error))
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
