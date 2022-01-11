import { Options } from './convert';
import render from './render';

type Callback = (e: unknown, rendered?: string | undefined) => void

export default function defineEngine(filePath: string, options: object, callback: Callback): void {
  try {
    const rendered = render(filePath, options as Options);
    return callback(null, rendered);
  } catch (err) {
    return callback(err);
  }
}
