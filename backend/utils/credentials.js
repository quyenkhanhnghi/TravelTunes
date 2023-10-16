const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://travel-tunes-client-quyenkhanhnghi-quyenkhanhnghis-projects.vercel.app',
];

const credentials = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
module.exports = { credentials, corsOptions };
