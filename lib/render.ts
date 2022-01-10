import fs from 'fs';
import path from 'path';

import { convert, Options, Partial } from './convert';

function importPartial(line: string, basePath: string): Partial {
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

  return [templateName, template];
}

export default function render(templatePath: string, options?: Options): string {
  const partialTemplates: [string, string][] = [];
  let template = '';

  try {
    template = fs.readFileSync(path.join(__dirname, templatePath)).toString();
  } catch (err) {
    throw new Error('Invalid template path');
  }

  if (template.startsWith('import')) {
    const templateLines = template.split('\n');

    for (let i = 0, len = templateLines.length; i < len; i += 1) {
      const line = templateLines[i];

      if (line.startsWith('import')) {
        partialTemplates.push(importPartial(line, path.join(__dirname, templatePath)));
      } else {
        template = templateLines.slice(i).join('\n');
        break;
      }
    }
  }

  return convert(template, options, partialTemplates);
}
