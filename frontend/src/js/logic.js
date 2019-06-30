// Require dependencies
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
    error: null,
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

  // called when Vue is ready
  mounted() {
    // websocket connection
    const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
    const url = `${protocol}://${location.host}/socket`;
    this.socket = new BetterWebSocket(url)
      .on('open', () => {
        console.log('WebSocket connection established.');
      })
      .on('close', () => {
        alert('WebSocket connection closed!\nAutomatic file refresh disabled.');
        this.socket = null;
      })
      .on('error', err => {
        this.error = err;
      })
      .on('message', msg => {
        const parsed = JSON.parse(msg.data);
        switch (parsed.type) {
          case 'add':
            this.$refs.fileList.refresh();
            break;
          case 'change':
            this.$refs.logViewer.refresh();
            break;
          case 'unlink':
            this.$refs.fileList.refresh();
            break;
          case 'error':
            this.error = parsed.msg;
            break;
          default:
            console.error(`Unknown event: ${parsed.event}`);
            break;
        }
      });
  }
});
