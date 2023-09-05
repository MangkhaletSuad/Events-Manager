import { html, css, LitElement } from 'lit';

export class RVcard extends LitElement{
  static styles = css`
    ha-card {
      height: 100%;
      overflow: hidden;
    }
    .content {
        overflow: hidden;
      }
      .content hui-card{
        max-width: 100%;
      }
  `;
    render() {
        return html`
          <ha-card header="Hello ${this._hass.user.name}">
            <div class="card-content">
              <div class="hui-card">
                <img src="[[this.cameraEntityImageUrl]]" />
              </>
            </div>
          </ha-card>
        `;
      }

      static get properties() {
        return {
          config: { type: Object },
          cameraEntityImageUrl: { type: String },
        };
      }

    static getStubConfig() {
        return { entity: "sun.sun" }
    }

  setConfig(config) {
      if (!config.camera_entity) {
        throw new Error('Missing camera_entity in card configuration');
      }
        this.config = config;
      }

  set hass(value) {
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";
    this.cameraEntityImageUrl = value.states[this.config.camera_entity].attributes.entity_picture;
    this._hass = value;
  }
}



customElements.define("rv-card", RVcard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
  preview: false, // Optional - defaults to false

});

