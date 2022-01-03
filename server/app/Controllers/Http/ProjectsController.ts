import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import ProjectValidator from 'App/Validators/ProjectValidator'


export default class ProjectsController {
    public async index({ response }: HttpContextContract) {
        const project = await Project.query().preload('projectOwner', (
            projectQuery) => {
            projectQuery.select(['username'])
        }).preload('projectsTask', (
            projectQuery) => {
            projectQuery.select(['description', 'completed'])
        })
        response.status(200).json({ message: 'success get Project data', data: project })
    }

    public async show({ params, response }: HttpContextContract) {
        const projectData = await Project.query().where('id', params.id).preload('projectOwner', (
            projectQuery) => {
            projectQuery.select(['username'])
        }).preload('projectsTask', (
            projectQuery) => {
            projectQuery.select(['description', 'completed'])
        }).firstOrFail()
        return response.status(200).json({ message: 'success get project data', data: projectData })
    }

    public async store({ auth, request, response }: HttpContextContract) {
        try {
            const userId = await auth.user!.id
            const user = await User.findByOrFail('id', userId)
            // console.log(user)


            const payload = await request.validate(ProjectValidator)
            let newProject = new Project()
            newProject.title = payload.title

            // console.log(newProject)

            await user.related('projects').save(newProject)
            response.ok({ message: 'stored', data: newProject })
        } catch (error) {
            response.badRequest({ error: error.messages })
        }
    }

    public async update({ params, request, response }: HttpContextContract) {
        try {
            let id = params.id
            await request.validate(ProjectValidator)

            let project = await Project.findByOrFail('id', id)
            project.title = request.input('title')
            await project.save()
            response.ok({ message: 'project updated', newData: project })

        } catch (error) {
            response.badRequest({ error: error.messages })
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        let id = params.id
        // await Database.from('fields').where('id',id).delete()
        let project = await Project.findByOrFail('id', id)
        await project.delete()
        response.ok({ message: 'project deleted' })
    }
}
