const app = require('./app');
const { PORT } = require('./src/config/env');
require('./src/config/db'); // MySQL connection

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});