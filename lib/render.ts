import fs from 'fs';
import path from 'path';

import { convert, Options } from './convert';
import parse from './parse';

export default function render(templatePath: string, options?: Options): string {
  let template = '';
  const fullTemplatePath = path.join(__dirname, templatePath);

  try {
    template = fs.readFileSync(fullTemplatePath).toString();
  } catch (err) {
    throw new Error('Invalid template path');
  }

  return convert(parse(template, fullTemplatePath), options);
}
