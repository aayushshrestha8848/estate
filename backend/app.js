const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/properties', propertyRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
