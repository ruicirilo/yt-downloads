import express from 'express';
import youtubeDlExec from 'youtube-dl-exec';
import path from 'path';
import { fileURLToPath } from 'url';

// Simule __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const format = req.body.format;

  const validUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  if (!validUrlRegex.test(url)) {
    return res.status(400).send('URL inválido. Por favor, forneça um link do YouTube.');
  }

  if (['mp3', 'mp4'].includes(format.toLowerCase())) {
    const options = {
      format: format.toLowerCase() === 'mp3' ? 'bestaudio/best' : 'bestvideo+bestaudio/best',
      o: `./downloads/%(title)s.${format.toLowerCase()}`,
    };

    // Adiciona extração de áudio se o formato for MP3
    if (format.toLowerCase() === 'mp3') {
      options['extract-audio'] = true;
      options['audio-format'] = 'mp3';
    }

    try {
      await youtubeDlExec(url, options);
      console.log(`Download completo em formato ${format.toUpperCase()}.`);
      res.send(`Download completo em formato ${format.toUpperCase()}.`);
    } catch (err) {
      console.error('Erro ao baixar o vídeo:', err);
      res.status(500).send('Erro ao baixar o vídeo.');
    }
  } else {
    res.status(400).send('Formato inválido. Use "MP3" ou "MP4".');
  }
});

app.listen(port, () => {
  console.log(`Servidor web rodando em http://localhost:${port}`);
});
