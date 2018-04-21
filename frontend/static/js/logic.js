'use strict';

// custom axios instance
const http = axios.create({
  baseURL: $('base').attr('href')
});

// create vue app
const app = new Vue({
  el: '#app',
  data: {
    files: [],
    filter: '',
    selected: -1,
    log: 'Select a file on the left.',
    grep: '',
    error: ''
  },
  computed: {
    filteredFiles() {
      return this.files.filter(el => el.path.indexOf(this.filter) !== -1);
    },
    lines() {
      return (this.selected === -1 || this.log === "") ? [] : this.log.split('\n');
    },
    grepped() {
      const lines = this.lines;
      if (this.grep === '' || lines.length === 0) return this.log
      else return lines.filter(el => el.indexOf(this.grep) !== -1).join('\n');
    }
  },
  methods: {
    reset: function() {
      this.selected = -1;
      this.log = 'Select a file on the left.';
      this.filter = '';
      this.grep = '';
      this.files = [];
      this.error = '';
    },
    refresh: function () {
      this.reset();
      http.post('/all').then(response => {
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
    }
  }
});

// initially refresh
app.refresh();

// fade fader out
setTimeout(() => {
  $('#fader').fadeOut(500, () => $('#fader').remove());
}, 250);
