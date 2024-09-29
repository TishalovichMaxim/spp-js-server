import { Task, TaskStatus } from '../../model/task'

class TaskValidator {

    private validateTitle(title: string) {
        return title.length > 4 && title.length < 120
    }

    private validateContent(title: string) {
        return title.length > 10 && title.length < 700
    }

    private validateCompletionDate(completionDate: Date) {
        return new Date() < completionDate 
    }

    public validate(task: Task) {
        return this.validateTitle(task.title) 
            && this.validateContent(task.content)
            && this.validateCompletionDate(task.completionDate)
    }

}

export { TaskValidator }

