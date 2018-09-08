<template>
  <TableInfinite :tableData="mockData" :pageSize="15"></TableInfinite>
</template>
<script>
import TableInfinite from '@/components/TableInfinite'
import mockData from '@/mock/mock.js'
export default {
  data() {
    return {
      mockData: mockData(),
    }
  },
  components:{
    TableInfinite
  }
}
</script>
<style>

</style>

