# Personal Finance Tracker – Frontend

This is the frontend for the Personal Finance Tracker application, built with **React.js** and **Vite**. It provides a modern, responsive user interface for managing and visualizing personal finances.

## Features

- User authentication and secure session management
- Add, view, edit, and delete financial records
- Categorize expenses and income
- Visualize spending with charts and analytics
- Upload and view receipt images
- Responsive design for mobile and desktop
- Dark mode support

## Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** Tailwind CSS, DaisyUI
- **State Management:** React Context API / Redux (if used)
- **API:** Connects to a Node.js/Express backend

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/PersonalFinanceTrackerFrontend.git
   ```

2. **Navigate to the frontend directory:**

   ```bash
   cd PersonalFinanceTracker/client
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**  
   Create a `.env.local` file in the `client` directory and add:

   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_IMAGE_BASE=https://your-backend-url.onrender.com/uploads/userImg/
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173` by default.

## Usage

- Register or log in to your account.
- Add new financial records.
- View and manage your expenses and income.
- Visualize your spending with charts.

## Deployment

- Deploy the frontend to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).
- Set the same environment variables (`VITE_API_URL`, `VITE_IMAGE_BASE`) in your deployment dashboard.

## Contributing

Contributions are welcome! Please submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

Rahul Sharma - [GitHub](https://github.com/Sharma7422)

Project Link: [https://github.com/Sharma7422/PersonalFinanceTrackerFrontend.git](https://github.com/Sharma7422/PersonalFinanceTrackerFrontend.git)

## Acknowledgements

- React.js
- Vite
- Tailwind CSS
- DaisyUI
- Chart.js or Recharts (if used)
- Node.js & Express (backend)
- MongoDB (backend)
