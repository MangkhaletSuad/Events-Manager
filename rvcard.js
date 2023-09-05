class RVcard extends HTMLElement{

  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Hello ${hass.user.name}!">
          <div class="card-content">
          <br><br>
          <video  width="320" height="240" controls>
            <source src="${'entity: "camera.192_168_51_109"'}" type="application/vnd.apple.mpegurl">
          </video> 
          <br><br>
          <video src="https://your-rtsp-proxy-server:port/stream" controls></video>
          </div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
      <img src="http://via.placeholder.com/350x150">
      <br><br>
      <video  width="320" height="240" controls>
        <source src="${'entity: "camera.192_168_51_109"'}" type="application/vnd.apple.mpegurl">
      </video>
      <br><br>
      <video src="https://your-rtsp-proxy-server:port/stream" controls></video>

    `;
  }
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  static getStubConfig() {
    return { entity: "sun.sun" },
           { entity: "camera.192_168_51_109" }
}

  getCardSize() {
    return 3;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
});

customElements.define("rv-card", RVcard);