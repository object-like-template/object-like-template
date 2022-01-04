import { expect } from 'chai';

import render from '../lib/render';

describe('parent and child', () => {
  it('should render a tag with a child with line-break', () => {
    const template = 'html:\n  head\n';
    const result = render(template);

    expect(result).to.equal(
      `<html>
  <head></head>
</html>`,
    );
  });

  it('should render a tag with a child without line-break', () => {
    const template = 'html: head\n';
    const result = render(template);

    expect(result).to.equal(
      `<html>
  <head></head>
</html>`,
    );
  });

  it('should render a tag with a text child', () => {
    const template = 'h1: "this is title"\n';
    const result = render(template);

    expect(result).to.equal('<h1>this is title</h1>');
  });

  it('should throw error when text is not closed', () => {
    const template = 'h1: "this is title';

    expect(render(template)).to.throw(SyntaxError, 'Text have to be in double quotes');
  });
});

describe('parent and children', () => {
  it('should render parent and children with line-break', () => {
    const template = 'html:\n  head,\n  body\n';
    const result = render(template);

    expect(result).to.equal(
      `<html>
  <head></head>
  <body></body>
</html>`,
    );
  });

  it('should render parent and children without line-break', () => {
    const template = 'html: head, body\n';
    const result = render(template);

    expect(result).to.equal(
      `<html>
  <head></head>
  <body></body>
</html>`,
    );
  });
});
