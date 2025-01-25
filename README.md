 ![image](https://github.com/JunTingLu/web-chatbot/assets/135250298/011ab1a7-6739-4474-90db-cd6cb7b3093d)
# Web-chatbot
With the rising popularity of AI, particularly voice-enabled chatbots like Siri, I have been inspired to develop a web-based chatbot that incorporates both voice and text interactions. 
Additionally, I aim to integrate the powerful OpenAI API (GPT3 .5), which has been gaining significant attention recently.

<h1> 前置作業 </h1>

![image](https://github.com/JunTingLu/web-chatbot/assets/135250298/3b68cd7f-d21e-4cf1-83bc-f327252720d7)

- First, you need to register for your own API key
- Paste your own API key in the config.ini file

<h1> 檔案說明 </h1>

> - **static** : Include javascript,html,css files
> - **output** : Audio data storage for the current recording 
> - **backend** : Python file for creating a router using Flask as the backend
   
<h1> 程式語言和套件 </h1>

> - python 3.8
> - flask
> - html, css, scss, javascript
> - Web Audio API
> - SpeechSynthesisUtterance API

<h1>Description</h1>

<table>
  <tr>
    <td> Javascript API</td><td>status</td>
  </tr>
    <tr>
    <td>Start button</td><td>Start recording at least for 5 secs </td>
  </tr>
  <tr>
    <td>Pause button</td><td>Stop recording </td>
  </tr>
</table> 

<h1> Get start </h1>

 **Docker build image**<br>
```
docker build -t web-chatbot .
```

**Docker run image**
```
docker run --rm --name web-chatbot -p 80:80 -p 5000:5000 web-chatbot 
```
![Aaron's GitHub stats](https://github-readme-stats.vercel.app/api?username=JunTingLu&show_icons=true&theme=radical)

