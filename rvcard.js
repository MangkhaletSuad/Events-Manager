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

    const mqtt = require('mqtt');
    const url = 'mqtt://192.168.51.101:1883';
    const client = mqtt.connect(url);

    function updateHTML(message) {
      // Assuming you have an HTML element with the id "mqtt-message" to display the message
      const messageElement = document.getElementById('mqtt-message');
      messageElement.innerHTML = message;
    }

    client.on('connect', function () {
      console.log('Connected')
      // Subscribe to a topic
      client.subscribe('Test', function (err) {
        if (!err) {
          // Publish a message to a topic
          client.publish('Test', 'Hello mqtt')
        }
      });
    });

    client.on('message', function (topic, message) {
      // Handle the received message here
      console.log(`Received message on topic ${topic}: ${message}`);
      // Update the HTML content with the received message
      updateHTML(message.toString());
    });

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    const cameraImage = document.getElementById('cameraImage');

    // URL ของ entity camera ของคุณ
    const cameraEntityUrl = 'camera.192_168_51_109'; // แทนด้วย URL ของ entity ของคุณ

    // เรียกข้อมูลภาพจาก entity camera
    fetch(cameraEntityUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // แสดงภาพบน HTML element
        cameraImage.src = URL.createObjectURL(blob);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });


    this.content.innerHTML = `
      <p>The state of ${entityId} is ${stateStr}!</p>
      <img src="http://via.placeholder.com/350x150">
      <br><br>
      <p id="mqtt-message">: No message yet</p>
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