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
$("#addTrain").on("click", function (event) {
    event.preventDefault()

    // Grab values from text boxes
    train = $("#train-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTime = $("#firstTime-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // Create temporary object to hold data
    var newTrain = {
        train: train,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    };

    // Code to handle the push
    database.ref().push(newTrain);

    // Alert
    alert("New train added")

    // Clear text boxes
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#frequency-input").val("");
});


// Firebase watcher
database.ref().on("child_added", function (snapshot) {
    // Storing everything into vars for convenience
    var tName = snapshot.val().train;
    var tDestination = snapshot.val().desination;
    var tFirstTrain = snapshot.val().firstTime;
    var tFrequency = snapshot.val().frequency;

    // Change HTML to reflect data
    // Variables to convert time with moment.js
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    // Moment.max returns the most distant future of the given moment instances
    var tMinutes;
    var tArrival;

    // If the first train is later than the current time, set arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // Calculate minutes to next arrival
        // Take current time in unix, subtract the tFirstTrain time, and find modulus between the difference and frequency
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate arrival time, add tMinutes to current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tName:", tName);
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Append table
        $(".table").append(
            $("<tr>").append(
              $("<td>").text(tName),
              $("<td>").text(tDestination),
              $("<td>").text(tFrequency),
              $("<td>").text(tArrival),
              $("<td>").text(tMinutes)
            )
          );

    // Handle errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});