import express from 'express';
import request from 'supertest';
import path from 'path';
import { expect } from 'chai';

import olt from '../lib/engine';

const app = express();

describe('express view engine', () => {
  before(() => {
    app.engine('olt', olt);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'olt');
  });

  it('should render basic template', (done) => {
    app.get('/basic', (req: express.Request, res: express.Response) => {
      res.render('basic', (err: Error, html: string) => {
        if (err) {
          res.status(500).json({ err: err.message });
          return;
        }

        res.send(html);
      });
    });

    request(app)
      .get('/basic')
      .expect(200)
      .expect('Content-Type', /html/)
      .end((err: unknown, res: request.Response) => {
        if (err) done();

        expect(res.text).to.include('basic!');
        expect(res.text).to.include('<h1>');
        expect(res.text).to.include('This is basic template');

        done();
      });
  });

  it('should render template with options', (done) => {
    app.get('/options', (req: express.Request, res: express.Response) => {
      res.render('includeOptions', { title: 'This is template with options' }, (err: Error, html: string) => {
        if (err) {
          res.status(500).json({ err: err.message });
          return;
        }

        res.send(html);
      });
    });

    request(app)
      .get('/options')
      .expect(200)
      .expect('Content-Type', /html/)
      .end((err: unknown, res: request.Response) => {
        if (err) done();

        expect(res.text).to.include('basic!');
        expect(res.text).to.include('<h1>');
        expect(res.text).to.include('This is template with options');

        done();
      });
  });

  it('should render a template including partial template', (done) => {
    app.get('/partial', (req: express.Request, res: express.Response) => {
      res.render('includePartial', (err: Error, html: string) => {
        if (err) {
          res.status(500).json({ err: err.message });
          return;
        }

        res.send(html);
      });
    });

    request(app)
      .get('/partial')
      .expect(200)
      .expect('Content-Type', /html/)
      .end((err: unknown, res: request.Response) => {
        if (err) done();

        expect(res.text).to.include('basic!');
        expect(res.text).to.include('<article>');
        expect(res.text).to.include('This is an article about partial.');

        done();
      });
  });

  it('should render a template including partial with option', (done) => {
    app.get('/partial/option', (req: express.Request, res: express.Response) => {
      res.render('includePartialWithOption', (err: Error, html: string) => {
        if (err) {
          res.status(500).json({ err: err.message });
          return;
        }

        res.send(html);
      });
    });

    request(app)
      .get('/partial/option')
      .expect(200)
      .expect('Content-Type', /html/)
      .end((err: unknown, res: request.Response) => {
        if (err) done();

        expect(res.text).to.include('<article>');
        expect(res.text).to.include('partial');
        expect(res.text).to.include('template');

        done();
      });
  });

  it('should render a template including nested options', (done) => {
    app.get('/nestedOptions', (req: express.Request, res: express.Response) => {
      res.render('includePartialAndOption', { article: { title: 'partial', content: 'This is an article about partial.' } }, (err: Error, html: string) => {
        if (err) {
          res.status(500).json({ err: err.message });
          return;
        }

        res.send(html);
      });
    });

    request(app)
      .get('/nestedOptions')
      .expect(200)
      .expect('Content-Type', /html/)
      .end((err: unknown, res: request.Response) => {
        if (err) done();

        expect(res.text).to.include('<article>');
        expect(res.text).to.include('partial');
        expect(res.text).to.include('This is an article about partial.');

        done();
      });
  });
});
