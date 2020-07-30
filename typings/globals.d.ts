import { RedisClient } from 'redis'
import { Logger as WinstonLogger } from 'node_modules/winston/index'
import * as BaseAdapter from 'backend/adapter/BaseAdapter'

export interface Storage {

  init(): Promise<void>
  register(name: string): string
  getPath(name: string = ''): string
  createDirectory(name: string): Promise<string|void>
  writeFile(name: string, content: string = ''): Promise<void>

}

export interface Logger extends WinstonLogger {

  /**
   * Creates a new logger with the given name as it's label.
   * @param name The new logging label.
   */
  scope(name: string): Logger

}

export interface AdapterManager {

  init(): Promise<void>
  dispose(): Promise<void>

  available(): Object
  list(): Array<string>
  count(): Object

  getAdapter(key: String): BaseAdapter

}

export interface User {

  readonly id: number
  username: string
  email: string
  password: string
  role: string = 'user'

}

export interface Accounts {

  init(): Promise<void>
  dispose(): Promise<void>

  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hash: string): Promise<boolean>

  all(): Promise<Array<User>>
  count(): Promise<number>

  create(user: User): Promise<void>
  update(user: User): Promise<void>
  deleteUser(id: number): Promise<void>

  findById(id: number): Promise<User>
  findByUsername(username: string): Promise<User>

  checkAuth(username: string, password: string): Promise<boolean>

}

export interface Mailer {

  readonly isConnected: boolean

  init(): Promise<void>
  dispose(): Promise<void>

  sendMail(to: string, subject: string, htmlText: string): Promise<void>

}

export interface RedisManager {

  readonly isConnected: boolean
  readonly client: RedisClient

  init(): Promise<null>
  run(cmd: string, ...args: any[]): void
  dispose(): Promise<null>

}

declare global {
  const DEBUG: boolean
  const ROOT_DIRECTORY: string

  const storage: Storage
  const config: Object
  const logger: Logger
  const adapters: AdapterManager
  const accounts: Accounts
  const mailer: Mailer
  const redis: RedisManager
}
