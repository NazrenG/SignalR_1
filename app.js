const url = "https://localhost:7006/";

var button = document.querySelector("#btn");
var seconds = 10;
var time = document.querySelector("#time");
var timeSection = document.querySelector("#time-section");
var myInterval;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(url + "offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

async function start() {
  try {
    await connection.start();
    console.log("SignalR connected");
    /**user qosulan kimi ekrana cixir */
    const element = document.querySelector("#offerValue");
    $.get(url + "api/Offer", function (data, status) {
      element.innerHTML = "Begin Price: " + data + "$";
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();

/* connection.invoke;   metodu cagirir */
/*connection.on;  cagirilmagi gozluyur */
connection.on("ReceiveConnectInfo", (message) => {
  let element = document.querySelector("#info");
  //  element.innerHTML += message;
});

connection.on("ReceiveDisConnectedInfo", (message) => {
  let element = document.querySelector("#disconnect");
  // element.innerHTML += message;
});

connection.on("ReceiveMessage", (message, value) => {
  let element = document.querySelector("#offerResponse");
  element.innerHTML = message + "`offer " + value + "$";
  button.disabled = true;
  clearTimeout(myInterval);
  seconds = 10;
  timeSection.disabled = false;
});

function IncreaseOffer() {
  let user = document.querySelector("#user");
  $.get(url + "api/Offer/increase?data=100", function (data, status) {
    $.get(url + "api/Offer", function (data, status) {
      connection.invoke("SendMessage", user.value);
    });
  });

  myInterval = setInterval(async () => {
    time.innerHTML = seconds;
    if (seconds == 0) {
      button.disabled = false;
      clearTimeout(myInterval);
    }
    --seconds;
  }, 1000);
}
