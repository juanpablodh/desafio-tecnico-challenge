export interface AppCache {
  get: (key: string) => any
  set: (key: string, value: any) => void
}
