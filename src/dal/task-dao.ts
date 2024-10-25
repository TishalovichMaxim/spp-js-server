import { Task, TaskStatus } from "../model/task";
import { FileInfo } from "../model/file";

class UserData {

    public tasks = new Map<number, Task>()

    public files = new Map<number, Map<string, string>>()

}

class TaskDao {

    private prevId = 0

    private readonly userInfos = new Map<number, UserData>()

    constructor() {
    }

    public initUser(userId: number) {
        this.userInfos.set(userId, new UserData())
    }

    private setId(task: Task) {
        this.prevId += 1
        task.id = this.prevId
    }

    public save(userId: number, task: Task) {
        this.setId(task)

        this.userInfos.get(userId)!.files.set(task.id!, new Map()) 
        this.userInfos.get(userId)!.tasks.set(this.prevId, task)

        return task
    }

    public getFiles(userId: number, taskId: number): FileInfo[] | undefined {
        return Array.from(
            this.userInfos.get(userId)!
                .files.get(taskId)!.keys())
                    .map(k => new FileInfo(k, this.userInfos.get(userId)!.files.get(taskId)!.get(k)!))
    }

    public getFileInfo(userId: number, taskId: number, fileId: string): FileInfo | undefined {
        const taskFiles = this.userInfos.get(userId)!.files.get(taskId)
        if (!taskFiles) {
            return undefined
        }

        const fileName = taskFiles.get(fileId)
        if (!fileName) {
            return undefined
        }

        return new FileInfo(fileId, fileName)
    }

    public get(userId: number, id: number): Task | undefined {
        return this.userInfos.get(userId)!.tasks.get(id)
    }

    public getAll(userId: number, statusFilter?: TaskStatus): Task[] {
        const arr = Array.from(this.userInfos.get(userId)!.tasks.values())

        if (!Number.isInteger(statusFilter)) {
            return arr
        } else {
            return arr.filter(t => t.status == statusFilter)
        }
    }

    public update(userId: number, task: Task): Task | undefined {
        const userInfo = this.userInfos.get(userId)!

        if (!userInfo.tasks.has(task.id!)) {
            return undefined
        }

        userInfo.tasks.set(task.id!, task)

        return userInfo.tasks.get(task.id!)
    }

    public addFile(userId: number, taskId: number, fileId: string, fileName: string) {
        const userInfo = this.userInfos.get(userId)!

        userInfo.files.get(taskId)?.set(fileId, fileName)
        return new FileInfo(fileId, fileName)
    }

    public delete(userId: number, taskId: number): boolean {
        const userInfo = this.userInfos.get(userId)!

        return userInfo.tasks.delete(taskId) && userInfo.files.delete(taskId)
    }

    public deleteFileInfo(userId: number, taskId: number, fileId: string): boolean {
        const userInfo = this.userInfos.get(userId)!

        return userInfo.files.get(taskId)!.delete(fileId)
    }

}

export { TaskDao }

