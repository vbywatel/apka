const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Zwiększ limit rozmiaru plików (ważne dla filmów)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  console.log(`Otrzymano plik: ${req.file.originalname} (${req.file.size} bajtów)`);

  res.json({
    success: true,
    filename: req.file.originalname,
    size: req.file.size,
    message: 'Plik zapisany pomyślnie'
  });
});

app.get('/', (req, res) => {
  res.send('Serwer upload działa! Gotowy na pliki z aplikacji.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});