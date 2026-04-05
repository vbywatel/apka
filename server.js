const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Udostępniamy folder uploads, żeby można było oglądać pliki w przeglądarce
app.use('/uploads', express.static('uploads'));

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1024 * 1024 * 1024 } // 1 GB
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Brak pliku' });
  }

  const fileUrl = `https://apka-h7ve.onrender.com/uploads/${req.file.filename}`;

  console.log(`✅ Odebrano plik: ${req.file.originalname} | ${ (req.file.size / (1024*1024)).toFixed(2) } MB`);

  res.json({
    success: true,
    message: 'Plik zapisany pomyślnie',
    filename: req.file.originalname,
    url: fileUrl
  });
});

// Strona z listą plików
app.get('/files', (req, res) => {
  const fs = require('fs');
  const uploadDir = path.join(__dirname, 'uploads');

  if (!fs.existsSync(uploadDir)) {
    return res.send('<h2>Folder uploads jest pusty</h2>');
  }

  const files = fs.readdirSync(uploadDir);
  let html = `<h1>Pliki na serwerze (${files.length})</h1><hr>`;

  files.forEach(file => {
    const ext = file.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    const isVideo = ['mp4', 'mov', 'avi'].includes(ext);

    const fileUrl = `/uploads/${file}`;

    html += `<p><strong>${file}</strong><br>`;
    if (isImage) html += `<img src="${fileUrl}" width="300"><br>`;
    else if (isVideo) html += `<video src="${fileUrl}" width="300" controls></video><br>`;
    else html += `<a href="${fileUrl}" target="_blank">Otwórz plik</a><br>`;
    html += `</p><hr>`;
  });

  res.send(html);
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Serwer upload działa!</h1>
    <p><a href="/files">Zobacz wszystkie wysłane pliki</a></p>
    <p>Endpoint do uploadu: <strong>/upload</strong> (tylko POST)</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
