<template>
  <TableInfinite :tableData="mockData"></TableInfinite>
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

