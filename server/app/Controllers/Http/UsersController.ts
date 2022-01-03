import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
    public async login({ request, auth, response }: HttpContextContract) {
        const loginSchema = schema.create({
            email: schema.string({ trim: true }, [
                rules.email()
            ]),
            password: schema.string()
        })
        try {
            await request.validate({ schema: loginSchema })
            const email = request.input('email')
            const password = request.input('password')
            const token = await auth.use('api').attempt(email, password)
            return response.ok({ message: 'login success', token })
        } catch (error) {
            if (error.guard) {
                return response.badRequest({ message: 'login error', error: error.message })
            } else {
                return response.badRequest({ message: 'login error', error: error.messages })
            }
        }
    }

    public async register({ request, response }: HttpContextContract) {
        try {
            const data = await request.validate(UserValidator)
            const newUser = await User.create(data)
            return response.created({ status: 'registered', data: newUser })
        } catch (error) {
            return response.unprocessableEntity({ error: error.message })
        }
    }
}
