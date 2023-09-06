function submessage () {
  const mqtt = require('mqtt');
  const options = {
      host: '192.168.51.101',
      port: 1883,
      username: 'rvc',
      password: 'P@ssw0rd'
    };

    // mqtt.readFile('/test.html', function(error, html) {
    //   if (error) throw error;
    //   HTMLOutputElement.createServer(function(request, response){
    //     response.writeHeader(200, {"Content-Type": "text/html"});
    //     response.write(html);
    //     response.end();
    //   }).listen(PORT)
    // });

    const client = mqtt.connect(options);

    client.on('connect', function () {
      console.log('Connected')
      client.subscribe('Test', function (err) {
        if (!err) {
          client.publish('Test', 'Hello mqtt')
        }
      });
    });

    client.on('message', function (topic, message) {
      console.log(`Received message on topic ${topic}: ${message}`);
      updateHTML(message.toString());
    });

    function updateHTML(message) {
      const messageElement = document.getElementById('mqtt-message');
      messageElement.innerHTML = message;
    }

}