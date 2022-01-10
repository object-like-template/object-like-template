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
  const unClosedTags: Tag[] = [];
  const blockTags: Tag[] = [];

  let state: string = STATE.IS_TAG_NAME;
  let tag: Tag = {
    name: '',
    attributes: [],
    inBlockTags: [],
  };
  let attribute: Attribute = ['', ''];
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
  }

  function closeCurrentTag(isBlockTag? : true) {
    const currentBlockTag = blockTags[blockTags.length - 1];
    const currentUncloseTags = blockTags.length ? currentBlockTag.inBlockTags : unClosedTags;
    const closeTag = (isBlockTag ? blockTags : currentUncloseTags).pop();

    result += `</${closeTag?.name}>`;
  }

  function closeTags() {
    const currentBlockTag = blockTags[blockTags.length - 1];
    const closeTags = (blockTags.length ? currentBlockTag.inBlockTags : unClosedTags).map(({ name }) => `</${name}>`);
    result += closeTags.reverse().join('');

    if (blockTags.length) {
      currentBlockTag.inBlockTags = [];
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

    if (currentBlockTag.inBlockTags.length) {
      closeTags();
    }

    closeCurrentTag(true);
    blockTags.pop();
  }

  function openBlock() {
    const currentTag = unClosedTags.pop();

    if (currentTag) {
      blockTags.push(currentTag);
    }
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

        openTag();
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

  for (let i = 0, len = template.length; i < len; i += 1) {
    const char = template[i];

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
