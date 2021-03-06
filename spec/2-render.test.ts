import { expect } from 'chai';
import path from 'path';

import render from '../lib/render';

describe('basic template', () => {
  it('should render a basic template', () => {
    const templatePath = path.join(__dirname, 'views', 'basic.olv');
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
    const templatePath = path.join(__dirname, 'views', 'notExist.olv');

    expect(() => render(templatePath)).to.throw('Invalid template path');
  });
});

describe('template including options', () => {
  it('should render a template including options', () => {
    const templatePath = path.join(__dirname, 'views', 'includeOptions.olv');
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
    const templatePath = path.join(__dirname, 'views', 'includePartial.olv');
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
    const templatePath = path.join(__dirname, 'views', 'includePartialWithOption.olv');
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
    const templatePath = path.join(__dirname, 'views', 'includePartialAndOption.olv');
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
