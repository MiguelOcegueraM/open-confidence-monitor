# 🎤 Confidence Monitor

A simple, open-source **confidence monitor** screen for speakers.  
Control the timer and live notes from `/control`, and display them in full-screen mode from `/display`.

---

## ✨ Overview

The **Confidence Monitor** was originally built during the **JSConf Mexico 2025** edition at Guadalajara Mexico, in the middle of the rush to prepare everything for the conference, we realized we needed a **speaker timer and notes system** that just worked.  

So we coded this project overnight, used it successfully on stage, and now we’re sharing it so **any community in the world** can benefit from it.  

It provides two synchronized views:
- **/control** → Control panel for the stage manager or organizer.  
- **/display** → Speaker view (ideal for OBS or projector display).

Built with simplicity and accessibility in mind, this project helps **tech communities and organizers** deliver smoother, more professional events.

---

## 🧠 Technologies Used

- **Node.js** and **Express** for the HTTP server that manages shared state.
- **ws** for real-time WebSocket communication and state synchronization.
- **React 18**, **React Router DOM**, and **Vite** for a fast, modular SPA frontend.
- **Browser WebSockets** to synchronize the control and display views.
- **npm workspaces** and **concurrently** to orchestrate client and server during development.

---

## ⚙️ What the Application Does

- From `/control`, you can set the timer duration, start, pause, reset, and write notes. Notes are sent to the speaker with **Send to display** (or ⌘/Ctrl + Enter), never mid-typing.  
- A global state is kept on the backend and automatically synced with all connected clients.  
- The timer keeps counting into negative time (`-01:23`) when the speaker runs over.  
- Clients compute the countdown locally from the server's end time, so the display stays smooth and keeps running through short network drops, and reconnects automatically.  
- Only clients with the control token can change the timer or notes.  
- The `/display` view is designed for **OBS** or **projectors**, showing a full-screen timer and live notes for the speaker.  
- Includes visual feedback:
  - A **⏸️ “Paused”** banner when the timer stops.
  - A **⚠️ “Connection lost”** message if the WebSocket disconnects.
  - Adaptive text sizing for different screen resolutions.

---

## 🚀 Getting Started

### 1️⃣ Clone or create the project

```bash
git clone <repo>
cd confidence-monitor
```

### 2️⃣ Install dependencies

```bash
cd server && npm install
cd ../client && npm install
# Optional (for the combined command)
cd .. && npm install
```

### 3️⃣ Run the backend

```bash
cd server
npm run dev
# or
node index.js
```

### 4️⃣ Run the frontend

```bash
cd ../client
npm run dev
```

### 5️⃣ Open in your browser

When the server starts it prints the control token and ready-to-use URLs, including your LAN IP:

```
Control token: 3f9a1c2e
  Control: http://192.168.1.42:5173/control?token=3f9a1c2e
  Display: http://192.168.1.42:5173/display
```

- `/control?token=…` → control panel (the token is remembered in that browser)
- `/display` → speaker display (for OBS, or any laptop/tablet on the same network)

The token is random on every run. Set `CONTROL_TOKEN` to keep a fixed one:

```bash
CONTROL_TOKEN=my-secret npm run dev
```

If the WebSocket server is not on the same host as the page on port 3000, set `VITE_WS_URL`
(e.g. `VITE_WS_URL=ws://10.0.0.5:3000`) or `VITE_WS_PORT` when running the client.

---

## 🎥 Using with OBS

To project the speaker screen using **OBS (Open Broadcaster Software):**

1. Open OBS and create a new scene, e.g. `Speaker Monitor`.
2. Add a **Browser Source**:
   - **URL:** `http://localhost:5173/display` (no token needed)
   - **Width:** 1920 (or your screen resolution)
   - **Height:** 1080
3. Right-click on the preview → **Fullscreen Projector (Display 2)** to send it to the stage monitor or projector.
4. Done — speakers can now see their timer and notes live.

---

## 🎁 Included Features

- **⏸️ Pause banner** when the timer is stopped.
- **Automatic font scaling** for the timer based on viewport size.
- **⚠️ Connection lost warning** when the WebSocket disconnects.
- Combined script `npm run dev:all` (requires root dependencies installed).

---

## 💬 Why This Exists

This project was created during **JSConf Mexico 2025** as a last-minute necessity before the event.  
We wanted our speakers to have a **professional confidence monitor** - simple, reliable, and made by the same community that runs the event.

After seeing how well it worked, we decided to **open source it** so any organizer can use or adapt it for their own conferences.

---

## 🤝 Contributing

We welcome all kinds of contributions — from code improvements to documentation, UX ideas, or translations.

If you want to help other communities benefit from this tool, feel free to fork it and submit a Pull Request.

### 🧭 Contribution Rules
1. Fork the repository and create your branch from `main`.  
   Example: `feature/add-timer-alerts`
2. Follow clean code practices and comment where useful.  
3. Run and test your changes locally.  
4. Submit a clear and descriptive **Pull Request (PR)**.  
5. Be kind and collaborative — this project exists to help communities thrive. ❤️

---

## 🪶 License

This project is open-source under the **MIT License**.  
You are free to use, modify, and distribute it — attribution is appreciated.

---

## 🌍 Made by the Community, for the Community

Originally developed for **JSConf Mexico 2025**, this project continues to grow thanks to volunteers, contributors, and open-source enthusiasts who believe that **tech belongs to everyone — and so does the stage.**

If you use it at your event, let us know or tag us on social media!  **@jsconfmx**
We’d love to see your setup and improvements.

