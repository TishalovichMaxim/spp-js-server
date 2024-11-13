import { createHandler } from "graphql-http/lib/use/express"
import { buildSchema, GraphQLError } from "graphql"
import { task, tasks } from "./resolvers/query-resolvers"
import { addTask, updateTask, deleteTask, deleteFile } from "./resolvers/mutation-resolvers"
import { ServiceError } from "../service/exception/service-exception"
import { ExtractionError } from "../dto/task-dto"
 
const schema = buildSchema(`
  type RequestError {
    code: Int!
    message: String
  }

  input TaskBaseInfo {
    title: String!
    content: String!
    status: Int!
    completionDate: String!
  }

  input TaskInput {
    id: Int!
    baseInfo: TaskBaseInfo!
  }

  type FileInfo {
      id: String!
      name: String!
  }

  type Task {
    id: Int!
    title: String!
    content: String!
    status: Int!
    statusName: String!
    completionDate: String!
    attachedFiles: [FileInfo!]!
  }

  type Query {
    task(id: Int!): Task
    tasks(filter: Int): [Task!]
  }

  type Mutation {
    addTask(input: TaskBaseInfo!): Task
    updateTask(id: Int!, input: TaskBaseInfo!): Task
    deleteTask(id: Int!): Task
    deleteFile(taskId: Int!, fileId: String!): FileInfo
  }
`)

const root = {
    task,
    tasks,

    addTask,
    updateTask,
    deleteTask,
    deleteFile,
}
 
const graphqlHandler = createHandler({
    schema: schema,
    rootValue: root,
    context: (req) => {
        return {
            userId: (req.raw as any).userId
        }
    },
    formatError: (err: Readonly<GraphQLError | Error>) => {
        const originalError = (err as any).originalError?.thrownValue

        if (err instanceof GraphQLError 
            && (originalError instanceof ServiceError || originalError instanceof ExtractionError)) {

            console.log("Pred original error: %o", (err as any).originalError)

            console.log("Original error: %o", originalError)

            return new GraphQLError(
                originalError.message,
                {
                    extensions: {
                        code: originalError.code
                    }
                }
            )
        }

        console.log("Not service error occured: %o", err.message)
        return new GraphQLError(
            "Syntax error",
            {
                extensions: {
                    code: 204
                }
            }
        )
    }
})

export { graphqlHandler }

