<template>
  <div class="content">

    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <span class="subtitle is-6" v-if="filePath" style="margin: 0;">
            {{ filePath }}&nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
          Options
        </p>

        <!-- Refreshed indicator-->
        <p class="pointer" style="padding: .75rem;" v-if="showIndicator.refresh">
          <span class="has-text-success icon" title="File updated.">
            <i class="far fa-bell fa-lg"></i>
          </span>
        </p>

        <!-- No socket connection indicator-->
        <p class="pointer" style="padding: .75rem;" v-if="showIndicator.noSocket">
          <span class="has-text-danger icon" title="Automatic refresh disabled!">
            <i class="fas fa-exclamation-triangle fa-lg"></i>
          </span>
        </p>
      </header>

      <div class="card-content">
        <div class="columns">

          <!-- grep / fuzzy search-->
          <div class="column">
            <!-- Mode selection-->
            <div class="select" style="margin-bottom: 6px;">
              <select v-model="filterMode">
                <option value="grep">Grep &amp; Fuzzy</option>
                <option value="lines">Head &amp; Tail</option>
              </select>
            </div>

            <!-- Grep & Fuzzy-->
            <div class="field has-addons" v-if="filterMode === 'grep'">
              <div class="control">
                <span class="select">
                  <select v-model="grepMode">
                    <option value="grep">Grep</option>
                    <option value="fuzzy">Fuzzy</option>
                  </select>
                </span>
              </div>
              <div class="control">
                <input class="input" type="text" placeholder="Find matches in the log" v-model="grep">
              </div>
              <div class="control">
                <a class="button is-danger" @click="grep = ''">
                  <span class="icon">
                    <i class="fas fa-trash-alt"></i>
                  </span>
                </a>
              </div>
            </div>

            <!-- Head & Tail-->
            <div class="field has-addons" v-else>
              <div class="control">
                <span class="has-text-grey">Work In Progress...</span>
                <!--span.select
                select(v-model="lineMode")
                  option(value="head") Head
                  option(value="tail") Tail
                -->
              </div>
              <!--.controlinput.input(type="number" min="0" value="10" v-model="line")
              -->
              <!--.control
              label.checkbox
                input(type="checkbox")
                |  Apply
              -->
            </div>
          </div> <!-- end .column -->

          <!-- actions-->
          <div class="column">
            <p class="title is-6">Actions</p>
            <div class="field is-grouped" v-if="entry">
              <a class="control button is-primary" :href="downloadUrl">Download</a>
              <a class="control button is-info" @click="refresh">Refresh</a>
              <a class="control button is-link" @click="openGoToLine">Go to line</a>
            </div>
            <paginate v-if="content"
              :page-count="content.maxPage"
              :click-handler="changePage"
              prev-text="&lt;"
              next-text="&gt;"
              container-class="pagination"
              page-link-class="pagination-link"
              prev-link-class="button is-link is-outlined"
              next-link-class="button is-link is-outlined"
              active-class="is-current"
              disabled-class="is-disabled"
              :no-li-surround="true">
            </paginate>
          </div>

          <!-- info-->
          <div class="column">
            <p class="title is-6">Info</p>
            <table class="table is-bordered is-fullwidth is-narrow" v-if="content">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Lines</th>
                  <th>Page</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>~{{ content.size }}</td>
                  <!-- <td>{{ filteredLinesAmount }} / {{ content.totalLines }}</td> -->
                  <td>{{ content.pageStart }} - {{ content.pageEnd }} / {{ content.totalLines }}</td>
                  <td>{{ content.page }} / {{ content.maxPage }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div> <!-- .columns -->
      </div> <!-- end .card-content -->
    </div> <!-- end .card -->

    <!-- actual log content-->
    <pre id="logContent" class="log-lines" v-if="!error &amp;&amp; !loading"><code>
      <div v-for="line in linesFiltered" :data-line="line.lineNumber" :key="line.lineNumber">
        <span class="has-text-link">{{ line.lineNumber }}:&nbsp;</span>
        <span>{{ line.text }}</span>
      </div>
    </code></pre>
    <pre v-else>
      <code class="has-text-danger" v-if="error">{{ error }}</code>
      <code class="loading" v-else>
        <span style="margin-right: 10px;">Loading...</span>
        <i class="fas fa-sync-alt fa-spin fa-lg"></i>
      </code>
    </pre>

    <!-- Modals-->
    <!-- TODO: Use 3rd-party library for modals-->
    <div class="modal" id="goToLineModal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Go to line</p>
          <button class="button is-danger is-rounded" @click="closeGoToLine">X</button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Enter the line number you want to jump to</label>
            <div class="control">
              <input class="input" type="number" v-if="content"
                     :min="content.pageStart" :max="content.pageEnd"
                     v-model="lineToGoTo" @keyup.enter="goToLine" @keyup.esc="closeGoToLine" />
            </div>
            <div class="span has-text-danger" v-if="goToLineError !== null">
              {{ goToLineError }}
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="goToLine" :disabled="goToLineError !== null">Go</button>
          <button class="button" @click="closeGoToLine">Cancel</button>
        </footer>
      </div>
    </div> <!-- .modal -->

  </div> <!-- #content -->
</template>

<script>
// Require modules
const Paginate = require('vuejs-paginate');
const { fuzzysearch } = require('../js/util/fuzzy');

module.exports = {
  name: 'LogViewer',
  components: {
    'paginate': Paginate
  },

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
      lineToGoTo: 1,
      page: 1
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
          lines = lines.filter(el => el.text.indexOf(this.grep) !== -1);
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
      return this.path(`/entry/download/${this.adapter}/${this.entry.id}`);
    },
    goToLineError() {
      if (!this.content) return null;

      const asInt = parseInt(this.lineToGoTo);
      if (asInt < this.content.pageStart) return `Must not be less than ${this.content.pageStart}!`;
      if (asInt > this.content.pageEnd) return `Must not be greater than ${this.content.pageEnd}!`;
      return null;
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
      axios.post('/entry/contents', { adapter: this.adapter, id: this.entry.id, page: this.page })
        .then(response => {
          if (response.data.lines.length > 0) {
            this.content = response.data;

            // handle page update
            if (this.content.maxPage < this.page) {
              this.page = this.content.maxPage;
            }

            let line = 1;
            this.content.lines = this.content.lines.map(el => ({
              lineNumber: (this.content.limit * (this.page - 1)) + line++, text: el
            }));
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
      if (this.goToLineError) return;

      this.closeGoToLine();
      $('#logContent')
        .find('div[data-line="' + this.lineToGoTo + '"]')
        .addClass('blink')
        .one(window.helpers.whichAnimationEvent(), event => {
          $(this).removeClass('blink');
        })
        .get(0).scrollIntoView();
    },

    changePage(num) {
      this.page = num;
      this.refresh();
    }
  },
  watch: {
    entry() {
      if (this.entry) {
        this.page = 1;
        this.refresh();
      } else {
        this.content = null;
      }
    }
  }
}
</script>
