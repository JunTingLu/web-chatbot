/*從openAI得到的回應返回前端 */
const inputtext=document.querySelector('#input-text')
const usertext=document.querySelector('#user-input')
const send=document.querySelector('#send-btn')
const img_display=document.querySelector('#img_display')
const buttonStop = document.querySelector('#pause')
const buttonStart = document.querySelector('#start')

/* 訊息聊天模式 */
send.addEventListener('click',function() {
    // 將文字輸入至text area 並得到GPT回應
    // trim用來移除部必要的空白
    const message=usertext.value.trim();
    // clear after sending message
    inputtext.value+=message;
    usertext.value='';
    // 判斷是否有輸入
    if (message==='')return;
    fetch('http://127.0.0.1:5000/text_message',{
        method:'POST',
        body:JSON.stringify({prompt: message+'。'}),//設定訊息為肯定句
        headers:{
            'Content-Type':'application/json'
        }  
    })
    .then(response=>response.json()) // 將回傳文字轉成json格式
    //解構 data
    .then(({data})=>{ 
        // 判斷回傳是否為圖片url
        if (data.type==='image'){
            img_display.src=data.image;
            return 
        }
        // 在text area回傳文字
        const outputText=data.result;
        inputtext.value+='\n'+outputText+'\n'; 
    
    })
    .catch(error=>console.error(error))
    
})
