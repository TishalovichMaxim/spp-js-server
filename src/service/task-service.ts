import { TaskDao } from '../dal/task-dao'
import { Task, TaskStatus } from '../model/task'
import { TaskValidator } from './validation/task-validator'
import { ServiceError } from './exception/service-exception'
import { ReqTask, RespTask, TaskMapper } from '../dto/task-dto'
import { FileInfo } from '../model/file'
import { DaoError } from '../dal/dao-exception'

class TaskService {

    constructor(
        private dao: TaskDao,
        private validator: TaskValidator,
        private mapper: TaskMapper
    ) {
    }

    public delete(userId: number, taskId: number) {
        if (!this.dao.delete(userId, taskId)) {
            throw new ServiceError(404, `There is no task with id = ${taskId}`)
        }
    }

    public update(userId: number, reqTask: ReqTask): RespTask {
        const task = this.mapper.reqToModel(reqTask)

        const updatedTask = this.dao.update(userId, task)

        if (!updatedTask) {
            throw new ServiceError(404, "There is not task with such id...")
        }

        const files = this.dao.getFiles(userId, task.id!)
        return this.mapper.modelToResp(updatedTask, files!)
    }

    public add(userId: number, reqTask: ReqTask): RespTask {
        let task: Task
        try {
            task = this.dao.save(userId, this.mapper.reqToModel(reqTask))
        } catch (e: any) {
            throw new ServiceError(400, e.message)
        }

        const files = this.dao.getFiles(userId, task.id!)
        return this.mapper.modelToResp(task, files!)
    }

    public get(userId: number, taskId: number): RespTask {
        const task = this.dao.get(userId, taskId)
        if (!task) {
            throw new ServiceError(404, `There is no task with id = ${taskId}`)
        }
        
        const files = this.dao.getFiles(userId, task.id!)
        return this.mapper.modelToResp(task!, files!)
    }

    public getAll(userId: number, filter: number | undefined): RespTask[] {
        let tasks; 

        if (filter !== undefined && (TaskStatus.TODO <= filter) && (filter <= TaskStatus.DONE)) {
            tasks = this.dao.getAll(userId, filter)
        } else {
            tasks = this.dao.getAll(userId)
        }

        return tasks.map(t => this.mapper.modelToResp(t, this.dao.getFiles(userId, t.id!)!))
    }

    public addFile(userId: number, taskId: number, fileId: string, fileName: string): FileInfo {
        return this.dao.addFile(userId, taskId, fileId, fileName)
    }

    public getFileInfo(userId: number, taskId: number, fileId: string): FileInfo {
        const fileInfo = this.dao.getFileInfo(userId, taskId, fileId)
        if (!fileInfo) {
            throw new ServiceError(404, `There is no file with id = ${fileId} for task = ${taskId}`)
        }

        return fileInfo
    }

    public deleteFileInfo(userId: number, taskId: number, fileId: string) {
        if (!this.dao.deleteFileInfo(userId, taskId, fileId)) {
            throw new ServiceError(404, `There is no file with id = ${fileId} for task = ${taskId}`)
        }
    }

}

export { TaskService }

