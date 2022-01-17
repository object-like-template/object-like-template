# object-like-view-template

## HOW TO START
### INSTALL

```
npm i olv
```

### EXPRESS
```
const olv = require('olv');

app.engine('olv', olv.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'olv');
```

## SYNTAX

### marks
|mark|definition|
|--|--|
|`()`|attributes. seperated by `,`|
|""|text|
|`:`|parent`:` child|
|`,`|child1`,` child2|
|`{}`|Tags out of block are not closed until block closed|
|`@{v}`|variable in options|
|`#{p}`|partial template|

### basic
#### olv
```
html : {
  head: title: "basic!"
  body: section: article: h1: "This is basic template"
}
```
#### html
```
<html>
  <head>
    <title>basic!</title>
  </head>
  <body>
    <section>
      <article>
        <h1>This is basic template</h1>
      </article>
    </section>
  </body>
</html>
```

### attributes
#### olv
```
div(style="display: flex; background-color: black;", class="black")
```
#### html
```
<div style="display: flex; background-color: black;" class="black"></div>
```

### options (varialbles)
#### olv
```
//heading.olv
h1(class="@{className}-heading"): "@{title}"

//express
res.render('heading.olv', { title: 'Object-like Template', className: 'red-line' });
```
#### html
```
<h1 class="red-line-heading">Object-like Template</h1>
```


### partial template
#### olv
```
//article.olv
article: {
  h1: "@{title}"
  p: "@{content}"
}

html : {
  head: title: "basic!"
  body: section: {
    article: h1: "This is basic template"
    #{article}(title="partial", content="This is an article about partial.")
  }
}

```
#### html
```
<html>
  <head>
    <title>basic!</title>
  </head>
  <body>
    <section>
      <article>
        <h1>This is basic template</h1>
      </article>
      <article>
        <h1>partial</h1>
        <p>This is an article about partial.</p>
      </article>
    </section>
  </body>
</html>
```

## Release note
`1.0.5` : Fix close parent when use `,` after text or a singelton tag

`1.0.6` : Clear Dependency

`1.0.7` : Minify Package
