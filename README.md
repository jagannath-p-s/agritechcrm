Here's a comprehensive `README.md` file for your project, detailing setup instructions and explaining the functionality.

---

# AgritechCRM

AgritechCRM is a simple CRM application built with React, Supabase, and Tailwind CSS. It includes authentication, allowing the first user who registers to become the admin by providing their email and password on the first login attempt. All other users can log in once the admin account exists.

## Table of Contents
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Notes](#notes)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/agritechcrm.git
   cd agritechcrm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Install additional packages:**
   ```bash
   npm install react-router-dom
   npm install @supabase/supabase-js
   npm install bcryptjs
   ```

## Project Structure

```
agritechcrm/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── LoginPage.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── supabaseClient.jsx
├── .env
├── .gitignore
└── tailwind.config.js
```

## Setup

1. **Configure Tailwind CSS**

   Update `tailwind.config.js` as follows:

   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

   Add the following to the top of `index.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Create a Supabase Project**

   - Sign in or create a new account on [Supabase](https://supabase.com/).
   - Create a new project in the Supabase dashboard.

3. **Set up the Users Table in Supabase**

   In Supabase's SQL Editor, run the following code to create the `users` table:

   ```sql
   create table users (
       id serial primary key,
       email text not null unique,
       hashed_password text not null,
       created_at timestamp with time zone default now()
   );
   ```

4. **Set Up Environment Variables**

   - Create a `.env` file in the root directory with the following content:

     ```bash
     VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
     VITE_SUPABASE_KEY=your-supabase-anon-key
     ```

   - Ensure `.env` is added to `.gitignore` to keep sensitive information secure.

5. **Initialize Supabase Client**

   Create `src/supabaseClient.jsx` with the following code:

   ```javascript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

   if (!supabaseUrl || !supabaseKey) {
     throw new Error('Supabase URL and Key must be provided.');
   }

   export const supabase = createClient(supabaseUrl, supabaseKey);

   supabase.auth.onAuthStateChange((event, session) => {
     if (session) {
       localStorage.setItem('supabase.auth.token', session.access_token);
       localStorage.setItem('user', JSON.stringify(session.user));
     } else {
       localStorage.removeItem('supabase.auth.token');
       localStorage.removeItem('user');
     }
   });
   ```

## Usage

### Running the Project

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```

2. **Visit `http://localhost:3000` in your browser.**

### Admin Registration and Login

- **First Login**: The first user who logs in will automatically be registered as the admin.
- **Subsequent Logins**: Any additional users can log in if an admin account exists in the database.
- **Logout**: Users can log out, which clears their session from `localStorage`.

### Pages

- **LoginPage.jsx**: Handles registration and login. If no user exists in the database, it registers the first user as the admin.
- **HomePage.jsx**: Displays a welcome message and allows the user to log out.

### Routes

- `"/"`: Protected route displaying `HomePage` if logged in.
- `"/login"`: Displays `LoginPage` for logging in or registering.

## Technologies Used

- **React**: Frontend framework
- **Supabase**: Database and authentication service
- **Tailwind CSS**: Utility-first CSS framework
- **bcrypt.js**: For hashing passwords
- **React Router**: For routing

## Notes

1. **Environment Variables**: Make sure to keep `.env` files out of version control.
2. **Admin Creation**: The first login automatically creates the admin. Ensure this first login is by the intended admin user.
3. **Session Management**: The user's session is stored in `localStorage`. This includes an expiry date of 15 days for the session.

## Sample Gitignore

Here's a `.gitignore` file sample for this project:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Env files 
*.env
```

---