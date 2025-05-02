const mqttBroker = 'wss://broker.emqx.io:8084/mqtt';
const topics = {
    detected: 'lintas_alam/detected_person',
    names: 'lintas_alam/dataset_names',
    schedule: 'lintas_alam/schedule',
    door: 'lintas_alam/door',
    oled: 'lintas_alam/oled',
    flash: 'lintas_alam/lampu',
    auto_door: 'lintas_alam/auto_door'
};

let client;
let attendanceData = [];
let knownNames = [];

const attendanceChart = new Chart(document.getElementById('attendanceChart'), {
    type: 'pie',
    data: {
        labels: ['Hadir', 'Belum Hadir'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    },
    options: {
        responsive: true
    }
});

function connectMQTT() {
    client = new Paho.MQTT.Client(mqttBroker, 'clientId-' + Math.random().toString(16).substr(2, 8));
    client.onConnectionLost = () => console.log('MQTT Connection Lost');
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: () => {
            console.log('Connected to MQTT');
            Object.values(topics).forEach(topic => client.subscribe(topic));
        },
        onFailure: (err) => console.error('MQTT Connection Failed:', err)
    });
}

function onMessageArrived(message) {
    const topic = message.destinationName;
    const payload = JSON.parse(message.payloadString);

    if (topic === topics.detected) {
        saveToMongoDB(payload);
        updateAttendanceTable(payload);
    } else if (topic === topics.names) {
        knownNames = payload.names;
        updateAttendanceChart();
    }
}

function saveToMongoDB(data) {
    fetch('/api/save-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log('Saved to MongoDB:', data))
      .catch(err => console.error('Error saving to MongoDB:', err));
}

function fetchAttendanceData() {
    fetch('/api/get-messages')
        .then(response => response.json())
        .then(data => {
            attendanceData = data;
            updateAttendanceTable();
            updateAttendanceChart();
        })
        .catch(err => console.error('Error fetching data:', err));
}

function updateAttendanceTable(newData = null) {
    if (newData) {
        attendanceData.push(newData);
    }

    const tableBody = document.getElementById('attendance-table-body');
    tableBody.innerHTML = '';

    const sortedData = attendanceData.sort((a, b) => {
        if (a.status === 'Hadir' && b.status !== 'Hadir') return -1;
        if (a.status !== 'Hadir' && b.status === 'Hadir') return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    sortedData.forEach(item => {
        const row = document.createElement('tr');
        row.className = item.status === 'Hadir' ? 'hadir' : '';
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.timestamp}</td>
            <td>${item.course}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateAttendanceChart() {
    const hadirCount = attendanceData.filter(item => item.status === 'Hadir').length;
    const belumHadirCount = knownNames.length - hadirCount;
    attendanceChart.data.datasets[0].data = [hadirCount, belumHadirCount];
    attendanceChart.update();
}

function publishCommand(topic, message) {
    const mqttMessage = new Paho.MQTT.Message(message);
    mqttMessage.destinationName = topic;
    client.send(mqttMessage);
}

function publishOledMessage() {
    const message = document.getElementById('oled-message').value;
    if (message) {
        publishCommand(topics.oled, message);
        document.getElementById('oled-message').value = '';
    }
}

document.getElementById('course-schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const courseName = document.getElementById('course-name').value;
    const date = document.getElementById('schedule-date').value;
    const startTime = document.getElementById('start-time-course').value;
    const endTime = document.getElementById('end-time-course').value;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (endDateTime > startDateTime) {
        const payload = {
            course: courseName,
            start: startDateTime.toISOString().replace('T', ' ').slice(0, 19),
            end: endDateTime.toISOString().replace('T', ' ').slice(0, 19)
        };
        publishCommand(topics.schedule, JSON.stringify(payload));
        alert('Jadwal mata kuliah disimpan!');
    } else {
        alert('Waktu selesai harus lebih besar dari waktu mulai!');
    }
});

document.getElementById('individual-schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const personName = document.getElementById('person-name').value;
    const date = document.getElementById('schedule-date-individual').value;
    const startTime = document.getElementById('start-time-individual').value;
    const endTime = document.getElementById('end-time-individual').value;

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (endDateTime > startDateTime) {
        const payload = {
            person: personName,
            start: startDateTime.toISOString().replace('T', ' ').slice(0, 19),
            end: endDateTime.toISOString().replace('T', ' ').slice(0, 19)
        };
        publishCommand(topics.schedule, JSON.stringify(payload));
        alert('Jadwal perorangan disimpan!');
    } else {
        alert('Waktu selesai harus lebih besar dari waktu mulai!');
    }
});

window.onload = () => {
    connectMQTT();
    fetchAttendanceData();
};