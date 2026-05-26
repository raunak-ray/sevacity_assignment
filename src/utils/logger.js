const getTimestamp = () => {
  return new Date().toISOString();
};

class Logger {
  info(message) {
    console.log(`[INFO] ${getTimestamp()} - ${message}`);
  }

  success(message) {
    console.log(`[SUCCESS] ${getTimestamp()} - ${message}`);
  }

  warn(message) {
    console.warn(`[WARN] ${getTimestamp()} - ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${getTimestamp()} - ${message}`);
  }

  api(req, statusCode, message) {
    console.log(
      `[API] ${getTimestamp()} - ${req.method} ${req.originalUrl} - ${statusCode} - ${message}`,
    );
  }
}

export default new Logger();
