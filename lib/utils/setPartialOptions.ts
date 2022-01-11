type Option = [string, string];

function createOptionRegExp(key: string) {
  return RegExp(`@{${key}}`, 'g');
}

export default function setPartialOptions(template: string, optionsStr: string) {
  let result = template;

  const partialOptions = optionsStr.split(',').flatMap((optionStr: string): Option[] | [] => {
    const reg = /(.+?)="(.+?)"/;
    const result = reg.exec(optionStr);

    if (!result) {
      return [];
    }

    const [, key, value] = result;

    return [[key.trim(), value.trim()]];
  }, {});

  partialOptions.forEach((option: Option) => {
    const [key, value] = option;
    const optionReg = createOptionRegExp(key);

    result = result.replace(optionReg, value);
  });

  return result;
}
