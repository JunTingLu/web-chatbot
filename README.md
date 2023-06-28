 ![image](https://github.com/JunTingLu/web-chatbot/assets/135250298/011ab1a7-6739-4474-90db-cd6cb7b3093d)
# Web-chatbot
With the rising popularity of AI, particularly voice-enabled chatbots like Siri, I have been inspired to develop a web-based chatbot that incorporates both voice and text interactions. 
Additionally, I aim to integrate the powerful OpenAI API (GPT3 .5), which has been gaining significant attention recently.

<h1> Environment setup </h1>
 
- First, you need to register for your own API key
- Paste your own API key in the .ini file

<h1> Folder explanation </h1>

-  static
   Include javascript,html,css files
-  output
   Audio data storage for the current recording 
-  backend
   Python file for creating a router using Flask as the backend
   
<h1> System environment </h1>

> python 3.8

<h1>Description</h1>

<table>
  <tr>
    <td> Javascript API</td>
    <td>status</td>
  </tr>
   <tr>
    <td>SpeechSynthesisUtterance</td>
    <td>Generate voice output using the language from the voice list</td>
  </tr>
    <tr>
    <td>Start button</td>
    <td>Start recording at least for 5 secs </td>
  </tr>
  <tr>
    <td>Pause button</td>
    <td>Stop recording </td>
  </tr>
</table> 

<h1> Deployment </h1>
I deploy using Docker and provide any port for integration

<h2> Get Started</h2>
