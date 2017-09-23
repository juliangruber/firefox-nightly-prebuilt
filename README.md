
# firefox-nightly-prebuilt

Use prebuilt [FirefoxNightly](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly) binaries.

This caches Nightlys on disk, for at most day.

__Work in progress__: This currently only works on macOS. Pull requests welcome!

## Usage

First install the module, which downloads FirefoxNightly unless you have the current nightly cached already:

```bash
$ npm install --save firefox-nightly-prebuilt
```

Then get the path to the executable in Node:

```js
const firefox = require('firefox-nightly-prebuilt')
console.log(firefox)

// for example:
spawn(firefox, ['-headless'])
```

## License

MIT
