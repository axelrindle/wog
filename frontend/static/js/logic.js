'use strict';

// custom axios instance
const http = axios.create({
  baseURL: $('base').attr('href')
});

// create vue app
new Vue({
  el: '#app',
  data: {
    files: [],
    fileFilter: '',
    selected: -1,
    log: 'Select a file on the left.',
    filterMode: 'grep',
    grepMode: 'grep',
    grep: '', // TODO: Add more filters
    lineMode: 'head',
    line: '',
    error: ''
  },
  computed: {
    filesFiltered() {
      return this.files.filter(el => el.path.indexOf(this.fileFilter) !== -1);
    },
    linesFiltered() {
      // check if an item is selected
      if (this.selected === -1 || this.log === '')
        return this.log;

      // split raw text into an array of lines
      let linesArray = this.log.split('\n');

      // perform grep or fuzzy search
      if (this.grep !== '') {
        if (this.grepMode === 'grep') {
          linesArray = linesArray.filter(el => el.indexOf(this.grep) !== -1);
        } else if (this.grepMode === 'fuzzy') {
          linesArray = fuzzysearch(this.grep, linesArray);
        }
      }

      // TODO: add head and tail functions

      // display line numbers
      // TODO: this method is temporary
      linesArray = linesArray.map((line, index) => `${index + 1}:\t ${line}`);

      return linesArray.join('\n');
    },
    downloadUrl() {
      return this.selected + '/download';
    }
  },
  // TODO: Add a Go to line action
  methods: {
    reset: function() {
      this.selected = -1;
      this.log = 'Select a file on the left.';
      this.fileFilter = '';
      this.grep = '';
      this.files = [];
      this.error = '';
    },
    refresh: function () {
      this.reset();
      return http.post('/all').then(response => {
        this.files = response.data;
      }).catch(err => {
        this.error = err.message;
      });
    },
    select: function (index) {
      this.log = '';
      this.grep = '';
      this.selected = index;
      this.error = '';
      http.post(`/${index}`).then(response => {
        const data = response.data.trim();
        if (data === '') {
          this.data = '';
          this.error = `The file ${this.files[index].path} is empty!`;
        } else this.log = data;
      }).catch(err => {
        this.error = err.message;
      });
    },
    totalLinesAmount: function () {
      return this.linesFiltered === '' ? 0 : this.log.split('\n').length;
    },
    filteredLinesAmount: function () {
      return this.linesFiltered.split('\n').length;
    },
    isFiltered: function () {
      return this.grep !== '';
    },
    reloadFile: function () {
      if (this.selected > -1) {
        // just re-select the selected file ;)
        this.select(this.selected);
      }
    }
  },
  watch: {
    // TODO: Only log in debug mode
    // TODO: Deliver debug mode to frontend
    error: (e) => {
      if (e !== '') console.log(`Error: ${e}`);
    }
  },

  mounted() {
    // initially refresh
    this.refresh().then(() => {
      $('#fader').fadeOut(500, () => $('#fader').remove());
    });
  }
});
