import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskValidator'
// import Database from '@ioc:Adonis/Lucid/Database'

export default class TasksController {
    public async index({ params, response }: HttpContextContract) {
        const project_id = params.project_id
        const task = await Task.query().where('project_id', project_id).preload('tasksProject', (
            taskQuery) => {
            taskQuery.select(['title'])
        })

        response.status(200).json({ message: 'success get Task data', data: task })
    }

    public async show({ params, response }: HttpContextContract) {
        const taskData = await Task.query().where('id', params.id).where('project_id', params.project_id).preload('tasksProject', (
            taskQuery) => {
            taskQuery.select(['title'])
        }).firstOrFail()
        return response.status(200).json({ message: 'success get Task data', data: taskData })
    }

    public async store({ params, request, response }: HttpContextContract) {
        try {
            const project_id = params.project_id
            const project = await Project.findByOrFail('id', project_id)
            await request.validate(TaskValidator)

            let newTask = await new Task()
            newTask.description = request.input('description')
            await project.related('projectsTask').save(newTask)
            response.ok({ message: 'stored', data: newTask })
        } catch (error) {
            response.badRequest({ error: error.messages })
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        try {
            let id = params.id
            await request.validate(TaskValidator)

            let task = await Task.findByOrFail('id', id)
            task.description = request.input('description')
            await task.save()
            response.ok({ message: 'task updated' })

        } catch (error) {
            response.badRequest({ error: error.messages })
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        let id = params.id
        // await Database.from('tasks').where('id',id).delete()
        let task = await Task.findByOrFail('id', id)
        await task.delete()
        response.ok({ message: 'task deleted' })
    }

    public async taskAction({ params, response }: HttpContextContract) {
        let id = params.id
        // await Database.from('tasks').where('id',id).delete()
        let task = await Task.findByOrFail('id', id)
        if (!task.completed) {
            task.completed = true
        } else {
            task.completed = false
        }
        await task.save()
        response.ok({ message: 'task completed changed' })
    }
}
