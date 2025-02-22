const express = require('express');
const path = require('path');
const app = express();
const { join } = require('path');

// Get the project name from your package.json or set it manually
const projectName = require('./package.json').name || 'your-project-name';

// Serve static files from the browser folder
app.use(express.static(join(process.cwd(), 'dist', projectName, 'browser')));

// All other routes should return the index.html file
app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', projectName, 'browser', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
