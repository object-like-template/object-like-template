import fs from 'fs';
import path from 'path';

import { convert, Options } from './convert';

function importPartial(partialPath: string, basePath: string): string {
  const fullPartialPath = `${partialPath}.olt`;
  let template = '';

  try {
    template = fs.readFileSync(path.join(basePath, '../', fullPartialPath)).toString();
  } catch (err) {
    throw new Error(`${partialPath} is Invalid partial template`);
  }

  return template;
}

export default function render(templatePath: string, options?: Options): string {
  let template = '';
  const fullTemplatePath = path.join(__dirname, templatePath);

  try {
    template = fs.readFileSync(fullTemplatePath).toString();
  } catch (err) {
    throw new Error('Invalid template path');
  }

  const reg = /#\{(\S*)\}/g;
  const result = template.replace(reg, (_, partialPath) => {
    const partialTemplate = importPartial(partialPath, fullTemplatePath);
    return partialTemplate;
  }).replace(/\r/g, '');

  return convert(result, options);
}
