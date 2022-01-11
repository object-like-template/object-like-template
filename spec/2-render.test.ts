import { expect } from 'chai';
import render from '../lib/render';

describe('basic template', () => {
  it('should render a basic template', () => {
    const templatePath = '../views/basic.olt';
    const result = render(templatePath);

    expect(result).to.equal(
      '<html>'
        + '<head>'
          + '<title>basic!</title>'
        + '</head>'
        + '<body>'
          + '<section>'
            + '<article>'
              + '<h1>This is basic template</h1>'
            + '</article>'
          + '</section>'
        + '</body>'
      + '</html>',
    );
  });

  it('should throw error when template path is wrong', () => {
    const templatePath = '../views/notExist.olt';

    expect(() => render(templatePath)).to.throw('Invalid template path');
  });
});

describe('template including options', () => {
  it('should render a template including options', () => {
    const templatePath = '../views/includeOptions.olt';
    const result = render(templatePath, { title: 'This is basic template' });

    expect(result).to.equal(
      '<html>'
        + '<head>'
          + '<title>basic!</title>'
        + '</head>'
        + '<body>'
          + '<section>'
            + '<article>'
              + '<h1>This is basic template</h1>'
            + '</article>'
          + '</section>'
        + '</body>'
      + '</html>',
    );
  });
});

describe('template including partial template', () => {
  it('should render a template including partial template', () => {
    const templatePath = '../views/includePartial.olt';
    const result = render(templatePath);

    expect(result).to.equal(
      '<html>'
        + '<head>'
          + '<title>basic!</title>'
        + '</head>'
        + '<body>'
          + '<section>'
            + '<article>'
              + '<h1>This is basic template</h1>'
            + '</article>'
            + '<article>'
              + '<h1>partial</h1>'
              + '<p>This is an article about partial.</p>'
            + '</article>'
          + '</section>'
        + '</body>'
      + '</html>',
    );
  });

  it('should render a template including partial with option', () => {
    const templatePath = '../views/includePartialWithOption.olt';
    const result = render(templatePath);

    expect(result).to.equal(
      '<html>'
        + '<head>'
          + '<title>basic!</title>'
        + '</head>'
        + '<body>'
          + '<section>'
            + '<article>'
              + '<h1>This is basic template</h1>'
            + '</article>'
            + '<article>'
              + '<h1>partial</h1>'
              + '<p>template</p>'
            + '</article>'
          + '</section>'
        + '</body>'
      + '</html>',
    );
  });
});

describe('template including options and partial template', () => {
  it('should render a template including nested options', () => {
    const templatePath = '../views/includePartialAndOption.olt';
    const result = render(templatePath, { article: { title: 'partial', content: 'This is an article about partial.' } });

    expect(result).to.equal(
      '<html>'
        + '<head>'
          + '<title>basic!</title>'
        + '</head>'
        + '<body>'
          + '<section>'
            + '<article>'
              + '<h1>This is basic template</h1>'
            + '</article>'
            + '<article>'
              + '<h1>partial</h1>'
              + '<p>This is an article about partial.</p>'
            + '</article>'
          + '</section>'
        + '</body>'
      + '</html>',
    );
  });
});
