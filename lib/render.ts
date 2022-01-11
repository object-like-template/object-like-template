import fs from 'fs';
import path from 'path';

import { convert, Options } from './convert';

function importPartial(line: string, basePath: string): string {
  const [importExpression, templateName, from, templatePath] = line.split(' ');
  const trimmedTemplatePath = templatePath.trim().slice(1, templatePath.length - 3);
  let template = '';

  if (importExpression !== 'import' || from !== 'from') {
    throw SyntaxError('Import expression should be "import {templateName} from {templatePath}"');
  }

  try {
    template = fs.readFileSync(path.join(basePath, '../', trimmedTemplatePath)).toString();
  } catch (err) {
    throw new Error(`${trimmedTemplatePath} is Invalid partial template path`);
  }

  return template;
}

export default function render(templatePath: string, options?: Options): string {
  let template = '';

  try {
    template = fs.readFileSync(path.join(__dirname, templatePath)).toString();
  } catch (err) {
    throw new Error('Invalid template path');
  }

  return convert(template, options);
}
