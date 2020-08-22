<template>
  <div class="container">
    <!-- 検索結果表示エリア -->
    <!-- 地図データ表示エリア -->
    <!-- 検索ワード入力エリア -->
    <!-- 使い方の表示エリア -->
    <div class="search-bar">
      <p class="search-bar-title">Search Word:</p><input v-model="searchWord" @keyup="searchMapData" placeholder="110101002" class="search-word">
    </div>
    <div class="search-result">
      <p><span class="search-result-title">Result:</span> {{searchedData.length}} / {{mapData.length}}</p>
      <p><span class="search-result-title">Id:</span> {{firstSearchedData.displayId}}</p>
      <p><span class="search-result-title">Ministry:</span> {{firstSearchedData.ministry}}</p>
      <p><span class="search-result-title">Province:</span> {{firstSearchedData.province}}</p>
      <p><span class="search-result-title">City:</span> {{firstSearchedData.city}}</p>
      <p><span class="search-result-title">Town:</span> {{firstSearchedData.town}}</p>
      <p><span class="search-result-title">Latitude:</span> {{firstSearchedData.showLatitude.toFixed(7)}}</p>
      <p><span class="search-result-title">Longitude:</span> {{firstSearchedData.showLongitude.toFixed(7)}}</p>
    </div>
  </div>
</template>

<script>
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
  data: () => {
    return {
      searchWord: "",
      mapData: [], // これ自体は更新チェックの対象から外したい
      searchedData: [],
    }
  },
  async mounted() {
    // 遅延読み込みでいいので、createdでやってもいいかも？
    const {data} = await this.getCsvData()
    const mapData = this.csvToMapData(data)
    this.$data.mapData = mapData
  },
  computed: {
    firstSearchedData() {
      if (this.$data.searchedData.length > 0) {
        return this.$data.searchedData[0]
      } else {
        return {
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
          showLongitude: parseInt(splitted[8])/ 10000000
        }
        items.push(item)
      }
      console.log(items[0].searchId, items[1].searchId)
      return items
    },
    searchMapData() {
      // 何も設定しない場合、search_idに検索をかける
      // mはじまりは、ministryに、同様に、p, c, tに関しては、province, city, townを
      // a始まりの場合、ministry, province, city, town全部にOR検索する
      // m,p,c,tの場合は、AND検索とする（複数指定の場合）
      let keywords = event.target.value.split(',').map(x => x.trim())
      let result = this.$data.mapData
      for (let keyword of keywords) {
        if (/^\d+$/.test(keyword)) {
          result = this.searchById(result, keyword)
        } else if (/^[ampct]\s*:/.test(keyword)) {
          let commands = keyword.split(':').map(x => x.trim())
          console.log(commands)
        }
      }
      this.$data.searchedData = result;
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
.search-bar-title,
.search-result-title {
  width: 100px;
  display: inline-block;
  text-align: right;
}
.search-bar {
  width:100%;
  padding: 0 20px;
}
.search-word {
  display: inline-block;

  width: calc(100% - 100px);
  border: 0px;
  border-bottom: 1px solid #000000;

  font-family:monospace;
}
</style>
