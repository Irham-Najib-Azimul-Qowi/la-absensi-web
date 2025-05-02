const mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe('lintas_alam/detected_person');
    mqttClient.subscribe('lintas_alam/attendance_share');
    mqttClient.subscribe('lintas_alam/door');
    mqttClient.subscribe('lintas_alam/auto_door');
});

mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log(`Received on ${topic}:`, data);

    if (topic === 'lintas_alam/detected_person' || topic === 'lintas_alam/attendance_share') {
        saveToMongoDB(data);
        updateStudentTable(data);
        updateAttendanceChart();
    } else if (topic === 'lintas_alam/door' || topic === 'lintas_alam/auto_door') {
        console.log(`Door status: ${data.status}`);
    }
});

function publishCommand(topic, message) {
    mqttClient.publish(topic, message);
}

function publishOledMessage() {
    const message = document.getElementById('oled-message').value;
    if (message) {
        publishCommand('lintas_alam/oled', message);
        document.getElementById('oled-message').value = '';
    }
}

function saveToMongoDB(data) {
    fetch('https://your-vercel-app.vercel.app/api/save-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => console.log('Saved to MongoDB:', result))
    .catch(error => console.error('Error saving to MongoDB:', error));
}