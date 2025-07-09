# 📊 Excel Analytics

A full-stack AI-powered Excel data analysis tool built with React (Vite) on the frontend and Express (Node.js) on the backend. Users can upload spreadsheets, visualize them with dynamic charts, filter and explore data, and receive AI-generated insights.

---

## 🧱 Project Structure

```
excel-analytics/
├── frontend/    # Vite + React UI (Tailwind, shadcn/ui, Recharts)
├── backend/     # Express API (Multer, XLSX, OpenAI integration)
└── README.md    # Root documentation
```

---

## 🚀 Features

- **File Upload**: Support for Excel (.xlsx, .xls) and CSV files
- **Data Preview**: Interactive table view with sorting and filtering
- **Chart Generation**: Multiple chart types (Bar, Line, Pie, Scatter) using Recharts
- **Data Filtering**: Advanced filtering options with search functionality
- **Insights**: AI-powered data insights and analytics
- **Export Options**: Export processed data and charts
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui
- **Real-time Updates**: Instant data processing and visualization

---

## 🧑‍💻 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/kartikeyg0104/excel-analytics.git
cd excel-analytics
```

### 2. Run Backend

```bash
cd backend
npm install
cp .env.example .env   # Add your OpenAI API key
npm run dev
```

### 3. Run Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to get started.

---

## 🎯 Usage

1. **Upload Data**: Click the upload area or drag & drop your Excel/CSV file
2. **Preview Data**: Review your data in the interactive table
3. **Apply Filters**: Use the filters tab to search and filter your data
4. **Generate Charts**: Create visualizations using the chart generator
5. **View Insights**: Get AI-powered insights about your data
6. **Export Results**: Download your processed data or charts

## 👥 Contributors

**Kartikey** – Frontend UI/UX

- GitHub: [@kartikey0104](https://github.com/kartikey0104)
- Email: kartikey0104@example.com

**Ankit Raj** – Backend & Integration

- GitHub: [@ankitraj217](https://github.com/ankitraj217)
- Email: ankitraj2095@gamil.com

---

## 📄 License

Licensed under the [MIT License](LICENSE).
