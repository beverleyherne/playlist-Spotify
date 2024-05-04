const express = require('express')
const cors = require('cors');
const app =  express()
require('dotenv').config();
app.use(cors());

const {logger, authenticateToken, errorHandler} = require("./src//middleware/middleware")
const authRoutes = require("./src/routes/auth")
const spotifyRoutes = require('./src/routes/spotifyRoutes');
const playListRoute = require('./src/routes/playlistRoutes');


const PORT = 3000
app.use(express.json())
app.use(logger)
app.use('/spotify', spotifyRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);
app.use(authenticateToken);
app.use('/playlist', playListRoute);





app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});