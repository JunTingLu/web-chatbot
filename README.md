# Web-chatbot
 
With the rising popularity of AI, particularly voice-enabled chatbots like Siri, I have been inspired to develop a web-based chatbot that incorporates both voice and text interactions. 
Additionally, I aim to integrate the powerful OpenAI API, which has been gaining significant attention recently.


## Development

Build docker image.

```
docker build -t web-chatbot .
```

Run docker image.

```
docker run --rm --name web-chatbot -p 80:80 -p 5000:5000 web-chatbot 
```
