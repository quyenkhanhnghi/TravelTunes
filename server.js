const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message);
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
