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

- From `/control`, you can set the timer duration, start, pause, reset, and write live notes.  
- A global state is kept on the backend and automatically synced with all connected clients.  
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

- [http://localhost:5173/control](http://localhost:5173/control) → control panel  
- [http://localhost:5173/display](http://localhost:5173/display) → speaker display (for OBS)

---

## 🎥 Using with OBS

To project the speaker screen using **OBS (Open Broadcaster Software):**

1. Open OBS and create a new scene, e.g. `Speaker Monitor`.
2. Add a **Browser Source**:
   - **URL:** `http://localhost:5173/display`
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

