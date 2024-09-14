import express from 'express';
import { exec } from 'child_process'; // Importa exec para executar comandos
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', (req, res) => {
  const url = req.body.url;
  const format = req.body.format.toLowerCase();

  const validUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  // Validar URL
  if (!validUrlRegex.test(url)) {
    return res.status(400).send('URL inválido. Por favor, forneça um link do YouTube.');
  }

  // Verificar formato
  if (['mp3', 'mp4'].includes(format)) {
    const command = format === 'mp3'
      ? `yt-dlp -f bestaudio/best --extract-audio --audio-format mp3 "${url}"`
      : `yt-dlp -f bestvideo+bestaudio/best "${url}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o comando: ${error.message}`);
        return res.status(500).send('Erro ao baixar o vídeo: ' + error.message);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Erro ao baixar o vídeo: ' + stderr);
      }
      console.log(`stdout: ${stdout}`);
      res.send('Download completo!');
    });
  } else {
    res.status(400).send('Formato inválido. Use "MP3" ou "MP4".');
  }
});

app.listen(port, () => {
  console.log(`Servidor web rodando em http://localhost:${port}`);
});
