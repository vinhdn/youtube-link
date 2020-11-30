const app = require('express')();
const url = require('url');
var ytdl = require('youtube-dl');
app.set('views', __dirname + '/views');
app.use(require('express').static('views'));
app.get("/", (req, res) => {
  res.send("Humax FFVR service!");
});
app.get("/test", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.get("/push", (req, res) => {
  io.emit("4CD08A26DDA6", {
    intent: "saku.gva.video.control",
    msg: {
      video_action: "jump ahead",
      video_unit: "minutes",
      number: 1
    },
parameters: {
  video_action: "jump ahead",
  video_unit: "minutes",
  number: 1
}});
  res.send("Emit success!");
});

app.get("/youtube", (req, res) => {
  var paramsUrl = url.parse(req.url, true).query;
  var video = ytdl.getInfo(paramsUrl.youtubeURL,['-x', '--audio-format', 'mp3', '--skip-download', '-g', '-f', '(mp3,webm)[asr>0]'], function(err, info) {
    if(!err) res.send(info);
    else res.send(err);
  });
});

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' }});
io.on('connection', client => {
  client.on('event', data => { console.log("event " + data); });
  client.on('connect', () => { console.log("connect " + client.id) });
  client.on('disconnect', (reason) => { console.log("disconnect: " + reason + " clientID: " + client.id) });

  client.on('chat message', (msg) => {
    console.log("message:", msg + " clientID: " + client.id);
    io.emit('chat message', msg);
  });
});
server.listen(3000);