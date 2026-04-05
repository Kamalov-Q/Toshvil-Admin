# Toshvil-Admin

A modern, high-performance administrative dashboard built with React 19, Vite, and Tailwind CSS. This project is designed to manage administrative tasks for the Toshvil platform, including Lot management, Districts, and News.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://reacthottoast.com/)

## ✨ Key Features

- **Lot Management**: Comprehensive CRUD operations for auction and tender lots.
- **District Management**: Manage administrative districts and regions.
- **News Management**: Publish and manage platform-wide news and updates.
- **Authentication**: Secure JWT-based authentication with auto-refresh tokens.
- **Responsive Design**: Fully responsive UI built with a modern aesthetic.
- **Advanced Filters**: Real-time filtering and search for all data tables.

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kamalov-Q/Toshvil-Admin.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API URLs:
   ```env
   VITE_API_URL=https://your-api-url.com/api
   VITE_WS_URL=https://your-api-url.com/lots
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/api`: Axios instance and global API configurations.
- `src/components`: Shared UI components (Shadcn UI based).
- `src/features`: Feature-based modules (lots, districts, news, auth).
- `src/pages`: Top-level page components synchronized with routing.
- `src/store`: Global state management using Zustand.
- `src/utils`: Helper functions and formatters.

## 🚢 Deployment

The project is configured for easy deployment on **Vercel**. A `vercel.json` file is included to handle SPA routing correctly.

```bash
# Build for production
npm run build
```

---

Developed with ❤️ for Toshvil platform.
