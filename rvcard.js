class RVcard extends HTMLElement {
    // private properties
    _config;
    _hass;
    _elements = {};

    // lifecycle
    constructor() {
        super();
        this.doCard();
        this.doStyle();
        this.doAttach();
        this.doQueryElements();
        this.doListen();
    }

    // required
    setConfig(config) {
        this._config = config;
        this.doCheckConfig();
        this.doUpdateConfig();
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
                    <div class="card-content" ${hass.entity.camera}></div>
                    <video width="320" height="240" controls>
                        <source src="rtspUrl: rtsp://192.168.51.109:8554/a2_front_door" type="video/mp4">
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
}

class RVcardEditor extends HTMLElement {
    // private properties
    _config;
    _hass;
    _elements = {};

    // lifecycle
    constructor() {
        super();
        console.log("editor:constructor()");
        this.doEditor();
        this.doStyle();
        this.doAttach();
        this.doQueryElements();
        this.doListen();
    }

    setConfig(config) {
        console.log("editor:setConfig()");
        this._config = config;
        this.doUpdateConfig();
    }

    set hass(hass) {
        console.log("editor.hass()");
        this._hass = hass;
        this.doUpdateHass();
    }

    onChanged(event) {
        console.log("editor.onChanged()");
        this.doMessageForUpdate(event);
    }

    // jobs
    doEditor() {
        this._elements.editor = document.createElement("form");
        this._elements.editor.innerHTML = `
            <div class="row"><label class="label" for="header">Header:</label><input class="value" id="header"></input></div>
            <div class="row"><label class="label" for="entity">Entity:</label><input class="value" id="entity"></input></div>
        `;
    }

    doStyle() {
        this._elements.style = document.createElement("style");
        this._elements.style.textContent = `
            form {
                display: table;
            }
            .row {
                display: table-row;
            }
            .label, .value {
                display: table-cell;
                padding: 0.5em;
            }
        `;
    }

    doAttach() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(this._elements.style, this._elements.editor);
    }

    doQueryElements() {
        this._elements.header = this._elements.editor.querySelector("#header");
        this._elements.entity = this._elements.editor.querySelector("#entity");
    }

    doListen() {
        this._elements.header.addEventListener(
            "focusout",
            this.onChanged.bind(this)
        );
        this._elements.entity.addEventListener(
            "focusout",
            this.onChanged.bind(this)
        );
    }

    doUpdateConfig() {
        this._elements.header.value = this._config.header;
        this._elements.entity.value = this._config.entity;
    }

    doUpdateHass() { }

    doMessageForUpdate(changedEvent) {
        // this._config is readonly, copy needed
        const newConfig = Object.assign({}, this._config);
        if (changedEvent.target.id == "header") {
            newConfig.header = changedEvent.target.value;
        } else if (changedEvent.target.id == "entity") {
            newConfig.entity = changedEvent.target.value;
        }
        const messageEvent = new CustomEvent("config-changed", {
            detail: { config: newConfig },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(messageEvent);
    }
}

customElements.define(
    "rv-card",
    RVcard
);
customElements.define(
    "rv-card-editor",
    RVcardEditor
);


customElements.define('rv-card', RVcard);