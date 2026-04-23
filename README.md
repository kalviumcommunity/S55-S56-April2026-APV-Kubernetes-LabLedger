# LabLedger

**LabLedger** is a high-performance, professional laboratory supply chain ledger designed to streamline consumable management. It provides a real-time, role-based platform for tracking inventory, recording usage, and maintaining a comprehensive audit trail for modern research environments.

<img width="1917" height="859" alt="image" src="https://github.com/user-attachments/assets/8a9ec14d-fda0-4b57-9a3f-8e414cdc8d98" />


---

## Key Features

- **Intelligent Dashboard**: Real-time analytics on stock levels, consumption trends, and critical alerts for low or expired inventory.
- **Global Inventory Management**: Centralized repository for all lab consumables with advanced filtering and search capabilities.
- **Atomic Usage Tracking**: Secure, transactional stock deduction system that prevents race conditions and ensures data integrity.
- **Audit Ledger**: A permanent, searchable history of every addition, update, and usage event across the lab.
- **Role-Based Access Control (RBAC)**:
  - **Admins**: Full CRUD permissions for inventory items and system settings.
  - **Staff**: Specialized access for usage logging and ledger review.
- **Dynamic Interface**: Sleek, responsive design with native Dark Mode support and premium micro-animations.

---

## Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/kalviumcommunity/S55-S56-April2026-APV-Kubernetes-LabLedger.git
cd LabLedger
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Schema
Ensure your Supabase instance has the required tables (`items`, `transactions`, `profiles`) and the `handle_usage` RPC function. Refer to `schema.txt` for details.

### 5. Run Locally
```bash
npm run dev
```

---

## 📸 Screenshots

| Dashboard View | Inventory Management |
| :---: | :---: |
| <img width="1917" height="859" alt="image" src="https://github.com/user-attachments/assets/cbbdce99-c350-4d34-95c5-f4b488e4abb8" /> | <img width="1912" height="852" alt="image" src="https://github.com/user-attachments/assets/f9274385-d270-4a0a-8810-2fa59e0d88d1" /> |

| Usage Logging | Inventory Analytics |
| :---: | :---: |
| <img width="1808" height="832" alt="image" src="https://github.com/user-attachments/assets/315598c6-81c3-46c8-a7c7-10e909235404" /> | <img width="1915" height="780" alt="image" src="https://github.com/user-attachments/assets/34c4b765-ec6f-4e13-a1d4-13f764515bb4" /> |

---

## 🔮 Future Improvements

- [ ] **Predictive Procurement**: AI-driven restock forecasting based on historical usage.
- [ ] **QR/Barcode Integration**: Mobile-friendly scanning for rapid check-in/out of items.
- [ ] **Supplier Integration**: Automated purchase order generation for preferred vendors.
- [ ] **Batch Tracking**: Enhanced tracking for specific lot numbers and storage locations.
- [ ] **Custom Exporting**: Advanced report generation in CSV, PDF, and Excel formats.

---

