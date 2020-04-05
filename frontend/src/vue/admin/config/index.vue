<template>
  <div>
    <div v-if="!loading">
      <div class="tabs is-boxed is-fullwidth">
        <ul>
          <li v-for="(tab, index) in tabs" :key="index"
              :class="{ 'is-active': selected === index }" @click="selected = index">
            <a>
              <span>{{ tab }}</span>
            </a>
          </li>
        </ul>
      </div> <!-- end .tabs -->

      <table class="table is-fullwidth is-striped is-hoverable" style="overflow-y: auto;">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="index">
            <td>{{ entry.key }}</td>
            <td>{{ entry.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading indicator -->
    <div class="loading" v-else>
      <span style="margin-right: 10px;">Loading...</span>
      <i class="fas fa-sync-alt fa-spin fa-lg"></i>
    </div>

  </div>
</template>

<script>
module.exports = {
  name: 'ConfigurationViewer',

  data() {
    return {
      loading: false,
      data: {},
      selected: 0
    };
  },
  computed: {
    showActions() {
      return !this.loading;
    },
    tabs() {
      return Object.keys(this.data);
    },
    tab() {
      return this.tabs[this.selected];
    },
    entries() {
      return this.data[this.tab];
    }
  },

  methods: {
    refresh() {
      if (this.loading) return;

      this.loading = true;
      axios.post('/admin/config/list')
        .then(response => {
          this.data = response.data;
        })
        .catch(err => {
          console.error(err.response);
          alert(err);
        })
        .then(() => {
          this.loading = false;
        });
    }
  },

  mounted() {
    this.refresh();
  }
};
</script>
