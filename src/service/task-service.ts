import { TaskDao } from '../dal/task-dao'
import { TaskStatus } from '../model/task'
import { TaskValidator } from './validation/task-validator'
import { ServiceError } from './exception/service-exception'
import { ReqTask, RespTask, TaskMapper } from '../dto/task-dto'
import { FileInfo } from '../model/file'

class TaskService {

    constructor(
        private dao: TaskDao,
        private validator: TaskValidator,
        private mapper: TaskMapper
    ) {
    }

    public delete(taskId: number) {
        if (!this.dao.delete(taskId)) {
            throw new ServiceError(404, `There is no task with id = ${taskId}`)
        }
    }

    public update(reqTask: ReqTask): RespTask {
        const task = this.mapper.reqToModel(reqTask)

        const updatedTask = this.dao.update(task)

        if (!updatedTask) {
            throw new ServiceError(404, "There is not task with such id...")
        }

        const files = this.dao.getFiles(task.id!)
        return this.mapper.modelToResp(updatedTask, files!)
    }

    public add(reqTask: ReqTask): RespTask {
        const task = this.dao.save(this.mapper.reqToModel(reqTask))
        const files = this.dao.getFiles(task.id!)
        return this.mapper.modelToResp(task, files!)
    }

    public get(taskId: number): RespTask {
        const task = this.dao.get(taskId)
        if (!task) {
            throw new ServiceError(404, `There is no task with id = ${taskId}`)
        }
        
        const files = this.dao.getFiles(task.id!)
        return this.mapper.modelToResp(task!, files!)
    }

    public getAll(filter: number | undefined): RespTask[] {
        let tasks; 

        if (filter !== undefined && (TaskStatus.TODO <= filter) && (filter <= TaskStatus.DONE)) {
            tasks = this.dao.getAll(filter)
        } else {
            tasks = this.dao.getAll()
        }

        return tasks.map(t => this.mapper.modelToResp(t, this.dao.getFiles(t.id!)!))
    }

    public addFile(taskId: number, fileId: string, fileName: string): FileInfo {
        return this.dao.addFile(taskId, fileId, fileName)
    }

    public getFileInfo(taskId: number, fileId: string): FileInfo {
        const fileInfo = this.dao.getFileInfo(taskId, fileId)
        if (!fileInfo) {
            throw new ServiceError(404, `There is no file with id = ${fileId} for task = ${taskId}`)
        }

        return fileInfo
    }

    public deleteFileInfo(taskId: number, fileId: string) {
        if (!this.dao.deleteFileInfo(taskId, fileId)) {
            throw new ServiceError(404, `There is no file with id = ${fileId} for task = ${taskId}`)
        }
    }

}

export { TaskService }

