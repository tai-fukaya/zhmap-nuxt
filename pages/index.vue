<template>
  <div class="container">
    <!-- タイトル -->
    <!-- 検索結果表示エリア -->
    <!-- 地図データ表示エリア -->
    <!-- 検索ワード入力エリア -->
    <!-- 使い方の表示エリア -->
    <div>
      <logo />
      <h1 class="title">
        study
      </h1>
      <h2 class="subtitle">
        Nuxt.js study
      </h2>
      <div class="links">
        {{mapData.length}}
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
  data: () => {
    return {
      mapData: [], // これ自体は更新チェックの対象から外したい
      seachedData: []
    }
  },
  async mounted() {
    // 遅延読み込みでいいので、createdでやってもいいかも？
    const {data} = await this.getCsvData()
    const mapData = this.csvToMapData(data)
    this.$data.mapData = mapData
  },
  computed: {
    posts () {
      return this.$store.state.posts.all
    }
  },
  methods: {
    async getCsvData() {
      return await this.$axios.get(`${this.$axios.defaults.baseURL}data.csv`)
    },
    // FIXME store のほうに移す
    csvToMapData(csvData) {
      let items = []
      let lines = csvData.split('\n')
      for (let line in lines) {
        let splitted = line.split(',')
        // display_id, search_id, ministry, province, city, town, area_level, latitude, longitude
        if (splitted.length === 9) {
          console.log('error', splitted)
        }
        let item = {
          displayId: splitted[0],
          searchId: splitted[1],
          ministry: splitted[2],
          province: splitted[3],
          city: splitted[4],
          town: splitted[5],
          areaLevel: parseInt(splitted[6]),
          latitude: parseInt(splitted[7]),
          longitude: parseInt(splitted[8]),
        }
        items.push(item)
      }
      return items
    },
    searchMapData(searchText) {
      // 何も設定しない場合、search_idに検索をかける
      // mはじまりは、ministryに、同様に、p, c, tに関しては、province, city, townを
      // a始まりの場合、ministry, province, city, town全部にOR検索する
      // m,p,c,tの場合は、AND検索とする（複数指定の場合）
      console.log(searchText.split(','))
    },
    searchById(items, searchId) {

    },
    searchByMinistry(items, searchText) {

    },
    searchByProvince(items, searchText) {

    },
    searchByCity(items, searchText) {

    },
    searchByTown(items, searchText) {

    }
  }
}
// データの取得&表示
// 入力値によって、色を変える
// 検索結果の一番はじめのデータを表示する
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
