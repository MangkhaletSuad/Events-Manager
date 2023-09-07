import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

function loadCSS(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

loadCSS("https://fonts.googleapis.com/css?family=Gloria+Hallelujah");
// loadCSS("path/to/your/test.css"); // Adjust the path to your CSS file

class RVcard extends LitElement {
  static get properties() {
    return {
      messages: { type: Array },
    };
  }

  constructor() {
    super();
    this.messages = [];
    this.clientID = "clientID - " + parseInt(Math.random() * 100);

    const options = {
      host: '192.168.51.101',
      port: 8000,
      username: 'rvc',
      password: 'P@ssw0rd'
    };

    this.client = new Paho.MQTT.Client(options.host, options.port, this.clientID);

    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.onMessageArrived = this.onMessageArrived.bind(this);

    this.client.connect({
      onSuccess: this.onConnect.bind(this),
      userName: "rvc",
      password: "P@ssw0rd"
    });
  }

  

  render() {
    return html`
      <wired-card elevation="2">
        ${this.messages.map(message => html`
          <div>${message}</div>
        `)}
      </wired-card>
    `;
  }

  onConnect() {
    console.log("onConnect");
    this.client.subscribe("Name");
  }

  onMessageArrived(message) {
    console.log("onMessageArrived");
    console.log("OnMessageArrived: " + message.payloadString);
    this.messages = [...this.messages, `Topic: ${message.destinationName} | Message: ${message.payloadString}`];
  }

  onConnectionLost(responseObject) {
    console.log("onConnectionLost");
    if (responseObject.errorCode !== 0) {
      this.messages = [...this.messages, `ERROR: ${responseObject.errorMessage}`];
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: "Gloria Hallelujah", cursive;
      }
      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
      }
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
});

customElements.define("rv-card", RVcard);
