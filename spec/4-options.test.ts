import { expect } from 'chai';

import render from '../lib/render';

describe('options', () => {
  it('should render a tag with a variable in text', () => {
    const template = 'h1: "@{title}"\n';
    const result = render(template, { title: 'Object-like Template' });

    expect(result).to.equal('<h1>Object-like Template</h1>');
  });

  it('should render a tag with a variable in property', () => {
    const template = 'h1(class="@{className}")\n';
    const result = render(template, { className: 'red-line' });

    expect(result).to.equal('<h1 class="red-line"></h1>');
  });

  it('should render a tag with variables', () => {
    const template = 'h1(class="@{className}"): "@{title}"\n';
    const result = render(template, { title: 'Object-like Template', className: 'red-line' });

    expect(result).to.equal('<h1 class="red-line">Object-like Template</h1>');
  });

  it('should throw a syntax error when not close variable block', () => {
    const template = 'h1(class="@{className")\n';

    expect(render(template, { className: 'red-line' })).to.throw(SyntaxError, 'Unclosed variable');
  });

  it('should render a tag with default variable', () => {
    const template = 'h1: "@{title = "title"}\n';
    const result = render(template);

    expect(render(result)).to.equal('<h1>title</h1>');
  });

  it('should throw a reference error when use variable without options', () => {
    const template = 'h1(class="@{className}")\n';

    expect(render(template)).to.throw(ReferenceError, 'options is required if you want variable');
  });

  it('should throw a reference error when use undefined variable', () => {
    const template = 'h1(class="@{className}")\n';

    expect(render(template, { class: 'red-line' })).to.throw(ReferenceError, '"className" is undefined');
  });
});
