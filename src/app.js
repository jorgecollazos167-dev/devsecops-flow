const express = require('express');
const helmet = require('helmet');
const client = require('prom-client');
const app = express();
app.use(helmet());
app.use(express.json());
const environment = process.env.APP_ENV || 'development';
const version = process.env.APP_VERSION || '1.0.0';
client.collectDefaultMetrics();
const requests = new client.Counter({
  name: 'devsecops_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status', 'environment'],
});
app.use((req, res, next) => {
  res.on('finish', () =>
    requests.inc({
      method: req.method,
      route: req.path,
      status: String(res.statusCode),
      environment,
    }),
  );
  next();
});
app.get('/', (req, res) =>
  res.send(`<h1>DevSecOps Demo</h1><p>Environment: ${environment}</p><p>Version: ${version}</p>`),
);
app.get('/health', (req, res) => res.json({ status: 'UP', environment, version }));
app.get('/api/users', (req, res) =>
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]),
);
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () =>
    console.log(`Application ${environment} running on port ${port}`),
  );
  app.get('/api/info', (req, res) => {
    res.status(200).json({
      name: 'DevSecOps Demo',
      version: version,
      environment: environment,
    });
  });
}
module.exports = app;
