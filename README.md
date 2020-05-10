2020-05-10

# Writing backwards compatible ES-Modules for NodeJs

> **WARNING**: This proposal will **NOT** work on **nodeJS >= 12.16.0**.  
> Problem seams to be related to [esm issue#868](https://github.com/standard-things/esm/issues/868).  
> Hopefully esm@>3.2.25 fixes this...

My aim here is to show a possibility on how to write ESM for node modules which
works on old node versions using [esm][] as well as natively for versions greater
equal than 14.

Please check the docs at [nodeJS ECMAScript Modules][] to get in touch with ESM in
nodeJS.

The important facts:

- `*.cjs` files are always sync loaded expecting CommonJs require/exports/module.exports
- `*.mjs` files are always async loaded expectin ES-Module import/export
- `*.js` depends on:
  - if _package.json_ contains `"type": "module",` then all are treated as `*.mjs`
  - otherwise as `*.cjs` files.
- `import` statements must include the file extension.
- There is no more `__dirname` or `__filename` available in ESM files.  
  You'll need to use the new method `url.fileURLToPath(import.meta.url)` instead.

## In packages

1. Install [esm][] `npm i esm`

2. Add the following to _package.json_

    ```json
    {
      "main": "./main.cjs",
      "type": "module",
      "exports": {
        "import": "./index.js",
        "require": "./main.cjs"
      },
    }
    ```

3. Create _main.cjs_ - see [esm][] docs.

    ```js
    /* eslint no-global-assign: off */
    require = require("esm")(module/*, options*/)
    module.exports = require("./index.js")
    ```

4. Now you are ready to use `import .. from '..'` in _index.js_

    Use `.js` extension for ESM and `.cjs` for commonJS reqires.

## In an application

1. Install [esm][] `npm i esm`

2. Add the following to _package.json_

    ```json
    {
      "main": "./main.cjs",
      "type": "module",
      "exports": {
        "import": "./index.js",
        "require": "./main.cjs"
      },
      "scripts": {
        "start": "node start.cjs",        
      },
    }
    ```

3. Create _main.cjs_

    ```js
    /* eslint no-global-assign: off */
    require = require("esm")(module/*, options*/)
    module.exports = require("./index.js")
    ```

4. Create the common starter script _start.cjs_  

    ```js
    const { fork } = require('child_process')
    const [ major ] = process.versions.node.split('.')

    if (major >= 14) {
      fork('./index.js')
    } else {
      fork('./main.cjs')
    }
    ```

4. Now you are ready to use `import .. from '..'` in _index.js_

5. Start your application with `npm start`

## Considerations

Check [Differences Between ES Modules and CommonJS](https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_differences_between_es_modules_and_commonjs).

If using ESM modules there will be no such variables like `__filename` or `__dirname`.

Instead it's required to use some snippet like this to achieve backwards
compatibility in every file where those variables are needed.

```js
import url from 'url'
import { dirname } from 'path'

const dirfilename = () => {
  const isESM = typeof __filename === 'undefined'
  const _filename = isESM
    ? url.fileURLToPath(import.meta.url)
    : __filename
  const _dirname = isESM
    ? dirname(_filename)
    : __dirname
  return { _dirname, _filename }
}

console.log(dirfilename())
```

### eslint

Don't try to use a _.eslintrc.js_ file as this would be considered as ESM module
because of its `.js` file extension. Use `.json` instead or include the config in
[_package.json_](https://eslint.org/docs/user-guide/configuring) under `eslintConfig`.  

## Running the example

```bash
git clone --depth 1 https://github.com/spurreiter/play-node-es-modules
npm i
npm start
# switch to node @12.15 - check `npm i -g n`
n 12.15
npm start
# switch to node @14
n 14
npm start
```

[esm]: https://github.com/standard-things/esm
[nodeJS ECMAScript Modules]: https://nodejs.org/dist/latest-v14.x/docs/api/esm.html
