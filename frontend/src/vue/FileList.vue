<template>
  <div>
    <!-- filter-->
    <section class="section">
      <div class="container">
        <p class="title">Search</p>
        <p class="subtitle">Find a logfile</p>
        <div class="field has-addons">
          <div class="control">
            <input class="input" type="text" placeholder="boot.log" v-model="filter" />
          </div>
          <div class="control">
            <a class="button is-danger" @click="filter = ''">
              <span class="icon">
                <i class="fas fa-trash-alt"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <hr>

    <!-- file tree-->
    <section class="section">
      <div class="container">
        <p class="title">
          Logfiles
          <a class="button is-primary is-rounded is-pulled-right"
             @click="refresh()" v-if="selected.adapter">
            <span class="icon">
               <i class="fas fa-sync-alt"></i>
            </span>
          </a>
        </p>
        <p class="subtitle" v-if="allShown">
          Loaded {{ shown }} files
        </p>
        <p class="subtitle" v-else>
          Showing {{ shown }} / {{ files.length }} files
        </p>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Adapter</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <div class="select">
                  <select v-model="selected.adapter" :disabled="loading">
                    <option v-for="adapter in adapters" :value="adapter" :key="adapter">
                      {{ adapter }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div> <!-- end .field -->

        <hr>

        <ul class="button-list">
          <li v-for="(file, index) in filesFiltered" :key="file.id">
            <a class="button" @click="select(index)" :title="file.path"
               :class="{ 'is-link': selected.file === index }">
              {{ file.name }}
            </a>
          </li>
        </ul>
      </div> <!-- end .container -->
    </section> <!-- end .section -->
  </div> <!-- end wrapper -->
</template>

<script>
module.exports = {
  name: 'FileList',
  props: {
    socket: WebSocket
  },
  data() {
    return {
      loading: true,
      adapters: [],
      files: [],
      filter: '',
      selected: {
        adapter: null,
        file: -1
      }
    };
  },
  computed: {
    filesFiltered() {
      return this.files.filter(el => el.name.indexOf(this.filter) !== -1);
    },
    shown() {
      return this.filesFiltered.length;
    },
    allShown() {
      return this.shown === this.files.length;
    },
    theEntry() {
      return this.files[this.selected.file];
    }
  },
  methods: {
    refresh() {
      this.$root.error = null;
      this.loading = true;
      this.selected.file = -1;
      this.files = [];
      axios.post('/all/objects', { type: 'entries', adapter: this.selected.adapter })
        .then(response => {
          this.files = response.data;
        }).catch(err => {
          this.$root.error = err.message;
        })
        .then(() => {
          this.loading = false;
        });
    },
    select(index) {
      this.selected.file = index;
      const fileId = this.files[this.selected.file].id;
      if (this.socket) this.socket.send(JSON.stringify({ event: 'changeEntry', entry: fileId }));
    }
  },
  watch: {
    filter() {
      if (this.selected.file !== -1 &&
          this.files[this.selected.file].name.indexOf(this.filter) === -1) {
        this.selected.file = -1;
      }
    },
    'selected.adapter': function() {
      localStorage.setItem('selectedAdapter', this.selected.adapter);
      if (this.socket) this.socket.send(JSON.stringify({ event: 'changeAdapter', adapter: this.selected.adapter }));
      this.refresh();
    }
  },

  mounted() {
    // load adapters
    axios.post('/all/objects', { type: 'adapters' })
      .then(response => {
        this.adapters = response.data;

        // select saved adapter
        const previous = localStorage.getItem('selectedAdapter');
        if (this.adapters.indexOf(previous) > -1) {
          this.selected.adapter = previous;
        }
      }).catch(err => {
        this.$root.error = err.message;
      })
      .then(() => {
        this.loading = false;
        this.$emit('ready');
      });
  }
};
</script>
