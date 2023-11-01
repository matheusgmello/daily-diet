import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnTheDiet: z.boolean(),
    })

    const { name, description, isOnTheDiet } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      name,
      description,
      isOnTheDiet,
    })

    return response.status(201).send()
  })

  app.get('/', async () => {
    const meals = await knex('meals').select()

    return {
      meals,
    }
  })

  app.get('/:id', async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', params.id).first()

    return { meal }
  })
}
