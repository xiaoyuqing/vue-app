<template>
  <TableInfiniteOptimize :tableData="mockData" :pageSize="15"></TableInfiniteOptimize>
</template>
<script>
import TableInfiniteOptimize from '@/components/TableInfiniteOptimize'
import mockData from '@/mock/mock.js'
export default {
  data() {
    return {
      mockData: mockData(),
    }
  },
  components:{
    TableInfiniteOptimize
  }
}
</script>
<style>

</style>

