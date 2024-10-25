class DaoError extends Error {
    constructor(
        public message: string
    ) {
        super(message)
    }
}

export { DaoError }

