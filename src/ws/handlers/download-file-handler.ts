import { WsError } from "../ws-error"
import { taskService } from "../../dependencies"
import { WsResponseStatus } from "../message-type"
import { join } from "path"
import { readFile } from "fs/promises"

async function downloadFileHandler(body: any) {
    const userId: number = body.userId
    const taskId = body.taskId
    const fileId = body.fileId

    const filePath = join("./uploads", fileId)

    let content: any
    try {
        taskService.getFileInfo(userId, taskId, fileId)
        content = await readFile(filePath)
    } catch (e: any) {
        console.log(e.message)
        throw new WsError(
            WsResponseStatus.UnknownError,
            "Something was wrong"
        )
    }

    return content
}

export { downloadFileHandler }

