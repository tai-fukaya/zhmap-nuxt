<template>
  <div class="container">

    <!-- 使い方の表示エリア -->
    <!-- 検索ワード入力エリア -->
    <div class="search-bar">
      <input v-model="searchWord" @keyup="searchMapData" placeholder="110101002(area code)" class="search-word">
    </div>
    <!-- 検索結果表示エリア -->
    <div class="search-result">
      <p><span class="search-result-title">Result:</span> {{searchCount}} / {{mapData.length}}</p>
      <p><span class="search-result-title">Area Code:</span> {{firstSearchedData.displayId}}</p>
      <p><span class="search-result-title">Ministry:</span> {{firstSearchedData.ministry}}</p>
      <p><span class="search-result-title">Province:</span> {{firstSearchedData.province}}</p>
      <p><span class="search-result-title">City:</span> {{firstSearchedData.city}}</p>
      <p><span class="search-result-title">Town:</span> {{firstSearchedData.town}}</p>
      <p><span class="search-result-title">Latitude:</span> {{firstSearchedData.showLatitude.toFixed(7)}}</p>
      <p><span class="search-result-title">Longitude:</span> {{firstSearchedData.showLongitude.toFixed(7)}}</p>
    </div>

    <!-- 地図データ表示エリア -->
    <the-map-view :map-data="mapData" :searched-ids="searchedIds" />
  </div>
</template>

<script>
import TheMapView from '~/components/TheMapView.vue'

export default {
  head() {
    return {
      title: 'Chinese Map Search',
      meta: [
        { name: 'twitter:title', content: 'Chinese Map Search'},
        { name: 'twitter:description', content: 'Search chinese map by areacode'},
        { name: 'twitter:image', content: 'https://i.imgur.com/UYP2umJ.png'},
        { name: 'twitter:card', content: 'summary_large_image'}
      ]
    }
  },
  components: {
    TheMapView
  },
  data: () => {
    return {
      searchWord: "",
      mapData: [], // これ自体は更新チェックの対象から外したい
      searchedIds: [],
    }
  },
  async mounted() {
    // 遅延読み込みでいいので、createdでやってもいいかも？
    const {data} = await this.getCsvData()
    const mapData = this.csvToMapData(data)
    this.$data.mapData = mapData
  },
  computed: {
    searchCount() {
      return this.$data.mapData.filter(item => item.searched).length
    },
    firstSearchedData() {
      return this.$data.mapData.find(item => item.searched) || {
          displayId: "",
          ministry: "",
          province: "",
          city: "",
          town: "",
          areaLevel: "",
          showLatitude: 0.0,
          showLongitude: 0.0
      }
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
      for (let line of lines) {
        let splitted = line.split(',')
        // display_id, search_id, ministry, province, city, town, area_level, latitude, longitude
        if (splitted.length != 9) {
          console.log('error', splitted)
        }
        // FIXME ここらへんも共通化する
        let item = {
          displayId: splitted[1].padEnd(12, '0'),
          searchId: splitted[1],
          ministry: splitted[2],
          province: splitted[3],
          city: splitted[4],
          town: splitted[5],
          areaLevel: parseInt(splitted[6]),
          latitude: parseInt(splitted[7]),
          longitude: parseInt(splitted[8]),
          showLatitude: parseInt(splitted[7])/ 10000000,
          showLongitude: parseInt(splitted[8])/ 10000000,
          searched: false,
        }
        items.push(item)
      }
      return items
    },
    searchMapData() {
      // 何も設定しない場合、search_idに検索をかける
      // mはじまりは、ministryに、同様に、p, c, tに関しては、province, city, townを
      // a始まりの場合、ministry, province, city, town全部にOR検索する
      // m,p,c,tの場合は、AND検索とする（複数指定の場合）
      let functions = event.target.value.split(',').map(x => {
        let commands = x.split(':').map(x => x.trim())
        // console.log(commands)
        if (/^\d+$/.test(commands[0])) {
          return this.funcIsMatchById(commands[0])
        }
        return
      }).filter(x => x != null)
      // console.log(functions)
      let result = this.$data.mapData.map(item => {
        item.searched = functions.find(func => func(item))
        return item
      })
      this.$data.mapData = result
    },
    funcIsMatchById(searchId) {
      return item => item.searchId.indexOf(searchId) === 0
    },
    searchById(items, searchId) {
      return items.filter(item => item.searchId.indexOf(searchId) === 0)
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
</script>

<style scoped>
.search-result {
  margin: 0 20px;
}
.search-result-title {
  width: 100px;
  display: inline-block;
  text-align: right;
  vertical-align: bottom;
}
.search-bar {
  width:100%;
  padding: 0 20px;
}
.search-word {
  display: inline-block;

  width: 100%;
  border: 0px;
  border-bottom: 1px solid #000000;

  font-family: 'Courier New', monospace;
}
</style>
