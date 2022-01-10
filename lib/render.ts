import { convert, Options } from './convert';

export default function render(template: string, options?: Options): string {
  return convert(template);
}
