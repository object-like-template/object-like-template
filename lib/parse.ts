import importPartial from './utils/importPartial';
import setPartialOptions from './utils/setPartialOptions';

export default function parse(template: string, basePath: string) {
  const regPartial = /#\{(.+?)\}\((.+?)\)|#\{(.+?)\}/g;
  const result = template.replace(regPartial, (_, optionPartialPath, options, basicPartialPath) => {
    let partialTemplate = importPartial(optionPartialPath || basicPartialPath, basePath);

    if (optionPartialPath) {
      partialTemplate = setPartialOptions(partialTemplate, options);
    }

    return partialTemplate;
  }).replace(/\r/g, '');

  return result;
}
