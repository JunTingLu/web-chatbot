const content=document.querySelector('#messages-content')
const msginput=document.querySelector('#message-input')
const container=document.querySelector('#chat_content')

/* 文字聊天功能 */
// 插入訊息
function insertMessage() {
  const msg=msginput.value.trim();
  const newmsg=document.createElement('div');
  // 將 class 屬性塞入div中
  newmsg.classList.add('message', 'message-personal', 'new');
  newmsg.textContent = msg;
  container.appendChild(newmsg)
  // clear after sending message
  msginput.value='';
  fetch('http://127.0.0.1:5000/text_message',{
    method:'POST',
    body:JSON.stringify({prompt: msg+'。'}),//設定訊息為肯定句
     headers:{
            'Content-Type':'application/json'
        }  
  })
  .then(response=>response.json())
  .then(({data})=>{
        // 在text area回傳文字
        const outputText=data.result;
        console.log(61,outputText)
        const response =outputText
        function Message() {
            const newMsg=document.createElement('div')
            newMsg.classList.add('message', 'new');
            // 插入圖片回應
            if (data.type==='image'){
              console.log(50,data.image)
              const img_display=document.createElement("img")
              img_display.src=data.image;
              newMsg.innerHTML='<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png"/></figure>';
              newMsg.appendChild(img_display);
              container.appendChild(newMsg).classList.add('new');
              setTimeout(function() {
                scrollToBottom();
              },500);
              return 
          }

          setTimeout(function() {
            newMsg.innerHTML = '<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" /></figure>' + response;
            container.appendChild(newMsg).classList.add('new');
            scrollToBottom();
          });
        }
        
      setTimeout(function() {
        Message();
      },500); 
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

// 新增內容後自動往下捲
function scrollToBottom() {
  console.log(75)
  content.scrollTop = content.scrollHeight;
}
