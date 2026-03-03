# Skill: API Testing Patterns

## When to load

When writing API integration tests or implementing contract testing.

## API Test Structure

```typescript
describe('POST /api/orders', () => {
  it('creates order for authenticated user', async () => {
    const { body, status } = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ items: [{ product_id: 'prod_123', quantity: 2 }] });

    expect(status).toBe(201);
    expect(body).toMatchObject({ id: expect.stringMatching(/^ord_/), status: 'pending' });
  });

  it('returns 401 without authentication', async () => {
    const { status } = await request(app).post('/api/orders').send({});
    expect(status).toBe(401);
  });
});
```

## Contract Testing (Pact)

```typescript
await orderProvider
  .given('order ord_123 exists')
  .uponReceiving('a request for order ord_123')
  .withRequest({ method: 'GET', path: '/api/orders/ord_123' })
  .willRespondWith({ status: 200, body: like({ id: 'ord_123', status: string('pending') }) })
  .executeTest(async (mockServer) => {
    const order = await apiClient.getOrder('ord_123', mockServer.url);
    expect(order.id).toBe('ord_123');
  });
```
