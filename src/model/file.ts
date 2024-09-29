enum FilterType {
    Status = 0,
    Title,
    CompletionDate,
}

class FileInfo {

    constructor(
        public id: string,
        public name: string,
    ) {
    }

}

export { FilterType, FileInfo }

