const express = require('express');
const app = express();

app.get('/api', (req, res) => res.json({ message: 'Backend OK ✅' }));

app.listen(3000, () => console.log('Backend on 3000'));