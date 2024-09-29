import { Task, TaskStatus } from "../model/task";
import { FileInfo } from "../model/file";

class TaskDao {

    private prevId = 0

    private tasks = new Map<number, Task>()

    private files = new Map<number, Map<string, string>>()

    constructor() {
    }

    private setId(task: Task) {
        this.prevId += 1
        task.id = this.prevId
    }

    public save(task: Task) {
        this.setId(task)

        this.files.set(task.id!, new Map()) 
        this.tasks.set(this.prevId, task)

        return task
    }

    public getFiles(taskId: number): FileInfo[] | undefined {
        return Array.from(this.files.get(taskId)!.keys()).map(k => new FileInfo(k, this.files.get(taskId)!.get(k)!))
    }

    public getFileInfo(taskId: number, fileId: string): FileInfo | undefined {
        const taskFiles = this.files.get(taskId)
        if (!taskFiles) {
            return undefined
        }

        const fileName = taskFiles.get(fileId)
        if (!fileName) {
            return undefined
        }

        return new FileInfo(fileId, fileName)
    }

    public get(id: number): Task | undefined {
        const res = this.tasks.get(id)
        return res
    }

    public getAll(statusFilter?: TaskStatus): Task[] {
        const arr = Array.from(this.tasks.values())

        if (!Number.isInteger(statusFilter)) {
            return arr
        } else {
            return arr.filter(t => t.status == statusFilter)
        }
    }

    public update(task: Task): Task | undefined {
        if (!this.tasks.has(task.id!)) {
            return undefined
        }

        this.tasks.set(task.id!, task)

        return this.tasks.get(task.id!)
    }

    public addFile(taskId: number, fileId: string, fileName: string) {
        this.files.get(taskId)?.set(fileId, fileName)
        return new FileInfo(fileId, fileName)
    }

    public delete(taskId: number): boolean {
        return this.tasks.delete(taskId) && this.files.delete(taskId)
    }

    public deleteFileInfo(taskId: number, fileId: string): boolean {
        return this.files.get(taskId)!.delete(fileId)
    }

}

export { TaskDao }

