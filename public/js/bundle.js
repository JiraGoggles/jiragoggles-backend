$(function() {
    $.ajax({
        url: "/users/myself",
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