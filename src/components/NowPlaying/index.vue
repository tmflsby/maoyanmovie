<template>
  <div class="movie_body">
    <Loading v-if="isLoading"></Loading>
    <Scroller v-else ref="scroller" :handleToScroll='handleToScroll' :handleToTouchEnd='handleToTouchEnd'>
      <ul ref="ul">
        <li class="pullDown">{{pullDownMsg}}</li>
        <li v-for="item in movieList" :key="item.id">
          <div class="pic_show" @tap="handleToDetail(item.id)">
            <img :src="item.img | setWH('128.180')" />
          </div>
          <div class="info_list">
            <h2 @tap="handleToDetail(item.id)">
              {{item.nm}}
              <img v-if="item.version" src="@/assets/maxs.png" />
            </h2>
            <p>
              观众评分：
              <span class="grade">{{item.sc}}</span>
            </p>
            <p>主演:{{item.star}}</p>
            <p>{{item.showInfo}}</p>
          </div>
          <div class="btn_mall">购票</div>
        </li>
      </ul>
    </Scroller>
  </div>
</template>

<script>
// import BScroll from '@better-scroll/core'
export default {
  name: 'NowPlaying',
  data () {
    return {
      movieList: [],
      pullDownMsg: '',
      isLoading: true,
      prevCityId: -1
    }
  },
  mounted () {
    // this.axios.post('https://easy-mock.com/mock/5d6e6500c3df5d4ef00b1953/ddd/test').then((res) => {
    //   console.log(res)
    // })
  },
  activated () {
    // console.log(this.$refs.scroller.$el.offsetHeight, this.$refs.ul.offsetHeight)

    const cityId = this.$store.state.City.id
    if (this.prevCityId === cityId) { return }
    this.isLoading = true

    this.axios.get('/api/movieOnInfoList?cityId=' + cityId).then(res => {
      console.log(res)
      const msg = res.data.msg
      if (msg === 'ok') {
        this.movieList = res.data.data.movieList
        console.log(this.movieList)

        this.prevCityId = cityId

        this.isLoading = false

        // this.$nextTick(() => {
        //   const bscroll = new BScroll(this.$refs.movie_body, {
        //     tap: 'tap',
        //     probeType: 1
        //   })

        //   bscroll.on('scroll', pos => {
        //     console.log('bscroll')
        //     if (pos.y > 30) {
        //       this.pullDownMsg = '正在更新中...'
        //     }
        //   })

        //   bscroll.on('touchEnd', pos => {
        //     console.log('touchEnd')
        //     if (pos.y > 30) {
        //       this.axios.get('/api/movieOnInfoList?cityId=10').then(res => {
        //         const msg = res.data.msg
        //         if (msg === 'ok') {
        //           this.pullDownMsg = '更新成功'
        //           setTimeout(() => {
        //             this.movieList = res.data.data.movieList
        //             this.pullDownMsg = ''
        //           }, 1000)
        //         }
        //       })
        //     }
        //   })
        // })
      }
    })
  },
  methods: {
    handleToDetail (movieId) {
      // console.log(movieId)
      this.$router.push('/movie/detail/1/' + movieId)
    },
    handleToScroll (pos) {
      if (pos.y > 30) {
        this.pullDownMsg = '正在更新中'
      }
    },
    handleToTouchEnd (pos) {
      const cityId = this.$store.state.City.id
      if (pos.y > 30) {
        this.axios.get('/api/movieOnInfoList?cityId=' + cityId).then(res => {
          console.log(res)
          const msg = res.data.msg
          if (msg === 'ok') {
            this.pullDownMsg = '更新成功'
            setTimeout(() => {
              this.movieList = res.data.data.movieList
              console.log(this.movieList)
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
#content .movie_body {
  flex: 1;
  overflow: auto;
}
.movie_body ul {
  margin: 0 12px;
  overflow: hidden;
}
.movie_body ul li {
  margin-top: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px #e6e6e6 solid;
  padding-bottom: 10px;
}
.movie_body .pic_show {
  width: 64px;
  height: 90px;
}
.movie_body .pic_show img {
  width: 100%;
}
.movie_body .info_list {
  margin-left: 10px;
  flex: 1;
  position: relative;
}
.movie_body .info_list h2 {
  font-size: 17px;
  line-height: 24px;
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.movie_body .info_list p {
  font-size: 13px;
  color: #666;
  line-height: 22px;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.movie_body .info_list .grade {
  font-weight: 700;
  color: #faaf00;
  font-size: 15px;
}
.movie_body .info_list img {
  width: 50px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.movie_body .btn_mall,
.movie_body .btn_pre {
  width: 47px;
  height: 27px;
  line-height: 28px;
  text-align: center;
  background-color: #f03d37;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.movie_body .btn_pre {
  background-color: #3c9fe6;
}
.movie_body .pullDown {
  margin: 0;
  padding: 0;
  border: none;
}
</style>
