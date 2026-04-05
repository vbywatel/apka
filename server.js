const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Statyczne pliki (żeby można było oglądać zdjęcia/filmy)
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

  console.log(`✅ Plik zapisany: ${req.file.originalname} → ${fileUrl}`);

  res.json({
    success: true,
    message: 'Plik zapisany',
    filename: req.file.originalname,
    url: fileUrl
  });
});

// Nowa strona – lista wszystkich plików
app.get('/files', (req, res) => {
  const fs = require('fs');
  const uploadDir = path.join(__dirname, 'uploads');

  if (!fs.existsSync(uploadDir)) {
    return res.send('<h2>Folder uploads jest pusty</h2>');
  }

  const files = fs.readdirSync(uploadDir);

  let html = `<h1>Pliki na serwerze (${files.length})</h1><ul>`;
  files.forEach(file => {
    const fileUrl = `/uploads/${file}`;
    html += `<li><a href="${fileUrl}" target="_blank">${file}</a></li>`;
  });
  html += '</ul>';

  res.send(html);
});

app.get('/', (req, res) => {
  res.send('<h1>Serwer działa</h1><p><a href="/files">Zobacz wszystkie pliki</a></p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
