import { expect } from 'chai';

import render from '../lib/render';

describe('single tag without property', () => {
  it('should close a tag when meet line-break without any mark', () => {
    const template = 'html\n';
    const result = render(template);

    expect(result).to.equal('<html></html>');
  });

  it('should not close a singleton tag', () => {
    const template = 'input\n';
    const result = render(template);

    expect(result).to.equal('<input>');
  });
});

describe('single tag with properties', () => {
  it('should render a tag with a property', () => {
    const template = 'html(lang="en")\n';
    const result = render(template);

    expect(result).to.equal('<html lang="en"></html>');
  });

  it('should render a tag with properties', () => {
    const template = 'div(style="display: flex; background-color: black;", class="black")\n';
    const result = render(template);

    expect(result).to.equal('<div style="display: flex; background-color: black;", class="black"></div>');
  });

  it('should render a singleton with property', () => {
    const template = '!DOCTYPE(html)\n';
    const result = render(template);

    expect(result).to.equal('<!DOCTYPE html>');
  });

  it('should throw Syntax Error when properties options is not closed', () => {
    const template = '!DOCTYPE(html';

    expect(render(template)).to.throw(SyntaxError, 'Unclosed Options');
  });
});
