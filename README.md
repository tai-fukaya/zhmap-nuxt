# study

> Nuxt.js study

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## gh-pages へのデプロイ
nuxt.config.jsに以下を追加する
```
  router: {
    base: '/zhmap-nuxt/'
  },
```
```
$ yarn build
$ yarn generate
$ yarn deploy
```
もっとうまいやり方は、あるはず