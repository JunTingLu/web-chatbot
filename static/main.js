 /* import module from tts */
import * as tts from './tts.js';
async function main () {
    try {
      const buttonStart = document.querySelector('#start')
      const buttonPause = document.querySelector('#pause')
      const buttonStop = document.querySelector('#stop')
      // 啟用設備
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: false,
        audio: true,
      })
      const [track] = stream.getAudioTracks()
      // getSetting獲取當前音軌的訊息(採樣率,聲道數..)
      const settings = track.getSettings() 

      // audioWorklet加載js物件
      const audioContext = new AudioContext() 
      try{
        await audioContext.audioWorklet.addModule('../static/audio-recorder.js')
      }catch(error){
          console.log(error)
      }

      const mediaStreamSource = audioContext.createMediaStreamSource(stream)  // 允許MediaStreamAudioSourceNode使用音訊輸入
      const audioRecorder = new AudioWorkletNode(audioContext, 'audio-recorder')  // AudioWorkletNode 物件用來將音訊數據傳遞到自定義的音訊處理代碼
      const buffers = []
      
      //audio-recorder 會透過postMessage 將當下錄製數據傳遞回來，並存於buffer中
      audioRecorder.port.addEventListener('message', event => { 
        buffers.push(event.data.buffer) // 音訊存至buffers
      })
      
      // 啟動錄音，開始接收音訊數據
      audioRecorder.port.start() 
      mediaStreamSource.connect(audioRecorder) 
      audioRecorder.connect(audioContext.destination)

      // start click
      buttonStart.addEventListener('click', event => {
        // setAttribute 設置disabled確保禁用start按鈕
        // removeAttribute 刪除了 disabled 屬性，啟用stop按鈕
        buttonStart.setAttribute('disabled', 'disabled')
        buttonPause.removeAttribute('disabled')
        const parameter = audioRecorder.parameters.get('Recording')
        // 設置音訊初始值為1
        parameter.setValueAtTime(1, audioContext.currentTime) 
        // 清空先前保存之音訊數據，以便儲存新數據
        buffers.splice(0, buffers.length) // splice 將整列buffer陣列刪除
        console.log(buffers)
      })
      
      /* 語音聊天模式 */
      // stop click (或改用長按start鍵來控制錄音時間長短，並在鬆開事件發出請求)
      buttonPause.addEventListener('click', event => {
        buttonPause.setAttribute('disabled', 'disabled')
        buttonStart.removeAttribute('disabled')
  
        const parameter = audioRecorder.parameters.get('Recording')
        parameter.setValueAtTime(0, audioContext.currentTime) 
        // encodeAudio將數據進行二進位編碼
        const blob = encodeAudio(buffers, settings) 
        const data=new FormData()
        const container=document.querySelector('#chat_content')
        const lang=document.querySelector('#langs')
        // send the stream
        data.append('file',blob)
        // send the info of lang we choosed
        data.append('lang',lang.value)

        // user response
        const newmsg=document.createElement('div');
        newmsg.classList.add('message', 'personal-response-volume', 'new');
        newmsg.innerHTML = '<i class="fa fa-volume-up" style="color:white"></i>';
        container.appendChild(newmsg)
        scrollToBottom();
        // fetch post
        fetch('http://127.0.0.1:5000/stream_message',{
          method:'POST',
          body:data
          })
          .then(response=>response.json())  // 接收後端回傳json字串
          .then(({data})=>{ 
              const msg=data.result;     
              const textmsg=tts.setTextMessage(msg);
              tts.speakText(textmsg); // 語音輸出
              
              if (data.result===''){
                return false
              }
            
            setTimeout(function() {
                const newMsg=document.createElement('div')
                newMsg.classList.add('message', 'new');
                // 欲生成圖片，則顯示在回應框內
                if (data.type==='image'){
                  const img_stream=document.createElement('img')
                  img_stream.src=data.image;
                  newMsg.innerHTML='<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png"/></figure>';
                  newMsg.appendChild(img_stream);
                  container.appendChild(newMsg).classList.add('new');
                  setTimeout(function() {
                    scrollToBottom();
                  },500); //500 ms後顯示圖片
                  return 
                }
                
              // 插入回應的音訊資訊
              setTimeout(function() {
                const newVoice=document.createElement('div')
                // GPT response
                newVoice.innerHTML = '<i class="fa fa-volume-up" style="color:white"></i>';
                newMsg.innerHTML='<figure class="avatar"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" /></figure>';
                newMsg.appendChild(newVoice);
                container.appendChild(newMsg).classList.add('div');
                scrollToBottom();
                }, 0); //0 ms後顯示
            }, 0); //0 ms後顯示

            // 新增內容後自動往下捲
            function scrollToBottom() {
              content.scrollTop = content.scrollHeight;
            }
        })
      }) //end of button pause
      buttonStop.addEventListener('click', event => {
          tts.stop()
      })
     }catch (error){
        console.log(error);
      } 
    }

  main()