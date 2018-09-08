export default {
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
  updateContent (els) {
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
  dataFiller (el, data) {
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