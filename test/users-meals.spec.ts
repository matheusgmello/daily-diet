import { it, beforeAll, afterAll, describe } from 'vitest'
import supertestRequest from 'supertest'
import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new account', async () => {
    await supertestRequest(app.server)
      .post('/users')
      .send({
        name: 'Usuário_test',
        email: 'email@email.com',
        address: 'Rua de teste',
        weight: 80.5,
        height: 174,
      })
      .expect(201)
  })
})
