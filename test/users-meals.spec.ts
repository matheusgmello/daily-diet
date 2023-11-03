import { it, beforeAll, beforeEach, afterAll, describe, expect } from 'vitest'
import { execSync } from 'node:child_process'
import supertestRequest from 'supertest'
import { app } from '../src/app'
import { knex } from '../src/database'

describe('Users/meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new account', async () => {
    await supertestRequest(app.server)
      .post('/users')
      .send({
        name: 'Usuário_teste',
        email: 'email@email.com',
        address: 'Rua de teste',
        weight: 80.5,
        height: 174,
      })
      .expect(201)

    // console.log(response.get('Set-Cookie'))
  })

  const email = 'teste@email.com'
  const name = 'teste'
  const address = 'Rua de teste'
  const weight = 80.5
  const height = 174

  it('should be able to create a new meal', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Refeição de Teste 3',
        description: 'Teste',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies)
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    // console.log(userId)

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Refeição de Teste 3',
        description: 'Teste',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await supertestRequest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Refeição de Teste 3',
        description: 'Teste',
      }),
    ])
  })
})
