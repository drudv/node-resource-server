const express = require('express');
const moment = require('moment');
const uuidV4 = require('node-uuid');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  uuid: String,
  message: String,
  created: String
});
const Message = mongoose.model('message', MessageSchema);

if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL environment variable is not set');
}

mongoose.connect(process.env.MONGO_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.get('/give-me-five', (req, res) => {
  Message.find({}, null, {
    sort: { created: -1 },
    limit: 5
  })
    .then(messages => {
      res.json(
        messages.map(({ uuid, message, created }) => ({
          uuid,
          message,
          created
        }))
      );
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Unable to retrieve messages' });
    });
});

app.post('/save-me', (req, res) => {
  const { message, uuid } = req.body;
  if (typeof message !== 'string' || (uuid && typeof uuid !== 'string')) {
    res.status(400).json({ error: 'Wrong Format' });
    return;
  }
  Message.create({
    uuid: uuid || uuidV4(),
    message,
    created: moment().toISOString()
  })
    .then(({ uuid }) => {
      res.json({ uuid });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Unable to save the message' });
    });
});

app.listen(port);
