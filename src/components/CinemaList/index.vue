<template>
  <div class="cinema_body">
    <Loading v-if="isLoading"></Loading>
    <Scroller v-else :handleToScroll='handleToScroll' :handleToTouchEnd='handleToTouchEnd'>
      <ul>
        <li class="pullDown">{{pullDownMsg}}</li>
        <li v-for="item in cinemas" :key="item.id">
          <div class="title">
            <span>{{item.nm}}</span>
            <span class="q">
              <span class="price">{{item.sellPrice}}</span> 元起
            </span>
          </div>
          <div class="address">
            <span>{{item.addr}}</span>
            <span>{{item.distance}}</span>
          </div>
          <div class="card">
            <div
              v-for="(value,name) in item.tag"
              v-show="value === 1"
              :key="name"
              :class="name | classTag"
            >{{name | formatTag}}</div>
          </div>
        </li>
      </ul>
    </Scroller>
  </div>
</template>

<script>
export default {
  name: 'CinemaList',
  data () {
    return {
      cinemas: [],
      isLoading: true,
      prevCityId: -1,
      pullDownMsg: ''
    }
  },
  activated () {
    const cityId = this.$store.state.City.id
    if (this.prevCityId === cityId) { return }
    this.isLoading = true

    this.axios.get('/api/cinemaList?cityId=' + cityId).then(res => {
      console.log(res)
      const msg = res.data.msg
      if (msg === 'ok') {
        this.cinemas = res.data.data.cinemas
        console.log(this.cinemas)

        this.prevCityId = cityId

        this.isLoading = false
      }
    })
  },
  filters: {
    formatTag (name) {
      const tags = [
        { key: 'allowRefund', value: '改签' },
        { key: 'endorse', value: '退' },
        { key: 'sell', value: '折扣卡' },
        { key: 'snack', value: '小吃' }
      ]
      // console.log(tags)
      // tags.map((e, i, arr) => {
      //   if (tags[i].key === name) {
      //     return tags[i].value
      //   }
      // })
      // return ''
      return (
        (tags.find(e => e.key === name) &&
          tags.find(e => e.key === name).value) ||
        ''
      )
    },
    classTag (name) {
      const tags = [
        { key: 'allowRefund', value: 'bl' },
        { key: 'endorse', value: 'bl' },
        { key: 'sell', value: 'or' },
        { key: 'snack', value: 'or' }
      ]
      return (
        (tags.find(e => e.key === name) &&
          tags.find(e => e.key === name).value) ||
        ''
      )
    }
  },
  methods: {
    handleToScroll (pos) {
      if (pos.y > 30) {
        this.pullDownMsg = '正在更新中...'
      }
    },
    handleToTouchEnd (pos) {
      const cityId = this.$store.state.City.id
      if (pos.y > 30) {
        this.axios.get('/api/cinemaList?cityId=' + cityId).then(res => {
          console.log(res)
          const msg = res.data.msg
          if (msg === 'ok') {
            this.pullDownMsg = '更新成功'
            setTimeout(() => {
              this.cinemas = res.data.data.cinemas
              console.log(this.cinemas)
              this.pullDownMsg = ''
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#content .cinema_body {
  flex: 1;
  overflow: auto;
}
.cinema_body ul {
  padding: 0 20px;
}
.cinema_body li {
  border-bottom: 1px solid #e6e6e6;
  // margin-bottom: 20px;
}

.cinema_body li .title{
  margin: 10px 0;
}

.cinema_body div {
  margin-bottom: 10px;
}
.cinema_body .q {
  font-size: 11px;
  color: #f03d37;
}
.cinema_body .price {
  font-size: 18px;
}
.cinema_body .address {
  font-size: 13px;
  color: #666;
  display: flex;
}
.cinema_body .address span:first-of-type {
  display: block;
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cinema_body .address span:nth-of-type(2) {
  // float: right;
  width: 100px;
  text-align: right;
}
.cinema_body .card {
  display: flex;
}
.cinema_body .card div {
  padding: 0 3px;
  height: 15px;
  line-height: 15px;
  border-radius: 2px;
  color: #f90;
  border: 1px solid #f90;
  font-size: 13px;
  margin-right: 5px;
}
.cinema_body .card div.or {
  color: #f90;
  border: 1px solid #f90;
}
.cinema_body .card div.bl {
  color: #589daf;
  border: 1px solid #589daf;
}
</style>
