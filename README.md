# Sitory

<img src="assets/sitory.svg" width="128" height="128" align="right">

*Sitory* is a dead-simple static website generator written in TypeScript using [Marked](https://marked.js.org/) and [handlebars](https://handlebarsjs.com/).

## Installing

Just run:

```bash
yarn global add sitory
```

Or, if you prefer npm:

```bash
npm install -g sitory
```

## Quick Start

Just run the following commands:

```bash
sitory init <path>
cd <path>
sitory build
sitory serve
```

This will create a new folder called ```path```, initialize a default *sitory* website inside that folder, and serve it at the default port 3000.

Then open http://localhost:3000 to see your brand new *sitory* website.

## Usage

```bash
sitory <command>

Commands:
  sitory init  [path]       initialize a sitory site in the current directory
  sitory build [-c config]  build the site
  sitory serve [-p port]    start a webserver serving the site

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  sitory init           Initialize a sitori website at the current directory
  sitory build          Build the sitori website at the current directory
  sitory serve          Serve the website at http://localhost:3000
  sitory serve -p 5000  Serve the website at http://localhost:5000
```

## How does it Work

When you run ```sitory build``` in a folder with a *sitory* project, *sitory* will generate a static website in the ```public``` folder inside that path.

1. All files in ```assets``` are copied directly to ```public```.
2. Files in ```content``` are also copied to ```public```, except if they are markdown (```.md```) files.
3. Markdown files in ```content``` are transformed into ```html``` files and copied to ```public```. If the file is called ```index.md```, then ```sitory``` will copy the corresponding ```index.html``` file to the same folder in ```public```, otherwise ```sitory``` will create a new folder with the same name as the file. This allows accessing a file called ```info.md``` in the browser at ```info/``` instead of ```info.html```.
4. When creating an HTML file, *sitory* will use a [handlebars](https://handlebarsjs.com/) template present in the ```layouts/pages``` folder. By default, this template will be called ```default.hbs``` but this can be changed for a particular folder or file.
5. Both *page layout* files and *markdown* files can use *handlebars* [partials](https://handlebarsjs.com/guide/partials.html) stored inside ```layouts/partials```. Use this to create parts of your layouts that are repeated (*e.g.*, a header) or small HTML snippets that you can call from your markdown content. You can also pass variables to your partial files.
6. You can create variables in three different places; in a root ```config.yaml``` file, in a ```config.yaml``` inside any folder in ```content```, or in the preamble of any *markdown* file. Variables will propagate and be replaced, starting from the root *config file*, each folder's *config file*, and finally the variables in the *preamble*. These variables can be used in *layouts* and *partials* as ```data.name```. 
7. Some variables have special meanings:
  - template: is the template's name to be used (default is **default**).
  - baseURL: is the base URL of the generated site (default is **/**).
8. You can have yaml files in the ```data``` folder that can be read into a variable using the special syntax ```=<filename>=``` (The ```<``` and ```>``` are not part of it). These can be read anywhere a variable can be set.


## A Complete Example

1. Set the ```title``` variable in ```/config.yaml``` to 'Sitory Example':

```yaml
title: Sitory Example
```

2. Create ```content/books/config.yaml```:

```yaml
title: Sitory Example | Books
```

Now, inside the ```books``` folder, all pages will receive this updated ```title``` variable.

3. Replace the generated /content/index.md with:

```markdown
[books](books)
```

4. Replace the generated ```/layouts/pages/default.hbs``` so that it uses the ```title``` variable:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="{{ data.baseUrl }}css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ data.title }}</title>
  </head>
  <body>
    <a href="{{ data.baseUrl }}"><h1>{{ data.title }}</h1></a>
    {{{ content }}}
  </body>
</html>
```

5. Create a data file in ```data/books.yaml```:

```yaml
- title: Dune
  author: Frank Herbert
  year: 1965
- title: Do androids dream of electic sheep?
  author: Philip K. Dick 
  year: 1968
```

6. Create a new page at ```/content/books/index.md``` with:

```markdown
---
template: book-list
books: =books.yaml=
---
These are some of my books:
```

7. Create a new ```/layouts/pages/book-list.hbs``` that can display a list of books:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="{{ data.baseUrl }}css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ data.title }}</title>
  </head>
  <body>
    <a href="{{ data.baseUrl }}"><h1>{{ data.title }}</h1></a>
    {{{ content }}}
    <ul>
      {{#each data.books}}{{>book book=this}}{{/each}}
    </ul>
  </body>
</html>
```

8. Create a new partial at ```layouts/partials/book.hbs``` with:

```html
<li>{{book.title}} by {{book.author}} ({{book.year}})</li>
```

9. Now, lets call this partial from the book-list template. Replace the ```each``` loop with:

```html
{{#each data.books}}{{>book book=this}}{{/each}}
```

10. Create another partial at ```layouts/partials/head.hbs``` with:

```html
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="{{ data.baseUrl }}css/style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ data.title }}</title>
</head>
```

11. Replace this code in both page layouts with a call to the partial:

```html
{{>head}}
```

12. Finally, adjust ```assets/css/style.css``` to your liking!