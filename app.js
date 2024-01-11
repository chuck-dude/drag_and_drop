const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');
const port = 3000; // You can use any port you prefer
app.use(bodyParser.urlencoded({ extended: true }));

console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
// Example MIME type configuration for Express
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.use(fileUpload());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dragdrop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/drag_and_drop.html');
});
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.myFile; // 'myFile' corresponds to the name attribute of your file input

  // Use mongoose models to create and save documents in MongoDB
  // Example: Creating a mongoose model and saving a document
  const yourSchema = new mongoose.Schema({
    fileName: String,
    fileData: Buffer,
  });

  const YourModel = mongoose.model('dropfiles', yourSchema);
  const document = new YourModel({ fileName: uploadedFile.name, fileData: uploadedFile.data });
  document.save();

  // Respond to the client
  res.send('File uploaded and saved to MongoDB');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
