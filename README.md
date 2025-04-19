# 🚀 LCPL CRM

**LCPL (Liquefied Cylinder Processing Line) CRM** is a powerful web-based application built with **React**, **Tailwind CSS**, **Material UI**, and **Vite**, designed to manage cylinder lifecycles, vendor and manufacturer data, and generate detailed reports.

---

## 📁 Project Structure

Directory structure:
└── ag-solutions-bangalore-lcpl-crm.git/
├── README.md
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vercel.json
├── vite.config.js
├── public/
└── src/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
├── assets/
├── base/
│ └── BaseUrl.jsx
├── components/
│ ├── DashboardNavbar.jsx
│ ├── Footer.jsx
│ ├── Loader.jsx
│ ├── Logout.jsx
│ ├── ProtectedRoute.jsx
│ ├── ScannerModel.jsx
│ ├── SearchableSelect.jsx
│ └── SideNav.jsx
├── layout/
│ └── Layout.jsx
├── pages/
│ ├── auth/
│ │ ├── ForgetPassword.jsx
│ │ ├── SignIn.jsx
│ │ └── SIgnUp.jsx
│ ├── cylinder/
│ │ ├── AddCylinder.jsx
│ │ ├── AddCylinderSub.jsx
│ │ ├── Cylinder.jsx
│ │ ├── CylinderEdit.jsx
│ │ └── CylView.jsx
│ ├── maintenance/
│ │ └── Maintenance.jsx
│ ├── master/
│ │ ├── manufacturer/
│ │ │ ├── AddManufacturer.jsx
│ │ │ ├── EditManufacturer.jsx
│ │ │ └── Manufacturer.jsx
│ │ └── vendor/
│ │ ├── AddVendor.jsx
│ │ ├── EditVendor.jsx
│ │ └── Vendor.jsx
│ ├── profile/
│ │ └── ChangePassword.jsx
│ ├── reports/
│ │ ├── cylinderReport/
│ │ │ ├── FormCylinderDetails.jsx
│ │ │ └── ReportCylinderDetails.jsx
│ │ ├── manufacturer/
│ │ │ └── ReportManufacturer.jsx
│ │ ├── report/
│ │ │ ├── ReportForm.jsx
│ │ │ ├── ReportOne.jsx
│ │ │ └── ReportTwo.jsx
│ │ └── vendor/
│ │ └── ReportVendor.jsx
│ ├── userPage/
│ │ └── UserViewCylinder.jsx
│ └── ViewCylinder/
│ └── ViewCylinder.jsx
└── utils/
├── ContextPanel.jsx
└── DateYear.jsx

🔧 Tech Stack
⚛️ React 18

⚡ Vite

🎨 Tailwind CSS 3

🧱 Material UI + Material Tailwind

🌐 React Router 6

🔗 Axios

📊 ApexCharts, jsPDF, html2canvas

🕒 Moment.js

🔔 React Toastify, React Hot Toast

🎯 Icon Libraries: Lucide, Heroicons, React Icons

- **React Toastify & React Hot Toast**

## Features

🔐 Authentication (Sign In / Sign Up / Forgot Password)

🧪 Cylinder Management (Create, View, Edit Sub-Cylinders)

🧾 Vendor & Manufacturer Master Modules

📊 Real-time Reports (Cylinders, Vendors, Manufacturers)

📦 Barcode-based Cylinder Lookup

⚙️ Admin Controls with Role-Based Routing

📈 Charts, PDF Exports, Screenshots, and more!

## 💻 Setup & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ag-solutions-bangalore-lcpl-crm.git

# Navigate into the project
cd ag-solutions-bangalore-lcpl-crm

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Environment Variables

## Make sure to create a .env file with the following:

**env**
VITE_API_BASE_URL=https://your-api-url.com
⚡ Deployment
This project is ready for deployment on Vercel, configured via vercel.json.

## 🙌 Contributing

If you'd like to contribute or report issues, feel free to fork the repo and create a PR.

📄 License
MIT © 2025 AG Solutions Bangalore

## Let me know if you'd like a version with screenshots, badges, or instructions for setting up mock APIs or admin panels too!
