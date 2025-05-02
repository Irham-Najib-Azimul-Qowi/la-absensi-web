LA-Absensi-Web
Web-based attendance system using MQTT, MongoDB Atlas, and Vercel. Deployed on GitHub Pages for frontend and Vercel for backend API.
Features

Dashboard with OpenCV streaming and attendance pie chart
Real-time student attendance table
Course and individual schedule management
Device controls (door, OLED, LED, ultrasonic)
Data storage in MongoDB Atlas

Setup

Fork this repository to AchmadAlvin/la-absensi-web.
Deploy frontend to GitHub Pages.
Deploy backend to Vercel with MongoDB Atlas integration.

Environment Variables

MONGODB_URI: Your MongoDB Atlas connection string (set in Vercel).

Usage

Update public/js/app.js with your ESP32-CAM IP for video streaming.
Access the web app via GitHub Pages URL.

