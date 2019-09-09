<template lang="pug">
  div
    // filter
    section.section
      .container
        p.title Search
        p.subtitle Find a logfile
        .field.has-addons
          .control
            input.input(type='text', placeholder='boot.log' v-model="filter")
          .control
            a.button.is-danger(@click="filter = ''")
              span.icon
                i.fas.fa-trash-alt

    hr

    // file tree
    section.section
      .container
        p.title Logfiles
          a(v-on:click="refresh()" v-if="selected.adapter").button.is-primary.is-rounded.is-pulled-right
            span.icon
              i.fas.fa-sync-alt

        p(v-if="allShown").subtitle Loaded {{ shown }} files
        p(v-else).subtitle Showing {{ shown }} / {{ files.length }} files
        .select
          select(v-model="selected.adapter" :disabled="loading")
            option(v-for="adapter in adapters" :value="adapter") {{ adapter }}
        hr
        ul.button-list
          li(v-for="(file, index) in filesFiltered")
            a.button(@click="select(index)" :title="file.path" :class="{ 'is-link': selected.file === index }") {{ file.name }}
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
      axios.post('/all', { type: 'entries', adapter: this.selected.adapter })
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
      this.socket.send(JSON.stringify({ event: 'changeAdapter', adapter: this.selected.adapter }));
      this.refresh();
    }
  },

  mounted() {
    // load adapters
    axios.post('/all', { type: 'adapters' })
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
