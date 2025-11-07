# Task Manager App 🧠

A simple and clean **Task Manager** built using **Node.js** and **vanilla JavaScript**.
This project helped me practice building a full-stack app from scratch — frontend, backend, and local storage — without using any frameworks.

---

## 🚀 Live Demo

* **Frontend:** [https://playful-stroopwafel-003bfd.netlify.app](https://playful-stroopwafel-003bfd.netlify.app)
* **Backend (API):** [https://task-manager-api-sfc8.onrender.com](https://task-manager-api-sfc8.onrender.com)

> The frontend and backend are fully deployed and connected — tasks sync live between both.

---

## ✨ Features

* ➕ Add, edit, delete, and mark tasks as complete
* 📅 Set due dates and organize tasks by category
* 🌗 Switch between dark and light mode
* 🔍 Sort, filter, and search tasks easily
* 💾 Persistent data storage using JSON file
* ⚡ Clean UI and responsive design

---

## 🧠 Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js + Express
**Storage:** JSON file for persistence
**Deployment:** Render (Backend) + Netlify (Frontend)

---

## ⚙️ How to Run Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/hemanth708c/task-manager-nodejs.git
cd task-manager-nodejs
npm install express cors
```

Then start the server:

```bash
node server.js
```

Open the `frontend/index.html` file in your browser.

---

## 🌍 Deployment Setup

### **Backend (Render)**

1. Connect this repository to [Render](https://render.com).
2. Set build command:

   ```bash
   npm install
   ```
3. Set start command:

   ```bash
   node server.js
   ```
4. Deploy and copy your Render API URL (e.g., `https://task-manager-api.onrender.com`).

### **Frontend (Netlify)**

1. Go to [Netlify](https://www.netlify.com/).
2. Upload your `frontend` folder.
3. Update the API endpoint in `index.html`:

   ```js
   const API_BASE = "https://task-manager-api.onrender.com";
   ```
4. Redeploy to connect frontend with backend.

---

## 📘 Project Highlights

* Fully functional full-stack app (no frameworks)
* RESTful API built from scratch
* Clean and modern UI
* Real deployment with live demo links

---

## 📎 Author

**Hemanth J**

* GitHub: [@hemanth708c](https://github.com/hemanth708c)
* LinkedIn: [linkedin.com/in/hemanth708c](https://www.linkedin.com/in/hemanth708c)
