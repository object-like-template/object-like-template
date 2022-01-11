type Callback = (e: unknown, rendered?: string | undefined) => void

export default function defineEngine(filePath: string, options: object, callback: Callback): void {
  callback('error');
}
