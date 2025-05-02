let chart;
async function loadChart() {
  const res = await fetch("https://la-absensi-web.vercel.app/api/get-messages");
  const data = await res.json();

  let hadir = 0, absen = 0;
  const now = new Date();

  data.forEach(d => {
    const waktu = new Date(d.timestamp);
    const delay = (now - waktu) / (1000 * 60);
    if (delay <= 60) hadir++;
    else absen++;
  });

  const ctx = document.getElementById("attendance-chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Hadir", "Belum Hadir"],
      datasets: [{
        data: [hadir, absen],
        backgroundColor: ["#4CAF50", "#F44336"]
      }]
    }
  });
}

document.addEventListener("DOMContentLoaded", loadChart);
