import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      address: z.string(),
      weight: z.number(),
      height: z.number(),
    })
    const { name, email, address, weight, height } = createUserBodySchema.parse(
      request.body,
    )

    const checkUserExist = await knex
      .select('*')
      .from('users')
      .where('email', email)
      .first()

    if (checkUserExist) {
      throw new Error('Este email já está vinculado à um usuário')
    }

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      address,
      weight,
      height,
    })

    return response.status(201).send()
  })
}
