# npm-auto

Auto installs npm dependencies from the script you want to run and runs the script

```
npm install npm-auto
```

## Usage

First install npm-auto

``` sh
npm install -g npm-auto
```

Then make a script that uses some dependencies

``` js
const hypercore = require('hypercore')
console.log('hypercore is', hypercore)
```

Then simply run the script with `npm-auto`.
It will `npm install` any deps used by the script if they are not resolvable already.

``` sh
npm-auto my-script.js

## use yarn
npm-auto my-script.js -r https://registry.npm.taobao.org -t yarn 
```

### config

| param | action                  |
| ----- | ----------------------- |
| `-r`  | set registry(npm/cnpm)  |
| `-t`  | set tool(npm/yarn/cnpm) |

No more manual npm installs for gists!

## License

MIT
