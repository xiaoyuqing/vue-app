<template>
  <BetterScroll :tableData="mockData" :pageSize="100"></BetterScroll>
</template>
<script>
import BetterScroll from '@/components/BetterScroll'
import mockData from '@/mock/mock.js'
export default {
  data() {
    return {
      mockData: mockData(),
    }
  },
  components:{
    BetterScroll
  }
}
</script>
<style>

</style>

