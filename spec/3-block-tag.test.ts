import { expect } from 'chai';

import render from '../lib/render';

describe('block tags', () => {
  it('should not tag before "{" until "}', () => {
    const template = 'body: {\n  section: article, article \n  section: article}';
    const result = render(template);

    expect(result).to.equal(
      `<body>
  <section>
    <article></article>
    <article></article>
  </section>
  <section>
    <article></article>
  </section>
</body>`,
    );
  });

  it('should throw syntax error when block is not closed', () => {
    const template = 'body: {\n  section: article \n  section: article';

    expect(render(template)).to.throw(SyntaxError, 'Unclosed Block (need “}”)');
  });
});
