class RVcard extends HTMLElement{

  set hass(hass) {
    
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Hello ${hass.user.name}!">
          <div class="card-content">
          <img src="http://via.placeholder.com/350x150">
          </div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }

    clientID = "clientID - "+parseInt(Math.random() * 100);
        const options = {
        host: '192.168.51.101',
        port: 8000,
        username: 'rvc',
        password: 'P@ssw0rd'
        };

        const client = new Paho.MQTT.Client(options.host,options.port,clientID);

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        client.connect({
            onSuccess: onConnect,
            userName: "rvc",
            password: "P@ssw0rd"

        });

        function onConnect(){
            console.log("onConnect");
            topic =  "Test";

            document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";

            client.subscribe(topic);
        }

        function onConnectionLost(responseObject){
            console.log("onConnectionLost");
            document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
            if(responseObject !=0){
                document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
            }
        }

        function onMessageArrived(message){
            console.log("onMessageArrived");
            console.log("OnMessageArrived: "+message.payloadString);
            document.getElementById("messages").innerHTML += "<span> Topic:"+message.destinationName+"| Message : "+message.payloadString + "</span><br>";
        }

        function startDisconnect(){
            console.log("startDisconnect");
            client.disconnect();
            document.getElementById("messages").innerHTML += "<span> Disconnected. </span><br>";
        }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.content.innerHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.min.js" type="text/javascript"></script>
      <p>The state of ${entityId} is ${stateStr}!</p>
      <img src="http://via.placeholder.com/350x150">
      <br><br>
      <div id="messages"></div>
      <br><br>
      <video  width="320" height="240" controls>
        <source src="${'entity: "camera.192_168_51_109"'}" type="application/vnd.apple.mpegurl">
      </video>
      <br><br>
    `;
  }
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  static getStubConfig() {
    return { entity: "sun.sun"  }
}
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
});

customElements.define("rv-card", RVcard);