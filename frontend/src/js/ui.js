$(document).ready(() => {

  // ------------------------------------------------------------------
  // 1. Dropdown
  //

  const toggleIcon = dropdown => {
    const icon = dropdown.find('.button .icon[data-rotate="true"] i');
    if (dropdown.hasClass('is-active')) {
      icon.css('transform', 'rotateZ(180deg)');
    } else {
      icon.css('transform', 'rotateZ(0deg)');
    }
  };

  const allDropdown = $(".dropdown:not(.is-hoverable)");
  allDropdown.click(function(event) {
    event.stopPropagation();

    const dropdown = $(this);
    dropdown.toggleClass('is-active');
    toggleIcon(dropdown);
  });
  $(document).click(function() {
    allDropdown.removeClass('is-active');
    toggleIcon(allDropdown);
  });

});
