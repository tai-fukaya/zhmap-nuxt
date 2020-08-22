中国の行政区画を番号で検索して、表示する
ProcessingのBen Fry本にあったアメリカの地図検索の中国語版

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

# 参考になりそうなサイト
## Axios
https://github.com/vueschool/nuxt-async-data/commits/master  
https://www.storyblok.com/tp/nuxt-js-multilanguage-website-tutorial
