declare interface FileResult {
  size: number

  page: number
  pageStart: number
  pageEnd: number
  maxPage: number

  limit: number
  totalLines: number
  lines: Array<string>
}

declare interface FileWorkerMessageReceive {
  type: string
  path: string
  watch: boolean
}
