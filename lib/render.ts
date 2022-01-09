import convert from './convert';

type Options = {
  [key in string]: string | Options
}

export default function render(template: string, options?: Options): string {
  return convert(template);
}
