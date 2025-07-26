# 📊 Excel Analytics

A full-stack, AI-powered Excel data analysis tool built using **React (Vite)** for the frontend and **Node.js (Express)** for the backend. Upload spreadsheets, visualize them through interactive charts, filter data, and gain insights—all in your browser.

---

## 🌐 Live Demos

> ⚠️ **Note:** The full application is hosted on [Render](https://excel-analytics-mern-project.onrender.com/). It may take **1–2 minutes** to wake up due to cold starts.

- 🟢 **Full-Stack MERN App**  
  Developed in collaboration by **Ankit Raj** _(Backend & Deployment)_ and **Kritikya** _(Frontend)_.  
  Includes live file uploads, dynamic visualizations, and AI-powered insights.  
  🔗 [excel-analytic-ddxe.onrender.com](https://excel-analytics-mern-project.onrender.com/)

- ✅ **Frontend Preview (Vercel)**  
  A lightweight static version with sample data for a fast and responsive UI demo.  
  Designed and built by **Kritikya**.  
  🔗 [excel-analytics-ten.vercel.app](https://excel-analytics-ten.vercel.app/)

---

## 🧱 Project Structure

```
excel-analytics/
├── frontend/        # React + Vite + Tailwind + shadcn/ui + Recharts
├── backend/         # Express.js + Multer + XLSX + OpenAI integration
└── README.md        # Root documentation
```

---

## 🚀 Features

- ✅ **Excel & CSV Upload**
- 🧾 **Data Preview** — Sortable, filterable table view
- 📊 **Chart Generation** — Bar, Line, Pie, and Scatter charts using Recharts
- 🔍 **Advanced Filters** — Smart column-based filtering
- 🤖 **AI Insights** — Powered by OpenAI to analyze your data
- 📤 **Export Support** — Export processed charts and datasets
- 📱 **Responsive UI** — Mobile-friendly interface built with Tailwind & shadcn/ui
- ⚡ **Instant Feedback** — Real-time visualization after file upload

---

## 🧑‍💻 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/kartikeyg0104/excel-analytics.git
cd excel-analytics
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to launch the frontend.

---

## 🎯 Usage Flow

1. **Upload Excel/CSV** file using the drag-and-drop uploader
2. **Preview data** in a dynamic table
3. **Filter** records by value or column
4. **Generate charts** for visual analysis
5. **Get AI insights** to understand patterns and anomalies
6. **Export** your final results for use elsewhere

---

## 👥 Contributors

### 👨‍🎨 Kartikey — Frontend Developer

- GitHub: [@kartikey0104](https://github.com/kartikey0104)
- Email: kartikey0104@example.com

### 🧑‍💻 Ankit Raj — Backend & Integration

- GitHub: [@ankitraj217](https://github.com/ankitraj217)
- Email: ankitraj2095@gamil.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📝 Notes

- This tool is intended for small-to-medium datasets.
- For large Excel files or real-time collaboration features, a production-grade infrastructure is recommended.
