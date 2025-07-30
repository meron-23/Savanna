const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const prospectRoutes = require('./routes/prospects');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/prospects', prospectRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
