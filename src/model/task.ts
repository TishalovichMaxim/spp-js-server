enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE,
}

class Task {
    constructor(
        public id: number | undefined,
        public status: TaskStatus,
        public title: string,
        public content: string,
        public completionDate: Date,
    ) {

    }
}

export { Task, TaskStatus }

