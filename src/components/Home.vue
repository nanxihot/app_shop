<template>
  <div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {}
  },
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  components: {}
}
</script>

<style scoped lang="less">
</style>
