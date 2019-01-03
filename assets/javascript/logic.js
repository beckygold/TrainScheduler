// Initialize Firebase
var config = {
    apiKey: "AIzaSyDb-r6p6WlckyxGoDhzgCI2HxeQrmt8EsQ",
    authDomain: "trainscheduler-c833d.firebaseapp.com",
    databaseURL: "https://trainscheduler-c833d.firebaseio.com",
    projectId: "trainscheduler-c833d",
    storageBucket: "trainscheduler-c833d.appspot.com",
    messagingSenderId: "23972045850"
};

firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

// Initial values
var train = "";
var destination = "";
var firstTime = "";
var frequency = "";

// Caputure button click
$("#addTrain").on("click", function(event) {
    event.preventDefault()

    // Grab values from text boxes
    train = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTime = $("#firstTime-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // Log values
    console.log(train);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);

    // Code to handle the push
    database.ref().push({
        train: train,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });

});
    

// Firebase watcher
database.ref().on("child_added", function (snapshot) {
    // Storing snapshot.val in a var for convenience
    var sv = snapshot.val();

    // Log last user's data
    console.log(sv.train);
    console.log(sv.destination);
    console.log(sv.firstTime);
    console.log(frequency);

    // Change HTML to reflect data
    // Variables to convert time with moment.js

    // Append table
    $(".table").append("<tr><td> " +
    snapshot.val().train +
    " </td><td> " + snapshot.val().destination + 
    " </td><td> " + snapshot.val().frequency +
    " </td><td> " + " </td>");

    // Handle errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});