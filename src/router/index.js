import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Document from '@/pages/document'
import TableInfinite from '@/pages/tableinfinite'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/document',
      name: 'Document',
      component: Document
    },
    {
      path: '/tableinfinite',
      name: 'tableinfinite',
      component: TableInfinite
    },
  ]
})
