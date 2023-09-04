import { LitElement, html, css } from 'lit-element';

class RVcard extends HTMLElement {
    render() {
        return html`
          <ha-card header="Hello user ${hass.user.name}">
            <img src="[[cameraEntityImageUrl]]" />
          </ha-card>
        `;
      }

      static get properties() {
        return {
          hass: { type: Object },
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

      set hass(hass) {
        this.cameraEntityImageUrl = hass.states[this.config.camera_entity].attributes.entity_picture;
        this._hass = hass;
      }
    }



customElements.define("rv-card", RVcard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
  preview: false, // Optional - defaults to false

});

