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

#%%
app=Flask(__name__)
CORS(app)

# openai api setup(*.ini)
config=ConfigParser()
path=config.read("../config.ini",encoding="utf-8")
API_key=config.get('OpenAI','openai_API')  
openai.api_key = API_key

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
def Whisper_API(audio_file,language):
    transcript = openai.Audio.transcribe(model="whisper-1",file=audio_file, language=language  )
    return transcript['text']

# # DALEE  API
def img_generator(input_text,API_key):
    text_hint=['生成','產生']
    if any (word in input_text for word in text_hint):
         for word in text_hint:
            if word in input_text:
                PROMPT = input_text.split(word)[1]
    else:
        PROMPT = input_text  
    openai.api_key = API_key
    response = openai.Image.create(
    prompt=PROMPT,
    n=1,
    size="256x256",
    )
    return response["data"][0]['url']


# # 創建wav檔案 
def blob_to_wav(blob,language):
    byites_io=io.BytesIO(blob)
    byites_content=byites_io.getvalue()
    # bytes 物件沒有 name 屬性，而 openai.Audio.transcribe 方法需要一個有 name 屬性的物件
    riff='RIFF'
    # 轉換成utf8編碼，查詢riff字串位置
    riff=riff.encode('utf-8')
    # wav 內容標頭
    riff_start = byites_content.find(riff)
    riff_data = byites_content[riff_start:]
    # 將二進位格式轉換成 AudioSegment 物件
    audio_segment=write_wav(riff_data)
    # # 將 AudioSegment 物件轉換成 wav 格式的音訊檔案
    audio_segment.export("../output/output.wav", format="wav")
    # transcript from whisper api (S2T)
    with open("../output/output.wav", "rb") as audio_file:
        transcript=Whisper_API(audio_file,language)
    return transcript

# write stream in wav file
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
    keyword=['圖片','图片','畫','picture','generate','がぞう','かく']
    result=None
    image_link=None
    if request.method=='POST':
        # 取得前端blob
        file=request.files['file']
        file_data = file.read()
        lang=request.form['lang']
        audio_response=blob_to_wav(file_data, lang)
        # DALEE API 從keywords判定是否生成圖片
        if any (word in  audio_response for word in keyword):
            image_link=img_generator(audio_response,API_key)
            return jsonify({'data':{'image':image_link,'type':'image'}}) # add type to show in html
        # GPT3.5 API提示以中文對話回復
        messages=[{"role": "system", "content":""},
                  {"role": "user", "content": audio_response}]
        result=chat_completion(messages)
       
    return jsonify({'data':{'result':result,'type':'text'}}) 

#%%
""" 文字聊天模式 """
@app.route('/text_message',methods=['GET','POST'])
def text_GPT():
    keyword=['圖片','图片','畫','picture','generate','がぞう','かく']
    output_result=None
    image_link=None
    if request.method=='POST':
        # 取得前端數據
        input=request.get_json()
        # DALEE API 從keywords判定是否生成圖片
        if any(word in input['prompt'] for word in keyword):
            prompt=input['prompt']
            image_link=img_generator(prompt,API_key)
            return jsonify({'data':{'image':image_link,'type':'image'}}) # add type to show in html
        # GPT3.5 API 提示以中文對話回復
        messages=[{"role": "system", "content":'。'},
                  {"role": "user", "content": input['prompt']}]    
        output_result=chat_completion(messages)

    return jsonify({'data':{'result':output_result,'type':'text'}}) # result is a key name

#%%
if __name__=='__main__':
    # fetch flask 串接
    host_ip='127.0.0.1'
    host_port='5000'
    app.run(host=host_ip,port=host_port,debug=True) 