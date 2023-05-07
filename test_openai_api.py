import openai
import os 
import pyaudio
from configparser import ConfigParser
import os
from flask import Flask, request, redirect, url_for, render_template,send_from_directory,jsonify, send_file
import base64 
from werkzeug.utils import secure_filename
import numpy as np
import cv2
from PIL import Image
import io
from cv2 import imwrite
import json
import wave
from flask_cors import CORS
import time
from pydub import AudioSegment
import requests
# for Bark api
import replicate
#%%
app=Flask(__name__)
CORS(app)

# openai api setup(*.ini)
config=ConfigParser()
path=config.read("C:/Users/User/Desktop/python_jupyter/for_job/javascript-audio-recorder/config.ini",encoding="utf-8")
API_key=config.get('OpenAI','openai_API')  
openai.api_key = API_key

# Bark api setup
cfg=ConfigParser()
path=cfg.read("config.ini",encoding="utf-8")
bark_api_key=cfg.get('bark-api','bark_key') 
# download and load all models
# set bark env
os.environ["REPLICATE_API_TOKEN"]=bark_api_key
# download and load all models
# preload_models() 
output = replicate.run(
   "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
    input={"prompt": "Hello, my name is Suno. And, uh \u2014 and I like pizza. [laughs] But I also have other interests such as playing tic tac toe."}
)
# output format is {audio, [url]}
print(42,output)

#%%

# 錄製音檔
# chunk = 1024                     # 記錄聲音的樣本區塊大小
# sample_format = pyaudio.paInt16  # 樣本格式，可使用 paFloat32、paInt32、paInt24、paInt16、paInt8、paUInt8、paCustomFormat
# channels = 1                     # 聲道數量
# fs = 44100                       # 取樣頻率，常見值為 44100 ( CD )、48000 ( DVD )、22050、24000、12000 和 11025。
# seconds = 10                      # 錄音秒數
# filename = "C:/Users/User/Desktop/test.wav"            # 錄音檔名
# p = pyaudio.PyAudio()            # 建立 pyaudio 物件

# def record(chunk,sample_format,fs,seconds,filename,p):
#     print("start...")
#     # 開啟錄音串流
#     stream = p.open(format=sample_format, channels=channels, rate=fs, frames_per_buffer=chunk, input=True)
#     frames = []                      # 建立聲音串列
#     for i in range(0, int(fs / chunk * seconds)):
#         data = stream.read(chunk)
#         frames.append(data)          # 將聲音記錄到串列中

#     stream.stop_stream()             # 停止錄音
#     stream.close()                   # 關閉串流
#     p.terminate()
#     print('end...')
#     wf = wave.open(filename, 'wb')   # 儲存聲音記錄檔
#     wf.setnchannels(channels)        # 設定聲道
#     wf.setsampwidth(p.get_sample_size(sample_format))  # 設定格式
#     wf.setframerate(fs)              # 設定取樣頻率
#     wf.writeframes(b''.join(frames)) # 存檔
#     wf.close()


#%%
# chatGPT3.5  API
def chat_completion(messages):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=1024,
        n=1,
        temperature=0.5,
        # 身分驗證
        headers={"Authorization": f"Bearer {openai.api_key }"}
    )
    # 返回一個回應，strip()確保生成文本不包含额外的空白或换行符等字符
    message = response.choices[0].message.content.strip()
    return message


# Whisper API
def Whisper_API(audio_file,API_key):
    vad_threshold=0.5
    # openai.api_key=API_key
    headers={
        "Authorization": "Bearer {}".format(API_key),
    }
    params={
        "vad_threshold": vad_threshold  # 調整語音活動檢測閾值
    }
    transcript = openai.Audio.transcribe(model="whisper-1",header=headers,file=audio_file,params=params)
    return transcript['text']


# DALEE  API
def img_generator(input_text,API_key):
    PROMPT = input_text
    openai.api_key = API_key
    response = openai.Image.create(
    prompt=PROMPT,
    n=1,
    size="256x256",
    # response_format='b64_json'
    )
    print(response["data"][0]["url"])
    return response["data"][0]['url']


# 創建wav檔案 
def blob_to_wav(blob,API_key):
    byites_io=io.BytesIO(blob)
    byites_content=byites_io.getvalue()
    # bytes 物件沒有 name 屬性，而 openai.Audio.transcribe 方法需要一個有 name 屬性的物件
    # 將blob轉為wav檔案
    riff='RIFF'
    # 轉換成utf8編碼，查詢riff字串位置
    riff=riff.encode('utf-8')
    print(117,riff)
    riff_start = byites_content.find(riff)
    riff_data = byites_content[riff_start:]
    # 將二進位格式轉換成 AudioSegment 物件
    audio_segment=write_wav(riff_data)
    # # 將 AudioSegment 物件轉換成 wav 格式的音訊檔案
    audio_segment.export("C:/Users/User/Desktop/output.wav", format="wav")
    # transcript from whisper api (S2T)
    with open("C:/Users/User/Desktop/output.wav", "rb") as audio_file:
        transcript=Whisper_API(audio_file,API_key)
    return transcript

# write in wav file
def write_wav(wav_content):
    audio_segment = AudioSegment(
    data= wav_content,
    sample_width=2,
    frame_rate=44100,
    channels=1
    )
    return audio_segment

#%%
""" 語音聊天模式 """
@app.route('/stream_message',methods=['GET','POST'])
def stream_GPT():
    keyword=['圖片','畫']
    result=None
    image_link=None
    if request.method=='POST':
        # 取得前端blob
        audio_blob=request.get_data()
        audio_response=blob_to_wav(audio_blob,API_key)
        print(audio_response)
         # # DALEE API
        # # 從keywords判定是否生成圖片
        if any (word in  audio_response for word in keyword):
            image_link=img_generator(audio_response,API_key)
            return jsonify({'data':{'image':image_link,'type':'image'}}) # add type to show in html
        
        # get the text response 
        # stream_result="how's the weather today"
        # GPT3.5 API 
        # 提示以中文對話回復
        messages=[{"role": "system", "content":'這是一個繁體中文的對話。'},
                  {"role": "user", "content": audio_response}]
        result=chat_completion(messages)
    return jsonify({'data':{'result':result,'type':'text'}}) 

#%%
""" 文字聊天模式 """
@app.route('/text_message',methods=['GET','POST'])
def text_GPT():
    keyword=['圖片','畫']
    output_result=None
    image_link=None
    if request.method=='POST':
         # 取得前端數據
        input=request.get_json()
        print(188,input['prompt'])

        # DALEE API
        # 從keywords判定是否生成圖片
        if any(word in input['prompt'] for word in keyword):
            prompt=input['prompt']
            image_link=img_generator(prompt,API_key)
            return jsonify({'data':{'image':image_link,'type':'image'}}) # add type to show in html

        # GPT3.5 API 
        # 提示以中文對話回復
        messages=[{"role": "system", "content":'這是一個繁體中文的對話。'},
                  {"role": "user", "content": input['prompt']}]    
        output_result=chat_completion(messages)

    return jsonify({'data':{'result':output_result,'type':'text'}}) # result is a key name

#%%
if __name__=='__main__':
    # fetch flast 串接
    host_ip='127.0.0.1'
    host_port='5000'
    app.run(host=host_ip,port=host_port,debug=True) 