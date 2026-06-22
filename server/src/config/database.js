const mysql = require('mysql2/promise');

const poolOptions = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Parse a mysql:// connection string (Railway/PlanetScale provide DATABASE_URL)
// into a config object so pool options are preserved.
function fromDatabaseUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '')
  };
}

// Support both DATABASE_URL (Railway/PlanetScale) and individual params
const dbConfig = process.env.DATABASE_URL
  ? { ...fromDatabaseUrl(process.env.DATABASE_URL), ...poolOptions }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ...poolOptions
    };

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

module.exports = pool;
