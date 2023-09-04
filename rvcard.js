class RVcard extends HTMLElement {
  _hass
  config;
  content;


  setConfig(config) {
      if (!config.entity) {
          throw new Error('Please define an entity!');
      }
      this.config = config;
  }

  set hass(hass) {
      this._hass = hass;
      const entityId = this.config.entity;
      const state = hass.states[entityId];
      const stateStr = state ? state.state : 'unavailable';

      // done once
      if (!this.content) {
          // user makes sense here as every login gets it's own instance
          this.innerHTML = `
          <ha-card header="Hello user ${hass.user.name}">
              <div class="card-content"></div>
              <hui-image img= "/workspaces/core/config/www/Events-Manager/rvc.jpeg">
              </hui-image>
          </ha-card>
          `;
          this.content = this.querySelector('div');
      }
  }
  static getStubConfig() {
      return { entity: "sun.sun" }
  }
}



customElements.define("rv-card", RVcard);

window.customCards = window.customCards || [];
window.customCards.push({
type: "rv-card",
name: "RVcard",
preview: false, // Optional - defaults to false

});
