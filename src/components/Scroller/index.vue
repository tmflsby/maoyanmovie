<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
export default {
  name: 'Scroll',
  props: {
    handleToScroll: {
      type: Function,
      default: function () {}
    },
    handleToTouchEnd: {
      type: Function,
      default: function () {}
    }
  },
  mounted () {
    this.$nextTick(() => {
    // setTimeout(() => {
      const bscroll = new BScroll(this.$refs.wrapper, {
        tap: 'tap',
        probeType: 1
      })

      this.bscroll = bscroll

      bscroll.on('scroll', (pos) => {
        this.handleToScroll(pos)
      })

      bscroll.on('touchEnd', (pos) => {
        this.handleToTouchEnd(pos)
      })

      setTimeout(() => {
        bscroll.refresh()
      }, 500)
    // }, 150)
    })
  },
  methods: {
    toScrollTop (y) {
      this.bscroll.scrollTo(0, y)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  height: 100%;
}
</style>
