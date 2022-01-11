import fs from 'fs';

import { convert, Options } from './convert';
import parse from './parse';

export default function render(templatePath: string, options?: Options): string {
  let template = '';

  try {
    template = fs.readFileSync(templatePath).toString();
  } catch (err) {
    throw new Error('Invalid template path');
  }

  return convert(parse(template, templatePath), options);
}
