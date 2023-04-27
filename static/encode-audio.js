/* 將音訊轉為可播放的wav檔案格式 */
function encodeAudio (buffers, settings) {
    const sampleCount = buffers.reduce((memo, buffer) => {
      return memo + buffer.length
    }, 0)
  
    const bytesPerSample = settings.sampleSize / 8
    const bitsPerByte = 8
    const dataLength = sampleCount * bytesPerSample
    const sampleRate = settings.sampleRate
    // arraybuffer 保存wav檔案的二進位數據
    const arrayBuffer = new ArrayBuffer(44 + dataLength)
    // 使用 DataView 對象將 WAVE 頭部的二進位數據寫入 ArrayBuffer 中
    const dataView = new DataView(arrayBuffer)
  
    dataView.setUint8(0, 'R'.charCodeAt(0)) // <10>
    dataView.setUint8(1, 'I'.charCodeAt(0))
    dataView.setUint8(2, 'F'.charCodeAt(0))
    dataView.setUint8(3, 'F'.charCodeAt(0))
    dataView.setUint32(4, 36 + dataLength, true)
    dataView.setUint8(8, 'W'.charCodeAt(0))
    dataView.setUint8(9, 'A'.charCodeAt(0))
    dataView.setUint8(10, 'V'.charCodeAt(0))
    dataView.setUint8(11, 'E'.charCodeAt(0))
    dataView.setUint8(12, 'f'.charCodeAt(0))
    dataView.setUint8(13, 'm'.charCodeAt(0))
    dataView.setUint8(14, 't'.charCodeAt(0))
    dataView.setUint8(15, ' '.charCodeAt(0))
    dataView.setUint32(16, 16, true)
    dataView.setUint16(20, 1, true)
    dataView.setUint16(22, 1, true)
    dataView.setUint32(24, sampleRate, true)
    dataView.setUint32(28, sampleRate * 2, true)
    dataView.setUint16(32, bytesPerSample, true)
    dataView.setUint16(34, bitsPerByte * bytesPerSample, true)
    dataView.setUint8(36, 'd'.charCodeAt(0))
    dataView.setUint8(37, 'a'.charCodeAt(0))
    dataView.setUint8(38, 't'.charCodeAt(0))
    dataView.setUint8(39, 'a'.charCodeAt(0))
    dataView.setUint32(40, dataLength, true)
    // 設立初始值，因前面 44 個 byte 是 Wave 檔案格式的檔頭
    let index = 44

    // 將音訊數據寫入 ArrayBuffer 中
    for (const buffer of buffers) {
      for (const value of buffer) {
        // 儲存的是 16 位有符號整數，範圍為 -32768 到 32767，處理過的音訊數據範圍在 -1 到 1 之間，因此需要先乘上 0x7fff 進行轉換
        dataView.setInt16(index, value * 0x7fff, true)
        // 因每個樣本的數據占據兩個字節（即16位整數）
        index += 2
      }
    }
  //  封裝成blob物件
    return new Blob([dataView], {type:'audio/wav'})
  }