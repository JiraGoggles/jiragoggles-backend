$(function() {
    //extract the token from the meta element
    var token = $('meta[name=token]').attr("content");
    if (!token) token = "example-token";

    $.ajax({
        url: "/api/users/myself?jwt=" + token,
        contentType: "application/json",
        success: function(response) {
            // convert the string response to JSON
            console.log(response);
            response = JSON.parse(response);
            // simply put the returned data into 'root' div for demonstration purposes
            var root = $("#root");
            console.log(response);
            root.html("<div>Admin's email: " + response.emailAddress + "</div>");
        },
        error: function(response) {
            console.log("There was an error while fetching admin's data");
        }
    });
});