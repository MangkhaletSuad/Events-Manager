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

    _currentResource() {
        return this._getResource(this.currentResourceIndex);
    }

    _getResource(index) {
        if (this.resources !== undefined && index !== undefined && this.resources.length > 0) {
          return this.resources[index];
        }
        else {
          return {
            url: "",
            name: "",
            extension: "jpg",
            caption: index === undefined ? "Loading resources..." : "No images or videos to display",
            index: 0
          };
        }
      }

    _popupCamera(evt) {
        const event = new Event("hass-more-info", {
          bubbles: true,
          composed: true
        });
        event.detail = {entityId: this._currentResource().name};
        this.dispatchEvent(event);
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
                <ha-card header="Hello ${hass.user.name}!">
                    <div class="card-content"></div>
                    <hui-image @click="${ev => this._popupCamera(ev)}"
                    .cameraImage=${this._currentResource().name}>
                </hui-image>
                </ha-card>
            `;
            this.content = this.querySelector('div');
        }
        // done repeatedly
        this.content.innerHTML = `
            <p>The ${entityId} is ${stateStr}.</p>
            <video width="320" height="240" controls>
                <source src="${state.attributes.entity_id}" type="application/vnd.apple.mpegurl">
            </video>
        `;
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

