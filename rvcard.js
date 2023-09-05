class RVcard extends HTMLElement{

  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Example-card">
          <div class="card-content"></div>
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
    `;
  }

      // static get properties() {
      //   return {
      //     config: { type: Object },
      //     cameraEntityImageUrl: { type: String },
      //   };
      // }
  setConfig(config) {
      if (!config.camera_entity) {
        throw new Error('Missing camera_entity in card configuration');
      }
        this.config = config;
      }

  // set hass(value) {
  //   const entityId = this.config.entity;
  //   const state = hass.states[entityId];
  //   const stateStr = state ? state.state : "unavailable";
  //   this.cameraEntityImageUrl = value.states[this.config.camera_entity].attributes.entity_picture;
  //   this._hass = value;
  // }
}



customElements.define("rv-card", RVcard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
  preview: false, // Optional - defaults to false

});

