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
import bark 


#%%
app=Flask(__name__)
CORS(app)

# openai api setup(*.ini)
config=ConfigParser()
path=config.read("./config.ini",encoding="utf-8")
API_key=config.get('OpenAI','openai_API')  
openai.api_key = API_key

# Bark api setup
# def bark_api(prompt):
#     bark_api_key=config.get('bark-api','bark_key') 
#     # set bark env
#     os.environ["REPLICATE_API_TOKEN"]=bark_api_key
#     # download and load all models
#     output = replicate.run(
#     "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
#         input={"prompt": prompt},
#     )
#     # output format is {audio, [url]}
#     print(42,output)
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
    print(71,transcript)
    return transcript['text']

# examine the lang


# DALEE  API
def img_generator(input_text,API_key):
    text_hint=['生成','產生']
    if any (word in input_text for word in text_hint):
         for word in text_hint:
            if word in input_text:
                print(86)
                PROMPT = input_text.split(word)[1]
    else:
        PROMPT = input_text  
    openai.api_key = API_key
    response = openai.Image.create(
    prompt=PROMPT,
    n=1,
    size="256x256",
    )
    print(response["data"][0]["url"])
    return response["data"][0]['url']


# 創建wav檔案 
def blob_to_wav(blob,language):
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
    audio_segment.export("./output/output.wav", format="wav")
    # transcript from whisper api (S2T)
    with open("./output/output.wav", "rb") as audio_file:
        print(115,language)
        transcript=Whisper_API(audio_file,language)
        print(116,transcript)
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
        file=request.files['file']
        file_data = file.read()
        lang=request.form['lang']
        print(141,request.files['file'])
        print(139,request.form['lang'])

        # print(141,lang_info)
        audio_response=blob_to_wav(file_data, lang)
        print(audio_response)
        # # DALEE API
        # # 從keywords判定是否生成圖片
        if any (word in  audio_response for word in keyword):
            image_link=img_generator(audio_response,API_key)
            return jsonify({'data':{'image':image_link,'type':'image'}}) # add type to show in html
        
        # get the text response 
        # GPT3.5 API提示以中文對話回復
        messages=[{"role": "system", "content":""},
                  {"role": "user", "content": audio_response}]
        result=chat_completion(messages)
        print(155,result)
        # output=bark_api(result)
       
        
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