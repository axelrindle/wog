const sidebar = $('#sidebar');

sidebar
  .addClass('is-transitionless')
  .toggleClass('is-collapsed', localStorage.getItem('sidebar-state') === 'collapsed');

$('#sidebar-collapse').click(() => {
  if (sidebar.hasClass('is-transitionless')) sidebar.removeClass('is-transitionless');
  sidebar.toggleClass('is-collapsed');
  localStorage.setItem('sidebar-state', sidebar.hasClass('is-collapsed') ? 'collapsed' : 'expanded');
});
