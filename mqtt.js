// clientID = "clientID - "+parseInt(Math.random() * 100);
//         const options = {
//         host: '192.168.51.101',
//         port: 8000,
//         username: 'rvc',
//         password: 'P@ssw0rd'
//     };

// const client = new Paho.MQTT.Client(options.host,options.port,clientID);

const mqtt = require('mqtt');
const url = '192.168.51.101'
const options = {
    port: 8000,
    clean: true,
    connectTimeout: 4000,
    clientId: 'emqx_test',
    username: 'rvc',
    password: 'P@ssw0rd',
  }

const client  = mqtt.connect(url, options)

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({
    onSuccess: function () {
    onConnect();
    onConnectTime();
    onConnectPosition();
  },
  userName: "rvc",
  password: "P@ssw0rd"
});

        function onConnect(){
            console.log("onConnect");
            topic =  "Name";
            // document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";
            client.subscribe(topic);
        }

        function onMessageArrived(message){
            console.log("onMessageArrived");
            console.log("OnMessageArrived: "+message.payloadString);
            // document.getElementById("messages").innerHTML += "<span> Topic:"+message.destinationName+"| Message : "+message.payloadString + "</span><br>";
            const messagesDiv = document.getElementById("messages");
            messagesDiv.innerHTML += "<span> Topic:" + message.destinationName + "| Message : " + message.payloadString + "</span><br>";
        }

        function onConnectTime() {
            console.log("onConnectTime");
            topicTime =  "Time";
            // document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topicTime + "</span><br>";
            client.subscribe(topicTime);
        }

        function onMessageArrivedTime(message){
            console.log("onMessageArrivedTmie");
            console.log("OnMessageArrived: "+message.payloadString);
            // document.getElementById("messages").innerHTML += "<span> Topic:"+message.destinationName+"| Message : "+message.payloadString + "</span><br>";
            const messagesDiv = document.getElementById("messages");
            messagesDiv.innerHTML += "<span>" + message.destinationName + ": " + message.payloadString + "</span><br>";
        }

        function onConnectPosition() {
            console.log("onConnectPosition");
            topicPosition =  "Position";
            // document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topicTime + "</span><br>";
            client.subscribe(topicPosition);
        }

        function onMessageArrivedPosition(message){
            console.log("onMessageArrivedPosition");
            console.log("OnMessageArrived: "+message.payloadString);
            // document.getElementById("messages").innerHTML += "<span> Topic:"+message.destinationName+"| Message : "+message.payloadString + "</span><br>";
            const messagesDiv = document.getElementById("messages");
            messagesDiv.innerHTML += "<span>" + message.destinationName + ": " + message.payloadString + "</span><br>";
        }

        function onConnectionLost(responseObject){
            console.log("onConnectionLost");
            document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
            if(responseObject !=0){
                document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
            }
        }

        function startDisconnect(){
            console.log("startDisconnect");
            client.disconnect();
            document.getElementById("messages").innerHTML += "<span> Disconnected. </span><br>";
        }