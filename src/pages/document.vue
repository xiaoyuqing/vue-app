<template>
  <TableScroll :tableData="mockData" :pageSize="100"></TableScroll>
</template>
<script>
import TableScroll from '@/components/TableScroll'
import mockData from '@/mock/mock.js'
export default {
  data() {
    return {
      mockData: mockData(),
    }
  },
  components:{
    TableScroll
  }
}
</script>
<style>

</style>

