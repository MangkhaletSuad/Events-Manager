// import Paho from 'paho-mqtt';

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


    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.content.innerHTML = `
    <head>
    <script src="<https://unpkg.com/mqtt/dist/mqtt.min.js>"></script>
    </head>
    <body>
    <div>
      <div>
        <div class="card"><img class="card__img" src="data:image/png;base64,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" alt="">
          <div>
            <h1>${hass.user.name}</h1>
            <h2>Name: ${hass.user.name}${JSON.stringify(this.config)}</h2>
            <img src=""></img>
          </div>
        </div>
      </div>
    </div>
    </body>
    `;
  }
  setConfig(config) {
    if (!config.entities) {
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