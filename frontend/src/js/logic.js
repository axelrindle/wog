/* global Vue axios */

// require dependencies
require('./bootstrap');
const FileList = require('../vue/FileList');
const LogViewer = require('../vue/LogViewer');
const isMounted = require('vue-is-mounted');

// create vue app
new Vue({
  name: 'Overview',
  el: '#app',
  components: { FileList, LogViewer },
  mixins: [ isMounted ],

  data: {
    adapters: [],
    error: 'Select a file on the left.',
    isLoading: false,
    socket: null
  },
  computed: {
    theAdapter() {
      if(!this.isMounted) return;
      return this.$refs.fileList.selected.adapter;
    },
    theEntry() {
      if(!this.isMounted) return;
      return this.$refs.fileList.theEntry;
    }
  },

  // public functions
  methods: {
    ready() {
      $('#fader').fadeOut(500, () => $('#fader').remove());
    }
  },

  // watch data props
  watch: {
    // TODO: Only log in debug mode
    // TODO: Deliver debug mode to frontend
    error() {
      if (this.error) console.error(this.error);
    }
  },

  // called when Vue is ready
  mounted() {
    // websocket connection
    const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
    const url = `${protocol}://${location.host}/socket`;
    console.log(url);
    this.socket = new WebSocket(url);

    this.socket.onopen = function (event) {
      console.log('WebSocket connection established.');
    }.bind(this);

    this.socket.onclose = function (event) {
      alert('WebSocket connection closed!\nAutomatic file refresh disabled.');
      this.socket = null;
    }.bind(this);

    this.socket.onerror = function (error) {
      this.error = error;
    }.bind(this);

    this.socket.onmessage = function (message) {
      if (message.data === 'file-was-updated') {
        this.select(this.selected, true);
      }
    }.bind(this);
  }
});
