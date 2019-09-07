<template lang="pug">
#content
  .card
    header.card-header
      p.card-header-title
        span(v-if="filePath", style="margin: 0;").subtitle.is-6 {{ filePath }}&nbsp;&nbsp;|&nbsp;&nbsp;
        | Options

      // Refreshed indicator
      p.pointer(style="padding: .75rem;" v-if="showIndicator.refresh")
        span.has-text-success.icon(title="File updated.")
          i.far.fa-bell.fa-lg

      // No socket connection indicator
      p.pointer(style="padding: .75rem;" v-if="showIndicator.noSocket")
        span.has-text-danger.icon(title="Automatic refresh disabled!")
          i.fas.fa-exclamation-triangle.fa-lg
    .card-content
      .content
        .columns
          // grep / fuzzy search
          .column
            include ../../pug/overview/log_filter.pug
          // actions
          .column
            p.title.is-6 Actions
            .field.is-grouped
              a(:href="downloadUrl" v-if="filteredLinesAmount").control.button.is-primary Download
              a(@click="refresh" v-if="entry").control.button.is-info Refresh
              a(@click="openGoToLine" v-if="filteredLinesAmount").control.button.is-link Go to line
          // info
          .column
            p.title.is-6 Info
            ul(v-if="content")
              li(v-if="grep") Lines: {{ filteredLinesAmount }} / {{ content.lines.length }}
              li(v-else) Lines: {{ filteredLinesAmount }}
              li Size: ~{{ content.size }}

  // actual log content
  pre#logContent(v-if="!error && !loading")
    code
      div(v-for="(line, index) in linesFiltered" :data-line="index + 1") {{ index + 1}}: {{ line }}
  pre(v-else)
    code.has-text-danger(v-if="error") {{ error }}
    code.loading(v-else)
      span(style="margin-right: 10px;") Loading...
      i.fas.fa-sync-alt.fa-spin.fa-lg

  // Modals
  // TODO: Use 3rd-party library for modals
  .modal#goToLineModal
    .modal-background
    .modal-card
      header.modal-card-head
        p.modal-card-title Go to line
        button.button.is-danger.is-rounded(@click="closeGoToLine") X

      section.modal-card-body
        .field
          label.label Enter the line number you want to jump to
          .control
            input.input(type="number", min="1" :max="filteredLinesAmount"
                        v-model="lineToGoTo"
                        @keyup.enter="goToLine"
                        @keyup.esc="closeGoToLine")
          .span.has-text-danger(v-if="showGoToLineError") Must not be bigger than {{ filteredLinesAmount }}!

      footer.modal-card-foot
        button.button.is-success(@click="goToLine" :disabled="showGoToLineError") Go
        button.button(@click="closeGoToLine") Cancel
</template>

<script>
const { fuzzysearch } = require('../js/fuzzy');

module.exports = {
  name: 'LogViewer',

  props: {
    adapter: String,
    entry: Object
  },
  data() {
    return {
      loading: false,
      content: null,
      showIndicator: {
        refresh: false,
        noSocket: false
      },
      filterMode: 'grep',
      grepMode: 'grep',
      grep: '', // TODO: Add more filters
      lineMode: 'head',
      line: '',
      lineToGoTo: 1
    }
  },
  computed: {
    filePath() {
      if (!this.entry) return "Select an entry";
      else return this.entry.path;
    },
    linesFiltered() {
      if (!this.content) return [];
      let lines = this.content.lines;

      // perform grep or fuzzy search
      // TODO: highlight matched elements
      if (this.grep !== '') {
        if (this.grepMode === 'grep') {
          lines = lines.filter(el => el.indexOf(this.grep) !== -1);
        } else if (this.grepMode === 'fuzzy') {
          lines = fuzzysearch(this.grep, lines);
        }
      }

      // TODO: add head and tail functions

      return lines;
    },
    filteredLinesAmount() {
      return this.linesFiltered.length;
    },
    downloadUrl() {
      return this.path(`/download/${this.adapter}/${this.entry.id}`);
    },
    showGoToLineError() {
      return parseInt(this.lineToGoTo) > this.filteredLinesAmount;
    },
    error() {
      if (this.$root.error) return this.$root.error;
      if (this.loading) return null;
      if (!this.adapter) return 'No adapter selected!';
      if (!this.entry) return 'No entry selected!';
      if (!this.content) return 'This entry is empty!';
      return null;
    }
  },
  methods: {
    path(path) {
      return window.helpers.path(path);
    },
    refresh() {
      this.$root.error = null;
      this.loading = true;
      axios.post('/contents', { adapter: this.adapter, id: this.entry.id })
        .then(response => {
          this.content = response.data;
          if (this.content.lines.length === 0) {
            this.content = null;
          }
        })
        .catch(err => {
          console.error(err.response.data || err);
          if (err.response) {
            this.$root.error = err.response.data.msg;
          } else {
            this.$root.error = err;
          }
        })
        .then(() => {
          this.loading = false;
        });
    },
    openGoToLine() {
      if (this.selected === -1) {
        alert('Select a file first.');
      } else {
        $('#goToLineModal')
          .addClass('is-active')
          .find('input')
          .focus();
      }
    },
    closeGoToLine() {
      $('#goToLineModal').removeClass('is-active');
    },
    goToLine() {
      this.closeGoToLine();
      $('#logContent')
        .scrollTop(19.5 * this.lineToGoTo)
        .find('div[data-line="' + this.lineToGoTo + '"]')
          .addClass('blink')
          .one(window.helpers.whichAnimationEvent(), event => {
            $(this).removeClass('blink');
          });
    }
  },
  watch: {
    entry() {
      this.refresh();
    }
  }
}
</script>
