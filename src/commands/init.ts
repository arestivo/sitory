import * as fs from 'fs-extra'

export function init(path: string) {
  if (fs.existsSync(path) && !fs.statSync(path).isDirectory()) {
    console.log(`\x1B[31mPath ${path} exists and is not a folder`)
    return
  }


  if (fs.existsSync(path) && fs.readdirSync(path).length > 0) {
    console.log(`\x1B[31mFolder ${path} is not empty`)
    return
  }

  fs.ensureDirSync(`${path}`)
  fs.ensureDirSync(`${path}/assets`)
  fs.ensureDirSync(`${path}/assets/css`)
  fs.ensureDirSync(`${path}/content`)
  fs.ensureDirSync(`${path}/data`)
  fs.ensureDirSync(`${path}/layouts`)
  fs.ensureDirSync(`${path}/layouts/partials`)
  fs.ensureDirSync(`${path}/layouts/pages`)

  console.log('Created folder structure')

  const template = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="{{baseUrl}}css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitory Example</title>
  </head>
  <body>
  {{{ content }}}
  </body>
</html>
  `

  const css = `
@import url('https://fonts.googleapis.com/css?family=Atkinson+Hyperlegible:400|Poppins:400');

html {font-size: 112.5%;} /*18px*/

body {
  background: white;
  font-family: 'Atkinson Hyperlegible', sans-serif;
  font-weight: 400;
  line-height: 1.75;
  color: #000000;
  max-width: 60em;
  margin: 0 auto;
}

p {margin-bottom: 1rem;}

h1, h2, h3, h4, h5 {
  margin: 3rem 0 1.38rem;
  font-family: 'Poppins', serif;
  font-weight: 400;
  line-height: 1.3;
}

h1 {
  margin-top: 0;
  font-size: 3.052rem;
}

h2 {font-size: 2.441rem;}

h3 {font-size: 1.953rem;}

h4 {font-size: 1.563rem;}

h5 {font-size: 1.25rem;}

small, .text_small {font-size: 0.8rem;}
  `

  const page = `
# Vestibulum lobortis nisi quis libero.

Aenean non tortor non massa viverra semper at non magna. Proin eleifend, libero eu efficitur molestie, orci enim suscipit nibh, eget euismod dui orci pharetra lacus. Quisque facilisis consectetur iaculis. Morbi in justo et turpis efficitur mattis. Nunc urna ligula, tincidunt vel sapien a, venenatis lobortis magna. Aliquam in eros in quam faucibus pellentesque. Donec eget vehicula ante. Suspendisse potenti. Vivamus faucibus sagittis rhoncus.

## Proin viverra porttitor odio, vitae.

Maecenas et venenatis arcu, vel hendrerit enim. Mauris sed posuere mi, eu porttitor ex. Nulla maximus, quam dignissim euismod consequat, turpis sem luctus erat, in faucibus lectus felis a odio. Cras auctor odio at viverra consequat. Mauris tincidunt, neque eget ornare tempor, lectus tellus volutpat quam, tincidunt tincidunt nunc ante nec nulla. Mauris volutpat est eget blandit rhoncus. Ut congue pharetra massa vel placerat. Etiam fermentum eget orci ut pharetra. Etiam mattis diam quis pulvinar mollis. Maecenas cursus, urna sit amet commodo hendrerit, erat arcu condimentum dolor, sit amet dictum turpis dui in purus.

## Morbi vitae vehicula dolor, vitae.

Donec vel sapien imperdiet, varius est eget, tincidunt nisl. Quisque sollicitudin, erat sollicitudin malesuada tincidunt, magna nunc ullamcorper erat, sed vestibulum lacus nisl vel metus. Ut ac vulputate augue. Proin sit amet nisi fringilla, maximus nibh sed, tempus lectus. Nunc sit amet fringilla quam. Duis vel dapibus erat, et ullamcorper tortor. Integer lacus felis, congue in ante sit amet, cursus tempus purus.
  `

  const config = `
baseUrl: /
template: default
  `

  fs.writeFileSync(`${path}/assets/css/style.css`, css.trim())
  console.log('Created a default stylesheet in assets/css/style.css')
  fs.writeFileSync(`${path}/content/index.md`, page.trim())
  console.log('Created a default markdown page in content/index.md')
  fs.writeFileSync(`${path}/content/config.yaml`, config.trim())
  console.log('Created a default configuration in content/config.yaml')
  fs.writeFileSync(`${path}/layouts/pages/default.hbs`, template.trim())
  console.log('Created a default page layout in layouts/pages/default.hbs')
}