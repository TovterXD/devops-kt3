const handler = require('./app');
function request(url) {
  const res = { writeHead: jest.fn(), end: jest.fn() };
  handler({ method: 'GET', url }, res);
  return res;
}
test('GET / returns KT3 App', () => {
  const res = request('/');
  expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
  expect(res.end).toHaveBeenCalledWith('BROKEN');
});
test('GET /health returns ok', () => {
  const res = request('/health');
  expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
  expect(JSON.parse(res.end.mock.calls[0][0])).toEqual({ status: 'ok' });
});
if (process.env.PGHOST) {
  test('PostgreSQL connection', async () => {
    const { Client } = require('pg');
    const client = new Client();
    await client.connect();
    try {
      const result = await client.query('SELECT 1 AS value');
      expect(result.rows[0].value).toBe(1);
    } finally { await client.end(); }
  });
}
