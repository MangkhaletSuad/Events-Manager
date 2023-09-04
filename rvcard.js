class RVcard extends HTMLElement {
    config;
    content;

    setConfig(config) {
        if (!config.entity) {
            throw new Error('Please define an entity!');
        }
        this.config = config;
    }

    set hass(hass) {
        const entityId = this.config.entity;
        const state = hass.states[entityId];
        const stateStr = state ? state.state : 'unavailable';

        // done once
        if (!this.content) {
            // user makes sense here as every login gets it's own instance
            this.innerHTML = `
                <ha-card header="Hello ${hass.user.name}!">
                    <div class="card-content"></div>
                    <video width="320" height="240" controls>
                        <source src=${'entity: "camera.192_168_51_109"'} type="video/mp4">
                    </video>

                    <video width="320" height="240" controls>
                        <source src="/api/camera_proxy/camera.192_168_51_109" type="video/mp4">
                    </video>

                    <video width="320" height="240" controls>
                        <source src="${this.getStubConfig().entity}" type="video/mp4">
                    </video>

                </ha-card>
            `;
            this.content = this.querySelector('div');
        }
        // done repeatedly
        this.content.innerHTML = `
            <p>The ${entityId} is ${stateStr}.</p>
        `;
    }
    static getStubConfig() {
        return { entity: "camera.192_168_51_109" }
    }
}



customElements.define("rv-card", RVcard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
  preview: false, // Optional - defaults to false

});

