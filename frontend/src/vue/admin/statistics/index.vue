<template>
  <div>
    <div v-if="!loading">
      <div class="columns">

        <!-- Total users -->
        <div class="column">
          <div class="card">
            <div class="card-content has-text-centered">
              <p class="title is-2">
                {{ data.users }}
              </p>
              <p class="subtitle is-5">
                {{ data.users === 1 ? 'user' : 'users' }} registered
              </p>
            </div> <!-- end .card-content -->
          </div> <!-- end .card -->
        </div> <!-- end .column -->

        <!-- Total adapters -->
        <div class="column">
          <div class="card">
            <div class="card-content has-text-centered">
              <p class="title is-2">
                {{ total.adapters }}
              </p>
              <p class="subtitle is-5">
                {{ total.adapters === 1 ? 'adapter' : 'adapters' }} loaded
              </p>
            </div> <!-- end .card-content -->
          </div> <!-- end .card -->
        </div> <!-- end .column -->

        <!-- Total entries -->
        <div class="column">
          <div class="card">
            <div class="card-content has-text-centered">
              <p class="title is-2">
                {{ total.entries }}
              </p>
              <p class="subtitle is-5">
                {{ total.entries === 1 ? 'entry' : 'entries' }} being served
              </p>
            </div> <!-- end .card-content -->
          </div> <!-- end .card -->
        </div> <!-- end .column -->

      </div> <!-- end .columns -->

      <p class="has-text-centered">
        Todo <!-- TODO: Requests per minute, a nice graph maybe? Grafana integration instead? -->
      </p>
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
  name: 'Statistics',

  data() {
    return {
      loading: true,
      data: null
    }
  },
  computed: {
    showActions() {
      return !this.loading;
    },
    total() {
      return {
        adapters: Object.keys(this.data.adapters).length,
        entries: Object.values(this.data.adapters).reduce((prev, next) => prev + next)
      }
    }
  },

  methods: {
    refresh() {
      this.loading = true;
      axios.post('/admin/statistics/list')
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
