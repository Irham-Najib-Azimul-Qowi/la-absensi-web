let attendanceChart;

function initializeChart() {
    const ctx = document.getElementById('attendance-chart').getContext('2d');
    attendanceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Hadir', 'Tidak Hadir'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Persentase Kehadiran' }
            }
        }
    });
}

function updateAttendanceChart() {
    fetch('https://your-vercel-app.vercel.app/api/get-messages')
        .then(response => response.json())
        .then(data => {
            const totalStudents = new Set(data.map(item => item.name)).size;
            const presentStudents = new Set(data.filter(item => item.status === 'Hadir').map(item => item.name)).size;
            const absentStudents = totalStudents - presentStudents;
            attendanceChart.data.datasets[0].data = [presentStudents, absentStudents];
            attendanceChart.update();
        })
        .catch(error => console.error('Error updating chart:', error));
}