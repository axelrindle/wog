const sidebar = $('#sidebar');

// initial state
sidebar.toggleClass('is-collapsed', localStorage.getItem('sidebar-state') === 'collapsed');

$('#sidebar-collapse').click(() => {
  sidebar.toggleClass('is-collapsed');
  localStorage.setItem('sidebar-state', sidebar.hasClass('is-collapsed') ? 'collapsed' : 'expanded');
});
