const STATE = {
  IS_TAG_NAME: 'isTagName',
  IS_ATTR_NAME: 'isAttrName',
  IS_ATTR_VALUE: 'isAttrValue',
  IS_VALUE: 'isValue',
} as const;

// type STATE = typeof STATE[keyof typeof STATE];

export default STATE;
