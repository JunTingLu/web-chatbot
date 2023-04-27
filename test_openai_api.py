import openai
import os 
import pyaudio
import whisper
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
from google.cloud.texttospeech_v1.types import SynthesizeSpeechRequest
import google.cloud.texttospeech as tts
from flask_cors import CORS
from scipy.io import wavfile
import binascii
import time

#%%
app=Flask(__name__)
CORS(app)

# 設定檔讀取(*.ini)
config=ConfigParser()
path=config.read("C:/Users/User/Desktop/python_jupyter/for_job/javascript-audio-recorder/config.ini",encoding="utf-8")
API_key=config.get('OpenAI','openai_API')  
openai.api_key = API_key

#%%
# test google
# def google_T2S(input_text ):
#     # 設定文字輸入和音訊設定
#     request=SynthesizeSpeechRequest(
#     # input = tts.SynthesisInput(text=input_text),
#     voice=tts.VoiceSelectionParams(
#         language_code="zh-TW",
#         name="zh-TW-Wavenet-A",
#         ssml_gender=tts.SsmlVoiceGender.NEUTRAL,
#     ),
#     audio_config = tts.AudioConfig(
#     audio_encoding=tts.AudioEncoding.LINEAR16,
#     speaking_rate=1.0,
#     ))
#     # 合成語音
#     # voice_response=client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
#     voice_response = client.synthesize_speech(request=request)
#     # 轉存為二進位物件
#     output_voice=io.BytesIO(voice_response)
#     return send_file(io.BytesIO(output_voice), mimetype='audio/wav', as_attachment=True, attachment_filename='synthesized.wav')


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
    openai.api_key=API_key
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
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
    print(122,byites_io)
    byites_content=byites_io.getvalue()
    # bytes 物件沒有 name 屬性，而 openai.Audio.transcribe 方法需要一個有 name 屬性的物件
    # 將blob轉為wav檔案
    wav_data = byites_content[12:]
    print(137,wav_data)
    # # 將音頻數據寫入wav檔案
    return 'hello'  
    with wave.open('output.wav', 'wb') as wav_file:
        print('a')
        wav_file.setparams((1, 2, 44100, 0, 'NONE', 'not compressed'))
        wav_file.writeframes(wav_data)
    # transcript from whisper api (S2T)
    with open("output.wav", "rb") as audio_file:
        transcript=Whisper_API(audio_file,API_key)
    return transcript


# transcribe the stream blob to wav
# def transcribe(wav_input,API_key):
#     transcript=Whisper_API(wav_input,API_key)
#     print(140,transcript)
#     return  transcript

#%%
""" 語音聊天模式 """
@app.route('/stream_message',methods=['GET','POST'])
def stream_GPT():
    keyword=['圖片','畫']
    result=None
    output_result=None

    if request.method=='POST':
        # 取得前端blob
        audio_blob=request.get_data()
        stream_result=blob_to_wav(audio_blob,API_key)
        print(143,stream_result)
        # get the text response 
        # stream_result="how's the weather today"
        # GPT3.5 API 
        # 提示以中文對話回復
        # messages=[{"role": "system", "content":'這是一個繁體中文的對話。'},
        #           {"role": "user", "content": Response}]
        # stream_result=chat_completion(messages)
        # print(169, stream_result)
        # # DALEE API
        # # 從keywords判定是否生成圖片
        # if any (word in output_result for word in keyword):
        #     img_generated_link=img_generator(output_result,API_key)
        #     print(img_generated_link)
            # return jsonify({'data':{'image':img_generated_link,'type':'image'}}) # add type to show in html
    return jsonify({'data':{'stream_result':stream_result,'type':'text'}}) 

#%%
""" 文字聊天模式 """
@app.route('/text_message',methods=['GET','POST'])
def text_GPT():
    keyword=['圖片','畫']
    output_result=None
    img_generated_link=None
    if request.method=='POST':
         # 取得前端數據
        input=request.get_json()
        print(188,input['prompt'])

        # DALEE API
        # 從keywords判定是否生成圖片
        if any(word in input['prompt'] for word in keyword):
            prompt=input['prompt']
            img_generated_link=img_generator(prompt,API_key)
            print(img_generated_link)
            return jsonify({'data':{'image':img_generated_link,'type':'image'}}) # add type to show in html

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