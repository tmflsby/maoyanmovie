<template>
  <div class="city_body">
    <div class="city_list">
      <Loading v-if="isLoading"></Loading>
      <Scroller v-else ref="city_list">
        <div>
          <div class="city_hot">
            <h2>热门城市</h2>
            <ul class="clearfix">
              <li
                v-for="item in hotList"
                :key="item.id"
                @tap="handleToCity(item.nm,item.id)"
              >{{item.nm}}</li>
            </ul>
          </div>
          <div class="city_sort" ref="city_sort">
            <div v-for="item in cityList" :key="item.id">
              <h2>{{item.index}}</h2>
              <ul>
                <li
                  v-for="itemList in item.list"
                  :key="itemList.id"
                  @tap="handleToCity(itemList.nm,itemList.id)"
                >{{itemList.nm}}</li>
              </ul>
            </div>
          </div>
        </div>
      </Scroller>
    </div>
    <div class="city_index">
      <ul>
        <li
          v-for="(item,index) in cityList"
          :key="item.index"
          @touchstart="handleToIndex(index)"
          @touchstart.prevent='handleTouchStart'
          @touchmove='handleTouchMove'
          @touchend='handleTouchEnd'
        >{{item.index}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'City',
  data () {
    return {
      cityList: [],
      hotList: [],
      isLoading: true,
      touchStatus: false,
      startY: 0,
      timer: null
    }
  },
  mounted () {
    const cityList = window.localStorage.getItem('cityList')
    const hotList = window.localStorage.getItem('hotList')

    if (cityList && hotList) {
      this.cityList = JSON.parse(cityList)
      this.hotList = JSON.parse(hotList)

      this.isLoading = false
    } else {
      this.axios.get('/api/cityList').then(res => {
        console.log(res)
        const msg = res.data.msg
        if (msg === 'ok') {
          const cities = res.data.data.cities
          const { cityList, hotList } = this.formatCityList(cities)
          this.cityList = cityList
          this.hotList = hotList

          window.localStorage.setItem('cityList', JSON.stringify(cityList))
          window.localStorage.setItem('hotList', JSON.stringify(hotList))

          this.isLoading = false
        }
      })
    }
  },
  methods: {
    formatCityList (cities) { // 城市分组
      const cityList = []
      const hotList = []

      cities.map((e, i, arry) => { // 热门城市
        if (cities[i].isHot === 1) {
          hotList.push(cities[i])
        }
      })

      cities.map((e, i, arr) => { // 根据拼音来进行ABC分组
        const firstLetter = cities[i].py.substring(0, 1).toUpperCase()
        if (toCom(firstLetter)) {
          cityList.push({
            index: firstLetter,
            list: [{ nm: cities[i].nm, id: cities[i].id }]
          })
        } else {
          cityList.map((e, j, arr) => {
            if (cityList[j].index === firstLetter) {
              cityList[j].list.push({ nm: cities[i].nm, id: cities[i].id })
            }
          })
        }
      })

      function toCom (firstLetter) {
        for (let i = 0; i < cityList.length; i++) {
          if (cityList[i].index === firstLetter) {
            return false
          }
        }
        return true
      }

      cityList.sort((n1, n2) => { // 排序
        if (n1.index > n2.index) {
          return 1
        } else if (n1.index < n2.index) {
          return -1
        } else {
          return 0
        }
      })

      console.log(cityList)
      console.log(hotList)
      return { cityList, hotList }
    },
    handleToIndex (index) { // 点击ABCD跳转到ABCD相应的城市位置
      // console.log(index)
      const h2 = this.$refs.city_sort.getElementsByTagName('h2')
      // this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop
      this.$refs.city_list.toScrollTop(-h2[index].offsetTop)
    },
    handleTouchStart () {
      this.touchStatus = true
    },
    handleTouchMove (e) {
      if (this.touchStatus) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          // const startY = this.$refs['A'][0].offsetTop
          // console.log(startY)
          const touchY = e.touches[0].clientY - 130
          // console.log(touchY)
          const index = Math.floor((touchY - this.startY) / 20.67)
          // console.log(index)
          if (index >= 0 && index < this.cityList.length) {
            const h2 = this.$refs.city_sort.getElementsByTagName('h2')
            this.$refs.city_list.toScrollTop(-h2[index].offsetTop)
          }
        }, 16)
      }
    },
    handleTouchEnd () {
      this.touchStatus = false
    },
    handleToCity (nm, id) {
      this.$store.commit('City/CITY_INFO', { nm, id })
      window.localStorage.setItem('nowNm', nm)
      window.localStorage.setItem('nowId', id)
      this.$router.push('/movie/nowPlaying')
    }
  }
}
</script>

<style lang="scss" scoped>
#content .city_body {
  margin-top: 45px;
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}
.city_body .city_list {
  flex: 1;
  overflow: auto;
  background: #fff5f0;
}
.city_body .city_list::-webkit-scrollbar {
  background-color: transparent;
  width: 0;
}
.city_body .city_hot {
  /*margin-top: 20px;*/
}
.city_body .city_hot h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_hot ul li {
  float: left;
  background: #fff;
  width: 29%;
  height: 33px;
  margin-top: 15px;
  margin-left: 3%;
  padding: 0 4px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  line-height: 33px;
  text-align: center;
  box-sizing: border-box;
}
.city_body .city_sort div {
  margin-top: 20px;
}
.city_body .city_sort h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_sort ul {
  padding-left: 10px;
  margin-top: 10px;
}
.city_body .city_sort ul li {
  line-height: 30px;
  line-height: 30px;
}
.city_body .city_index {
  width: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-left: 1px #e6e6e6 solid;
}
</style>
