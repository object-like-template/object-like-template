import singletons from './constant/singletons';
import STATE from './constant/state';

export interface Options {
  [key: string]: string | Options,
}

type Attribute = [string, string];

interface Tag {
  name: string,
  attributes: Attribute[],
  inBlockTags: Tag[],
}

export function convert(template: string, options?: Options): string {
  const blockTags: Tag[] = [];

  let unClosedTags: Tag[] = [];
  let state: string = STATE.IS_TAG_NAME;
  let prevTag: Tag = {
    name: '',
    attributes: [],
    inBlockTags: [],
  };
  let tag: Tag = {
    name: '',
    attributes: [],
    inBlockTags: [],
  };
  let attribute: Attribute = ['', ''];
  let isKey = false;
  let hasDefault = false;
  let currentStr = '';
  let result = '';

  function setTagName() {
    tag.name = currentStr;
    currentStr = '';
  }

  function setAttrName() {
    attribute[0] = currentStr;
    currentStr = '';
  }

  function setAttrValue() {
    attribute[1] = currentStr;
    currentStr = '';
  }

  function addAttribute() {
    tag.attributes.push(attribute);
    attribute = ['', ''];
    currentStr = '';
  }

  function resetTag() {
    tag = {
      name: '',
      attributes: [],
      inBlockTags: [],
    };
  }

  function openTag() {
    const { name, attributes } = tag;

    prevTag = tag;

    if (!name) {
      return;
    }

    const attributesStr = attributes.map(([name, value]) => `${name}="${value}"`).join(' ');
    const currentBlockTag = blockTags[blockTags.length - 1];

    if (singletons.has(name)) {
      result += attributesStr ? `<${name} ${attributesStr} />` : `<${name} />`;
    } else {
      result += attributesStr ? `<${name} ${attributesStr}>` : `<${name}>`;
      (blockTags.length ? currentBlockTag.inBlockTags : unClosedTags).push(tag);
    }

    resetTag();
  }

  function addValue() {
    result += currentStr;
    currentStr = '';
    openTag();
  }

  function closeCurrentTag(isBlockTag? : true) {
    const currentBlockTag = blockTags[blockTags.length - 1];
    const currentUncloseTags = blockTags.length ? currentBlockTag.inBlockTags : unClosedTags;

    if (!isBlockTag && prevTag !== currentUncloseTags[currentUncloseTags.length - 1]) {
      return;
    }

    const closeTag = (isBlockTag ? blockTags : currentUncloseTags).pop();

    result += `</${closeTag?.name}>`;
  }

  function closeTags() {
    const currentBlockTag = blockTags[blockTags.length - 1];

    if (!blockTags.length && !unClosedTags.length) {
      return;
    }

    const closeTags = (blockTags.length ? currentBlockTag.inBlockTags : unClosedTags).map(({ name }) => `</${name}>`);
    result += closeTags.reverse().join('');

    if (blockTags.length) {
      currentBlockTag.inBlockTags = [];
    } else {
      unClosedTags = [];
    }
  }

  function openBlock() {
    const currentBlockTag = blockTags[blockTags.length - 1];
    const currentTag = (blockTags.length ? currentBlockTag.inBlockTags : unClosedTags).pop();

    if (currentTag) {
      blockTags.push(currentTag);
    }
  }

  function closeBlock() {
    const currentBlockTag = blockTags[blockTags.length - 1];

    if (currentStr || state === STATE.IS_TAG_NAME) {
      setTagName();
    }

    if (tag.name) {
      openTag();
    }

    if (currentBlockTag && currentBlockTag.inBlockTags.length) {
      closeTags();
    }

    closeCurrentTag(true);
  }

  function handleTagName(char: string, prevChar: string) {
    switch (char) {
      case ' ':
        break;
      case '"':
        state = STATE.IS_VALUE;
        break;
      case ':':
        if (currentStr) {
          setTagName();
        }

        openTag();
        break;
      case ',':
        if (currentStr) {
          setTagName();
        }

        if (tag.name) {
          openTag();
        }

        closeCurrentTag();
        break;
      case '(':
        setTagName();
        state = STATE.IS_ATTR_NAME;
        break;
      case '\n':
        if (currentStr) {
          setTagName();
        }

        if (tag.name) {
          openTag();
        }

        if (prevChar !== ':' && prevChar !== ',' && prevChar !== '{') {
          closeTags();
        }

        break;
      case '{':
        openBlock();
        break;
      case '}':
        closeBlock();
        break;
      default:
        currentStr += char;
    }
  }

  function handleAttrName(char: string) {
    switch (char) {
      case ' ':
        break;
      case '=':
        setAttrName();
        state = STATE.IS_ATTR_VALUE;
        break;
      case ',':
      case ')':
        addAttribute();
        break;
      default:
        currentStr += char;
    }
  }

  function handleAttrValue(char: string) {
    switch (char) {
      case '"':
        break;
      case ',':
        setAttrValue();
        addAttribute();
        state = STATE.IS_ATTR_NAME;
        break;
      case ')':
        setAttrValue();
        addAttribute();
        state = STATE.IS_TAG_NAME;
        break;
      default:
        currentStr += char;
    }
  }

  function handleValue(char: string) {
    switch (char) {
      case '"':
        addValue();
        state = STATE.IS_TAG_NAME;
        break;
      default:
        currentStr += char;
    }
  }

  let count = 0;
  let key = '';
  let defaultValue = '';

  function handleKey(char: string) {
    if (char === '=') {
      hasDefault = true;
      count = 0;

      return;
    }

    if (hasDefault) {
      if (char === '"') {
        count += 1;
        hasDefault = count < 2;
      } else if (char !== ' ') {
        defaultValue += char;
      }

      return;
    }

    if (char === '"' || char === ')') {
      throw new SyntaxError('Unclosed variable');
    }

    if (char === '}') {
      isKey = false;

      const value = options?.[key] || defaultValue;

      if (value) {
        currentStr += value;
      }

      key = '';
    } else {
      key += char;
    }
  }

  for (let i = 0, len = template.length; i < len; i += 1) {
    const char = template[i];

    if (char === '@' && template[i + 1] === '{') {
      isKey = true;
      i += 1;
      continue;
    }

    if (isKey) {
      handleKey(char);
      continue;
    }

    if (state === STATE.IS_TAG_NAME) {
      handleTagName(char, template[i - 1] ? template[i - 1] : template[i - 2]);
    } else if (state === STATE.IS_ATTR_NAME) {
      handleAttrName(char);
    } else if (state === STATE.IS_ATTR_VALUE) {
      handleAttrValue(char);
    } else if (state === STATE.IS_VALUE) {
      handleValue(char);
    }
  }

  if (currentStr || state === STATE.IS_TAG_NAME) {
    setTagName();
  }

  if (tag.name) {
    openTag();
  }

  if (state === STATE.IS_ATTR_NAME || state === STATE.IS_ATTR_VALUE) {
    throw new SyntaxError('Unclosed Options');
  }

  if (state === STATE.IS_VALUE) {
    throw new SyntaxError('Text has to be in double quotes');
  }

  if (blockTags.length) {
    throw new SyntaxError('Unclosed Block (need “}”)');
  }

  return result;
}
