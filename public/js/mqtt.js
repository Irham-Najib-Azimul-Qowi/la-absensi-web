const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

client.on('connect', () => {
  client.subscribe('lintas_alam/attendance_share');
});

client.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString());
  const table = document.getElementById("student-table-body");

  const row = document.createElement("tr");
  row.innerHTML = `<td>${data.name}</td><td>${data.status}</td><td>${data.timestamp}</td><td>${data.course}</td>`;
  table.prepend(row);

  await fetch("https://la-absensi-web.vercel.app/api/save-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
});
