<template>
	<div class="document rolling-table">
		<div class="top-left"></div>
		<div class="table-head" :style="{position: 'absolute', overflow: 'hidden'}">
			<table id="top-table" ref="tFixedHead">
				<tr class="header"><th></th><th v-for="(item, index) in headers" :key="index">{{item}}</th></tr>
			</table>
		</div>
		<div class="left-fixed" :style="{height: scrollHeight + 'px',paddingTop: '43px'}">
      <div class="left-div">
        <table id="left-table" ref="tFixedLeft">
          <tr v-for="(item, index) in left" :key="index" class="left-row"><td>{{index+1}}</td></tr>
        </table>
      </div>
		</div>
		<div class="scroll-table" ref="cScroll" :style="{height: scrollHeight + 'px'}">			
			<div class="table-body" style="margin: 43px 0 0 63px;" :style="{height: scrollHeight -43 + 'px'}">
				<table id="roll-table" ref="scrollBody">
					<tr v-for="(tr, index) in files" :key="index" ref="tabletr" class="row">
						<td v-for="(item,index) in tr" :key="index"></td>
					</tr>
				</table>
			<!-- <div v-if="this.isUpload">正在加载中...</div> -->
			</div>
		</div>		
	</div>
</template>
<script>
const iScoll = require("iscroll/build/iscroll-probe");
const infinite = require("iscroll/build/iscroll-infinite");
export default {
  props: {
    tableData: Object,
    pageSize: {
      type: Number,
      default: 11
    }
  },
  data() {
    return {
      headers: [],
      files: [],
      showLeft: false,
      showTop: false,
      scrollHeight: window.innerHeight,
      pageNum: 1,
      isUpload: true,
      options: {
        infiniteLimit: 10000
      },
      left: 15,
    };
  },
  mounted() {
    this.headers = this.tableData.headers;
    let total = this.tableData.files.length;
    this.totalPage = Math.ceil(total / this.pageSize);
    this.files = this.tableData.files.slice(0, 15);
    this.iscrollTable = new iScoll(".table-body", {
      preventDefault: true, // 阻止浏览器滑动默认行为
      probeType: 3, //需要使用 iscroll-probe.js 才能生效 probeType ： 1 滚动不繁忙的时候触发 probeType ： 2 滚动时每隔一定时间触发 probeType ： 3   每滚动一像素触发一次
      mouseWheel: true, //是否监听鼠标滚轮事件。
      scrollX: true, // 启动x轴滑动
      scrollY: true, // 启动y轴滑动
      freeScroll: false,
      scrollbars: true
    });
    this.iscrollTable.maxScrollY = -2147483066;
    setTimeout(this.initInfinite, 0);
    this.iscrollTable.on("scroll", this.scrollTable);
    this.iscrollTable.on("beforeScrollStart", this.scrollStart);
    document.addEventListener("touchmove",
      function(e) {
        e.preventDefault();
      },
      false
    );
  },
  methods: {
    scrollTable() { 
      let iscrollTable = this.iscrollTable;
      iscrollTable.maxScrollY = -2147483066;
      if (iscrollTable.x > 0) {
        iscrollTable.scrollTo(0, iscrollTable.y);
        return;
      }
      if (iscrollTable.y > 0) {
        iscrollTable.scrollTo(iscrollTable.x, 0);
        return;
      }
      if ((iscrollTable.y - iscrollTable.maxScrollY) > 600) {
        this.isUpload = true;
      }
      const _this = this;
      _this.$refs.tFixedLeft.style.transform =
        "translateY(" + iscrollTable.y + "px)";
      _this.$refs.tFixedHead.style.transform =
        "translate(" + iscrollTable.x + "px, 0px)";
        this.reorderInfinite();
    },
    scrollStart() {
      this.startx = this.iscrollTable.x;
      this.starty = this.iscrollTable.y;
      this.iscrollTable.refresh();
    },
    initInfinite() {
      let iscrollTable = this.iscrollTable;
      this.infiniteElements = document.querySelectorAll('.row');
      this.leftElements = document.querySelectorAll('.left-row');
      this.infiniteLength = this.infiniteElements.length;
      this.infiniteMaster = this.infiniteElements[0];
      this.infiniteElementHeight = this.getRect(this.infiniteMaster).height;
      this.infiniteHeight = this.infiniteLength * this.infiniteElementHeight;
      this.options.cacheSize = this.options.cacheSize || 10000;
      this.infiniteCacheBuffer = Math.round(this.options.cacheSize / 40);
      //this.infiniteCache = {};
      // this.options.dataset.call(this, 0, this.options.cacheSize);
     let that = this;
      iscrollTable.on('refresh', function () {
        that.reorderInfinite();
      });
      var elementsPerPage = Math.ceil(iscrollTable.wrapperHeight / this.infiniteElementHeight);
      this.infiniteUpperBufferSize = Math.floor((that.infiniteLength - elementsPerPage) / 2);
      this.reorderInfinite()
    },
    reorderInfinite() {
      let iscrollTable = this.iscrollTable;
      var center = -iscrollTable.y + iscrollTable.wrapperHeight / 2;
      var minorPhase = Math.max(Math.floor(-iscrollTable.y / this.infiniteElementHeight) - this.infiniteUpperBufferSize, 0),
        majorPhase = Math.floor(minorPhase / this.infiniteLength),
        phase = minorPhase - majorPhase * this.infiniteLength;
      var top = 0;
      var i = 0;
      var update = [];
      var updateLeft = [];
      //var cachePhase = Math.floor((minorPhase + this.infiniteLength / 2) / this.infiniteCacheBuffer);
      var cachePhase = Math.floor(minorPhase / this.infiniteCacheBuffer);
      while ( i < this.infiniteLength ) {
        top = i * this.infiniteElementHeight + majorPhase * this.infiniteHeight;
        if ( phase > i ) {
          top += this.infiniteElementHeight * this.infiniteLength;
        }
        if ( this.infiniteElements[i]._top !== top ) {
          this.infiniteElements[i]._phase = top / this.infiniteElementHeight;
          this.leftElements[i]._phase = top / this.infiniteElementHeight;
          if ( this.infiniteElements[i]._phase < this.options.infiniteLimit ) {
            this.infiniteElements[i]._top = top;
            this.infiniteElements[i].style.transform = 'translate(0, ' + top + 'px)';
            this.leftElements[i].style.transform = 'translate(0, ' + top + 'px)';
            update.push(this.infiniteElements[i]);
            updateLeft.push(this.leftElements[i]);
          }
        }
        i++;
      }
      if ( this.cachePhase != cachePhase && (cachePhase === 0 || minorPhase - this.infiniteCacheBuffer > 0) ) {
        this.dataset(Math.max(cachePhase * this.infiniteCacheBuffer - this.infiniteCacheBuffer, 0), this.options.cacheSize);
      }
      this.cachePhase = cachePhase;
      this.updateContent(update);
      this.updateLeftContent(updateLeft);
    },
    updateContent: function (els) {
      if ( this.infiniteCache === undefined ) {
        return;
      }
      for ( var i = 0, l = els.length; i < l; i++ ) {
        this.dataFiller(els[i], this.infiniteCache[els[i]._phase]);
      }
    },
    updateLeftContent(els) {
      if ( this.infiniteCache === undefined ) {
        return;
      }
      for ( var i = 0, l = els.length; i < l; i++ ) {
        this.dataLeftFilter(els[i], els[i]._phase);
      }
    },
    updateCache: function (start, data) {
      var firstRun = this.infiniteCache === undefined;
      this.infiniteCache = {};
      for ( var i = 0, l = data.length; i < l; i++ ) {
        this.infiniteCache[start++] = data[i];
      }
      if ( firstRun ) {
        this.updateContent(this.infiniteElements);
      }
    },
    dataFiller(el, data) {
      let html = [];
      let nodeList = el.childNodes;
      for (let i = 0;i < data.length; i++) {
        nodeList[i].innerHTML = data[i].name;
      } 
    },
    dataLeftFilter(el, phase) {
      let nodeList = el.childNodes;
      for (let i = 0;i < nodeList.length; i++) {
        nodeList[i].innerHTML = phase + 1;
      }
    },
    dataset(start, count) {
      let data = this.tableData.files.slice(start, count);
      this.updateCache(start, data);
    },
    getRect(el) {
      return {
        top : el.offsetTop,
				left : el.offsetLeft,
				width : el.offsetWidth,
				height : el.offsetHeight
      }
    }
  }
};
</script>
<style lang="less" scoped>
.document {
  width: 100%;
  position: relative;
  overflow: hidden;
  .table-head {
    position: absolute;
    overflow: hidden;
    z-index: 99;
  }
  .scroll-table {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .table-body {
      overflow: hidden;
      position: relative;    
      #roll-table{
        min-height: 500000px;
        min-width: 2500px;
      }
      #roll-table tr{
        position: absolute;
        top: 0;
        left: 0;
        td{
          border-top: none;
        }
      }
    }
  }
  .top-left {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 63px;
    height: 43px;
    z-index: 100;
    background-color: #ddd;
    border: 1px solid #eee;
  }
  table {
    tr.header {
    }
    th {
      min-width: 100px;
      height: 40px;
      background-color: #ddd;
      border: 1px solid #eee;
      text-align: center;
      color: #888;
    }
    th:first-child {
      min-width: 60px;
    }
    tr td {
      min-width: 100px;
      border: 1px solid #eee;
      height: 50px;
    }
  }
  .left-fixed {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 99;
    .left-div{
      position: relative;
      height: 667px;
      min-width: 64px;
    }
    table#left-table {
      tr {
        position: absolute;
        top: 0;
        left: 0;
      }
      tr td:first-child {
        min-width: 60px;
        background-color: #ddd;
        border: 1px solid #eee;
        color: #888;
        text-align: center;
      }
    }
  }
  .table-header {
    position: absolute;
    overflow: hidden;
  }
}
</style>