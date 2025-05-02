function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.querySelector(`[href="#${tabId}"]`).classList.add('active');
}

const streamUrl = "http://192.168.1.100/stream"; // Ganti dengan IP ESP32-CAM
document.getElementById('video-stream')?.setAttribute('src', streamUrl);
