const sulla = require('sulla');
const express = require('express');
const axios = require('axios')


const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


sulla.create().then(client => start(client));


function start(client) {
    app.post('/v1/messages', function (req, res) {
      let token = req.headers['authorization'].split(" ")[1]
      if (token == process.env.TOKEN) {
        client.sendText(req.body.to + '@c.us', req.body.text);
        res.send({});
      }
      else {
        return res.status(401).send({});
      }
    });

    
    client.onMessage(message => {
      axios.post(process.env.WEB_HOOK_ENDPOINT, {
        message: message
      });
    });

  }
app.listen(3000, function () {
  console.log('Whatsapp API Running.');
});