import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    username: schema.string({}, [
      rules.alpha(),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email'
      })
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.confirmed(),

    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * } 
   *
   */
  public messages = {
    'required': `{{field}} is required`,
    'minLenght': `the {{field}} at least 6 letters`,
    'email.email': `{{field}} not correct`,
    'unique': `{{field}} has already used`,
    'username.alpha': `{{field}} only letter(A-Z and/or a-z)`,
  }
}