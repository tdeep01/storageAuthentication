const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/Auth.routes/index.js');
const uploadRoutes = require('./routes/Storage.routes/index.js');
require('./config/mongoose');

const app = express();

app.use(bodyParser.json());

//login and registration apis
app.use('/api/auth', authRoutes);

//upload and download apis
app.use('/api', uploadRoutes);


app.use((req, res, next) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', error: err });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    process.exit(1);
});


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});