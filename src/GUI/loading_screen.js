$(document).ready(function () {
    setTimeout(function () {
        $(".spinner").fadeOut(1250);
    }, 3000);
    setTimeout(function () {
        $(".begin").fadeIn(1500);
    }, 4250);
});

$(".begin").click(function () {
     $.getJSON("http://usve74985.serverprofi24.com/fake_descrip", function(result){
        $.each(result, function(i, field){
            $("div").append(field + " ");
        });
    });
});