import { Task, TaskStatus } from '../model/task'
import { FileInfo } from '../model/file'
import { UserCredentials } from '../model/user'

const statusMapper = new Map<TaskStatus, string>()
statusMapper.set(TaskStatus.TODO, "TODO")
statusMapper.set(TaskStatus.IN_PROGRESS, "IN PROGRESS")
statusMapper.set(TaskStatus.DONE, "DONE")

class ExtractionError extends Error {

    constructor(
        public code: number,
        public message: string
    ) {
        super(message)
    }

}

class TaskExtracter {
    
    public extract(body: any): ReqTask {
        let id: number | undefined = undefined
        if (Number.isInteger(body.id)) {
            id = body.id
        } else if ((typeof body.id === "string") && Number.isInteger(Number.parseInt(body.id))) {
            id = Number.parseInt(body.id)
        } else if (body.id !== undefined) {
            throw new ExtractionError(400, "Incorrect value for id")
        }

        let title: string
        if (typeof body.title === "string" && body.title.length > 0) {
            title = body.title
        } else {
            console.log(body.title)
            throw new ExtractionError(400, "Incorrect value for title")
        }

        let content: string
        if (typeof body.content === "string" && body.content.length > 0) {
            content = body.content
        } else {
            throw new ExtractionError(400, "Incorrect value for content")
        }

        let status: TaskStatus
        const reqStatus = body.status
        if (Number.isInteger(reqStatus)
            && TaskStatus.TODO <= reqStatus
            && reqStatus <= TaskStatus.DONE) {

        status = reqStatus

        }  else if ((typeof body.status === "string") && Number.isInteger(Number.parseInt(body.status))) {
            status = Number.parseInt(body.status)
        } else {
            throw new ExtractionError(400, "Incorrect value for status")
        }

        let completionDate: Date
        const reqDateNumber = Date.parse(body.completionDate)
        if (!Number.isNaN(reqDateNumber)) {
            completionDate = new Date(reqDateNumber)
        } else {
            throw new ExtractionError(400, "Incorrect value for completion date")
        }

        return new ReqTask(id, status, title, content, completionDate)
    }

}

const taskExtracter = new TaskExtracter()

function extractUserCredentials(body: any): UserCredentials {
    let login: string
    if (typeof body.login === "string" && body.login.length > 0) {
        login = body.login
    } else {
        throw new ExtractionError(400, "Incorrect value for login")
    }

    let password: string
    if (typeof body.password === "string" && body.password.length > 0) {
        password = body.password
    } else {
        throw new ExtractionError(400, "Incorrect value for password")
    }

    return {
        login: login,
        password: password
    }
}

class RespTask {

    public id: number

    public statusName: string

    public status: TaskStatus 

    public title: string

    public content: string

    public completionDate: string

    constructor(
        task: Task,
        public attachedFiles: FileInfo[]
    ) {
        this.id = task.id!
        this.status = task.status
        this.statusName = statusMapper.get(task.status)!
        this.title = task.title
        this.content = task.content
        this.completionDate = task.completionDate.toISOString().split('T')[0]
    }

}

class ReqTask {

    constructor(
        public id: number | undefined,
        public status: number,
        public title: string,
        public content: string,
        public completionDate: Date,
    ) {
    }

}

class TaskMapper {

    constructor(
    ) {
    }

    public reqToModel(reqTask: ReqTask): Task {
        return new Task(
            reqTask.id,
            reqTask.status,
            reqTask.title,
            reqTask.content,
            reqTask.completionDate,
        )
    }

    public modelToResp(task: Task, attachedFiles: FileInfo[]): RespTask {
        return new RespTask(
            task,
            attachedFiles
        )
    }

}

export { RespTask, ReqTask, TaskExtracter, TaskMapper, ExtractionError, extractUserCredentials, taskExtracter }

