# FEserver

## Installation

> Before starting, we assume that you're already have installed
> [Node.js](https://nodejs.org) (>= v8.9) & [MongoDB](https://www.mongodb.com) (>= v3.4).

### Installation

```shell
$ git clone https://git.easecreate.com/lmpj/feserver.git
$ npm install pm2 -g
$ cd feserver && npm run init
```

### Configuration

Find **src/config.js** to overwrite some
configuration.

### Launch

```shell
$ npm run dev
# Visit http://localhost:3000
```

### release

```shell
$ npm run release
# Visit http://localhost:3000
```
