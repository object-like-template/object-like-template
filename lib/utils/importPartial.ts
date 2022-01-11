import fs from 'fs';
import path from 'path';

export default function importPartial(partialPath: string, basePath: string): string {
  const fullPartialPath = `${partialPath}.olt`;
  let template = '';

  try {
    template = fs.readFileSync(path.join(basePath, '../', fullPartialPath)).toString();
  } catch (err) {
    throw new Error(`${partialPath} is Invalid partial template`);
  }

  return template;
}
