$(document).ready(function(){
    setActiveTab();
});

function setActiveTab() {
    var path = window.location.pathname;
    if (path.includes("venue")) {
        $(".venue").addClass("active");
    } else if (path.includes("user")) {
        $(".user").addClass("active");
    } else if (path.includes("register")) {
        $(".signup").addClass("active");
    } else if (path.includes("/profile")) {
        $(".profile").addClass("active");
    } else if (path.includes("/admin")) {
        $(".admin").addClass("active");
    } else if (path.includes("/")) {
        $(".about").addClass("active");
    }
}