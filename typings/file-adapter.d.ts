declare interface FileResult {
  size: number
  totalLines: number
  page: number
  maxPage: number

  lines: Array<string>
}

declare interface FileWorkerMessageReceive {
  type: string
  path: string
  watch: boolean
}
