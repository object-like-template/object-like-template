import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import render from '../lib/render';

describe('partial template', () => {
  it('should render a partial template', () => {
    const template = '#{partial}';
    const result = render(template);
    const partialTemplate = fs.readFileSync(path.join(__dirname, 'partial.olt'), 'utf-8');
    const renderedPartial = render(partialTemplate);

    expect(result).to.equal(renderedPartial);
  });
});
