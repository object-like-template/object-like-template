import { expect } from 'chai';

import { convert } from '../lib/convert';

describe('single tag without property', () => {
  it('should close a tag when meet line-break without any mark', () => {
    const template = 'html\n';
    const result = convert(template);

    expect(result).to.equal('<html></html>');
  });

  it('should not close a singleton tag', () => {
    const template = 'input\n';
    const result = convert(template);

    expect(result).to.equal('<input />');
  });

  it('should convert a tag with a property', () => {
    const template = 'html(lang="en")\n';
    const result = convert(template);

    expect(result).to.equal('<html lang="en"></html>');
  });

  it('should convert a tag with properties', () => {
    const template = 'div(style="display: flex; background-color: black;", class="black")\n';
    const result = convert(template);

    expect(result).to.equal('<div style="display: flex; background-color: black;" class="black"></div>');
  });

  it('should convert a singleton with property', () => {
    const template = 'input(type="text")\n';
    const result = convert(template);

    expect(result).to.equal('<input type="text" />');
  });

  it('should throw Syntax Error when properties options is not closed', () => {
    const template = 'input(type="ko"\n';

    expect(() => convert(template)).to.throw(SyntaxError, 'Unclosed Options');
  });
});

describe('multiple tags', () => {
  it('should convert a tag with a child with line-break', () => {
    const template = 'html:\n  head\n';
    const result = convert(template);

    expect(result).to.equal(
      '<html>'
        + '<head></head>'
      + '</html>',
    );
  });

  it('should convert a tag with a child without line-break', () => {
    const template = 'html: head\n';
    const result = convert(template);

    expect(result).to.equal(
      '<html>'
        + '<head></head>'
      + '</html>',
    );
  });

  it('should convert a tag with a text child', () => {
    const template = 'h1: "this is title"\n';
    const result = convert(template);

    expect(result).to.equal('<h1>this is title</h1>');
  });

  it('should throw error when text is not closed', () => {
    const template = 'h1: "this is title';

    expect(() => convert(template)).to.throw(SyntaxError, 'Text has to be in double quotes');
  });

  it('should convert parent and children with line-break', () => {
    const template = 'html:\n  head,\n  body\n';
    const result = convert(template);

    expect(result).to.equal(
      '<html>'
        + '<head>'
        + '</head>'
        + '<body>'
        + '</body>'
      + '</html>',
    );
  });

  it('should convert parent and children without line-break', () => {
    const template = 'html: head, body\n';
    const result = convert(template);

    expect(result).to.equal(
      '<html>'
        + '<head></head>'
        + '<body></body>'
      + '</html>',
    );
  });

  it('should convert parent and singleton tag and sibling tag without line-break', () => {
    const template = 'body: input(type="text"), p: "I\'m paragraph"\n';
    const result = convert(template);

    expect(result).to.equal(
      '<body>'
        + '<input type="text" />'
        + '<p>I\'m paragraph</p>'
      + '</body>',
    );
  });

  it('should convert parent and text and child tag without line-break', () => {
    const template = 'body: "I\'m text", p: "I\'m paragraph"\n';
    const result = convert(template);

    expect(result).to.equal(
      '<body>'
        + 'I\'m text'
        + '<p>I\'m paragraph</p>'
      + '</body>',
    );
  });
});

describe('block tags', () => {
  it('should not close tag before "{" until "}', () => {
    const template = 'body: {\n  section: article, article \n  section: article}';
    const result = convert(template);

    expect(result).to.equal(
      '<body>'
        + '<section>'
          + '<article></article>'
          + '<article></article>'
        + '</section>'
        + '<section>'
          + '<article></article>'
        + '</section>'
      + '</body>',
    );
  });

  it('should throw syntax error when block is not closed', () => {
    const template = 'body: {\n  section: article \n  section: article';

    expect(() => convert(template)).to.throw(SyntaxError, 'Unclosed Block (need “}”)');
  });
});

describe('options', () => {
  it('should convert a tag with a variable in text', () => {
    const template = 'h1: "@{title}"\n';
    const result = convert(template, { title: 'Object-like Template' });

    expect(result).to.equal('<h1>Object-like Template</h1>');
  });

  it('should convert a tag with a variable in property', () => {
    const template = 'h1(class="@{className}")\n';
    const result = convert(template, { className: 'red-line' });

    expect(result).to.equal('<h1 class="red-line"></h1>');
  });

  it('should convert a tag with variables', () => {
    const template = 'h1(class="@{className}"): "@{title}"\n';
    const result = convert(template, { title: 'Object-like Template', className: 'red-line' });

    expect(result).to.equal('<h1 class="red-line">Object-like Template</h1>');
  });

  it('should convert a tag with default variable', () => {
    const template = 'h1: "@{title = "title"}"\n';
    const result = convert(template);

    expect(result).to.equal('<h1>title</h1>');
  });

  it('should convert variable to blank string without options', () => {
    const template = 'h1(class="@{className}")\n';
    const result = convert(template);

    expect(result).to.equal('<h1 class=""></h1>');
  });

  it('should convert variable when use undefined variable', () => {
    const template = 'h1(class="@{className}")\n';
    const result = convert(template);

    expect(result).to.equal('<h1 class=""></h1>');
  });

  it('should throw a syntax error when not close variable block', () => {
    const template = 'h1(class="@{className")\n';

    expect(() => convert(template, { className: 'red-line' })).to.throw(SyntaxError, 'Unclosed variable');
  });
});
