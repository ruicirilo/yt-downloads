const express = require('express');
const youtubedl = require('youtube-dl-exec');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', (req, res) => {
  const url = req.body.url;
  const format = req.body.format;

  if (format.toLowerCase() === 'mp3' || format.toLowerCase() === 'mp4') {
    const options = {
        format: 'best',
        o: `./%(title)s.${format.toLowerCase()}`,
      };
      
      

    if (format.toLowerCase() === 'mp3') {
      options['extract-audio'] = true;
    }

    youtubedl(url, options)
      .then(output => {
        console.log(`Download completo em formato ${format.toUpperCase()}.`);
        res.send(`Download completo em formato ${format.toUpperCase()}.`);
      })
      .catch(err => {
        console.error('Erro ao baixar o vídeo:', err);
        res.status(500).send('Erro ao baixar o vídeo.');
      });
  } else {
    res.status(400).send('Formato inválido. Use "MP3" ou "MP4".');
  }
});

app.listen(port, () => {
  console.log(`Servidor web rodando em http://localhost:${port}`);
});
