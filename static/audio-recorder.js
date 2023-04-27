
// AudioRecorder 繼承 AudioWorkletProcessor，音訊加工、自定義，以回傳至前端
class AudioRecorder extends AudioWorkletProcessor {
  // static get 靜態方法定義參數及預設值，不須實例化
    static get parameterDescriptors () { // <1>
      return [
        {
          name: 'Recording',
          defaultValue: 0,
          minValue: 0,
          maxValue: 1,
        },
      ]
    }
    
    // define a custom AudioWorkletProcessor, which will output white noise (隨機信號)
    process (inputs, outputs, parameters) {
      const buffer = []
      const channel = 0
      // input 
      // 判斷input是否為空
      // if (inputs[0].length<1) return;
      for (let t = 0; t < inputs[0][channel].length; t += 1) {
        // audio parameters 
        // 若當前Recording=1則將音訊存入buffer)
        if (parameters.Recording[0] === 1) { // <2>
          buffer.push(inputs[0][channel][t])
        }
      }
      // 判斷buffer是否已有音訊數據
      if (buffer.length >= 1) {
        // 當前端口
        this.port.postMessage({buffer}) // <3>
      }
  
      return true
    }
  }
  
  //  register to web audio api to get input stream, and then output
  registerProcessor('audio-recorder', AudioRecorder) // <4>
