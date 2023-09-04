import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
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
            return {
                views: [{
                    "card": [
                        {
                            "type": "custom:gallery-card",
                            "entities":
                              "- camera.192_168_51_109_2",
                            "maximum_files": "10",
                            "menu_alignment": "Responsive"
                        }
                    ]
                }]
            }
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

