import { writeFile } from "fs/promises"
import { join } from "path"
import { WsError } from "../ws-error"
import { WsResponseStatus } from "../message-type"
import { taskService } from "../../dependencies"
import { FileInfo } from "../../model/file"

const upload = "./uploads/"
let prevId = 0

async function attachFileHandler(
    body: any
) {
    const userId: number = body.userId
    const taskId: number = body.taskId
    const fileName: string = body.fileName
    const data: Buffer = body.data

    prevId += 1
    const fileId = prevId.toString()

    const filePath = join(upload, fileId)

    try {
        await writeFile(filePath, data)
    } catch (e) {
        throw new WsError(
            WsResponseStatus.UnknownError,
            "Error in file saving"
        )
    }

    taskService.addFile(userId, taskId, fileId, fileName)

    return {
        status: WsResponseStatus.Success,
        fileInfo: new FileInfo(fileId, fileName)
    }
}

export { attachFileHandler }

