Vue.use(VueSocketio, 'http://' + document.domain + ':' + location.port);

window.vm = new Vue({
  el: '#app',
  data: {
  },
  sockets:{
    connect: function(){
      console.log('socket connected')
    },
  },
  ready() {
  },
  store: store,
  computed: {
  },
  methods: {
  }
});
