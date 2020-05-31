<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        study
      </h1>
      <h2 class="subtitle">
        Nuxt.js study
      </h2>
      <div class="links">
        <nuxt-link
          v-for="post in posts"
          :to="{name: 'posts-id', params: {id: post.id}}"
          :key="post.id"
          class="button--grey"
        >
          {{post.title}}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  head() {
    return {
      title: 'Home Page 🍕',
      meta: [
        { name: 'twitter:title', content: 'Nuxt Fundamentals by Vue School'},
        { name: 'twitter:description', content: 'Nuxt + Vue School = 🍕'},
        { name: 'twitter:image', content: 'https://i.imgur.com/UYP2umJ.png'},
        { name: 'twitter:card', content: 'summary_large_image'}
      ]
    }
  },
  async mounted() {
    console.log('mounted')
    const {data} = await this.getMapData()
    this.$data.latlngdata = data
  },
  computed: {
    posts () {
      return this.$store.state.posts.all
    }
  },
  methods: {
    async getMapData() {
      return await this.$axios.get(`${this.$axios.defaults.baseURL}data.csv`)
    }
  }
}
// データの取得&表示
// 入力値によって、色を変える
// 入力値が一意になったら、その情報を表示する
// 入力されたデータの範囲でズームする
// マウスオーバー時に、その周りのデータを表示する（情報を表示する）
</script>

<style scoped>
.container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
}

.links {
  padding-top: 15px;
}
</style>
