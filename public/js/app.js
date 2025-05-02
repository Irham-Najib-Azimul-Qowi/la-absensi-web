document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    updateStudentTable();
    updateAttendanceChart();
    setVideoStream();
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`a[href="#${tabId}"]`).classList.add('active');
}

function setVideoStream() {
    const streamUrl = 'http://your-esp32-cam-ip/stream'; // Ganti dengan IP ESP32-CAM
    document.getElementById('video-stream').src = streamUrl;
}

function updateStudentTable(data) {
    fetch('https://your-vercel-app.vercel.app/api/get-messages')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('student-table-body');
            tableBody.innerHTML = '';
            const students = {};
            data.forEach(item => {
                students[item.name] = {
                    status: item.status,
                    timestamp: item.timestamp,
                    course: item.course
                };
            });
            Object.keys(students).sort((a, b) => {
                if (students[a].status === 'Hadir' && students[b].status !== 'Hadir') return -1;
                if (students[a].status !== 'Hadir' && students[b].status === 'Hadir') return 1;
                return 0;
            }).forEach(name => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${students[name].status}</td>
                    <td>${students[name].timestamp}</td>
                    <td>${students[name].course}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error updating table:', error));
}

document.getElementById('course-schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const courseName = document.getElementById('course-name').value;
    const date = document.getElementById('course-date').value;
    const startTime = document.getElementById('course-start-time').value;
    const endTime = document.getElementById('course-end-time').value;
    const startDatetime = new Date(`${date}T${startTime}`);
    const endDatetime = new Date(`${date}T${endTime}`);
    if (endDatetime > startDatetime) {
        const payload = {
            course: courseName,
            start: startDatetime.toISOString().replace('T', ' ').slice(0, 19),
            end: endDatetime.toISOString().replace('T', ' ').slice(0, 19)
        };
        mqttClient.publish('lintas_alam/schedule', JSON.stringify(payload));
        alert('Jadwal mata kuliah disimpan!');
    } else {
        alert('Waktu selesai harus lebih besar dari waktu mulai!');
    }
});

document.getElementById('individual-schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const personName = document.getElementById('person-name').value;
    const date = document.getElementById('individual-date').value;
    const startTime = document.getElementById('individual-start-time').value;
    const endTime = document.getElementById('individual-end-time').value;
    const startDatetime = new Date(`${date}T${startTime}`);
    const endDatetime = new Date(`${date}T${endTime}`);
    if (endDatetime > startDatetime) {
        const payload = {
            person: personName,
            start: startDatetime.toISOString().replace('T', ' ').slice(0, 19),
            end: endDatetime.toISOString().replace('T', ' ').slice(0, 19)
        };
        mqttClient.publish('lintas_alam/schedule', JSON.stringify(payload));
        alert('Jadwal perorangan disimpan!');
    } else {
        alert('Waktu selesai harus lebih besar dari waktu mulai!');
    }
});