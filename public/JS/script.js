$(document).ready(function() {
  $("#happy-button").on("click", function() {
    $("#happy-button").addClass("active");
    $("#sad-button").removeClass("active");
    $("#angry-button").removeClass("active");
    console.log("d");
  });
  $("#sad-button").on("click", function() {
    $("#happy-button").removeClass("active");
    $("#sad-button").addClass("active");
    $("#angry-button").removeClass("active");
  });
  $("#angry-button").on("click", function() {
    $("#happy-button").removeClass("active");
    $("#sad-button").removeClass("active");
    $("#angry-button").addClass("active");
  });
  $(window).on("scroll", function() {
    $("div").each(function() {
      if($(window).scrollTop() >= $(this).offset().top - 400) {
        var id = $(this).attr("id");
        if (id == "home" || id == "product" || id == "about" || id == "contact") {
          $("#home-link").removeClass("active");
          $("#product-link").removeClass("active");
          $("#about-link").removeClass("active");
          $("#contact-link").removeClass("active");
          $("#"+id+"-link").addClass("active");
        }
      }
    });
  });
});
