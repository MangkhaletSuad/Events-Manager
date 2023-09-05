class RVcard extends HTMLElement{

  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Example-card">
          <div class="card-content">
            <img src="${[this.cameraEntityImageUrl]}" />
          </div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }
    this.cameraEntityImageUrl = hass.states[this.config.camera_entity].attributes.entity_picture;
    this.hass = hass;
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
      <img src="${[this.cameraEntityImageUrl]}">
    `;
  }
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
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