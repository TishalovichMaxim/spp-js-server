import { writeFile } from "fs/promises"
import { join } from "path"
import { WsError } from "./ws-error"
import { WsResponseStatus } from "./message-type"
import { taskService } from "../dependencies"
import { FileInfo } from "../model/file"

const upload = "./uploads/"
let prevId = 0

async function saveFile(
    userId: number,
    taskId: number,
    fileName: string,
    data: Buffer,
) {
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

export { saveFile }

