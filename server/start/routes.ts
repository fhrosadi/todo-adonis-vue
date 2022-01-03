/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('user/register', 'UsersController.register').as('user.register');
  Route.post('user/login', 'UsersController.login').as('user.login');

  Route.resource('projects', 'ProjectsController').apiOnly().middleware({
    '*': ['auth'],
  })

  Route.resource('projects.tasks', 'TasksController').apiOnly().middleware({
    '*': ['auth'],
  })
  Route.put('projects/:project_id/tasks/:id/action', 'TasksController.taskAction').as('projects.tasks.action').middleware('auth')

})
  .prefix('api');
