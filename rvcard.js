class RVcard extends HTMLElement{

  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Hello ${hass.user.name}!">
          <div class="card-content">
          <br><br>
          <img id="cameraImage" src="${'entity: "camera.192_168_51_109"'}" alt="Camera Image">
          <br><br>
          <video  width="320" height="240" controls>
            <source src="${'entity: "camera.192_168_51_109"'}" type="application/vnd.apple.mpegurl">
          </video> 
          <br><br>
          <video src="rtsp://192.168.51.109:8554/barrier_gate_in" controls></video>
          </div>
        </ha-card>
      `;
      this.content = this.querySelector("div");
    }
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    const cameraImage = document.getElementById('cameraImage');

    // URL ของ entity camera ของคุณ
    const cameraEntityUrl = 'camera.192_168_51_109'; // แทนด้วย URL ของ entity ของคุณ

    // เรียกข้อมูลภาพจาก entity camera
    fetch(cameraEntityUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // แสดงภาพบน HTML element
        cameraImage.src = URL.createObjectURL(blob);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });


    this.content.innerHTML = `
      The state of ${entityId} is ${stateStr}!
      <br><br>
        <img id="cameraImage" src="" alt="Camera Image">
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
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rv-card",
  name: "RVcard",
});

customElements.define("rv-card", RVcard);