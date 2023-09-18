var request = require('request');



var ENDPOINT = "https://genaiapimna.jnj.com/openai-chat"
var API_KEY = "228b7c3ed183460abb331208fd2893b3"



var options = {
  'method': 'POST',
  'url': ENDPOINT,
  'headers': {
    'api-key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "messages": [
      {
        "role": "system",
        "content": "You are an AI assistant named Genie the Genious that helps people find information from enterprise documents."
      },
      {
        "role": "user",
        "content": "how many faces does a cube have?"
      },
      {
        "role": "assistant",
        "content": "A cube has six faces."
      },
      {
        "role": "user",
        "content": "What is your name?"
      },
      {
        "role": "assistant",
        "content": ""
      }
    ],
    "temperature": 0.8,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0,
    "max_tokens": 60,
    "stop": null
  })



};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});