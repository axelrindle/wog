// Require dependencies
require('./util/bootstrap');
const BetterWebSocket = require('./util/BetterWebSocket');
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
  watch: {
    isMounted(val) {
      if (val) $('.fader').fadeOut(500, () => $(this).remove());
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
    const url = $('meta[name="socket"]').attr("value");
    this.socket = new BetterWebSocket(url)
      .on('open', () => {
        console.log('WebSocket connection established.');
      })
      .on('close', () => {
        alert('WebSocket connection closed!\nAutomatic file refresh disabled.');
        this.socket = null;
      })
      .on('error', err => {
        console.error(err);
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
