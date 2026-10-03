const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to DB (non-blocking)
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScriptSentinel API] Running on http://0.0.0.0:${PORT}`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = startServer;
