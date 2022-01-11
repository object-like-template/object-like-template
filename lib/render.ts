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

function createOptionRegExp(key: string) {
  return RegExp(`@{${key}}`, 'g');
}

function parseTemplate(template: string, basePath: string) {
  const regPartial = /#\{(.+?)\}\((.+?)\)|#\{(.+?)\}/g;
  const result = template.replace(regPartial, (_, optionPartialPath, options, basicPartialPath) => {
    let partialTemplate = importPartial(optionPartialPath || basicPartialPath, basePath);

    if (optionPartialPath) {
      const partialOptions = options.split(',').map((optionStr: string): [string, string] => {
        const reg = /(.+?)="(.+?)"/;
        const result = reg.exec(optionStr);
        let key = '';
        let value = '';

        if (result) {
          [_, key, value] = result;
        }

        return [key.trim(), value.trim()];
      }, {});

      partialOptions.forEach((option: [string, string]) => {
        const [key, value] = option;
        const optionReg = createOptionRegExp(key);

        partialTemplate = partialTemplate.replace(optionReg, value);
      });
    }

    return partialTemplate;
  }).replace(/\r/g, '');

  return result;
}

export default function render(templatePath: string, options?: Options): string {
  let template = '';
  const fullTemplatePath = path.join(__dirname, templatePath);

  try {
    template = fs.readFileSync(fullTemplatePath).toString();
  } catch (err) {
    throw new Error('Invalid template path');
  }

  return convert(parseTemplate(template, fullTemplatePath), options);
}
