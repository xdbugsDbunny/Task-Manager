
# Task Manager - MERN Stack Project


This is a Task Manager application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The project allows users to manage their tasks efficiently with features like user authentication, task creation, editing, deletion, and more.


## Features

- User Authentication
    - Implemented user registration and login using JWT (JSON Web Token).
    - Passwords are securely hashed using bcrypt to ensure user data protection.
- Task Management
    - Users can create, edit, delete, and mark tasks as complete.
    - Each task includes a title, description, due date, and status (pending/completed).
- Backend
    - Built with Express.js and connected to a MongoDB database.
    - RESTful APIs are used to handle all task-related operations.
    - Includes middleware for error handling and validation.
- Frontend
    - Developed with React.js, utilizing React Router for seamless navigation between pages (e.g., login, task list, task details).
    - Basic styling is applied using CSS, with the option to extend using a UI library like Bootstrap.
- Deployment
    - The application is deployed on Vercel and can be accessed publicly.
    - The app is accessible via this URL: Task Manager Deployed App.
- Other Features
    - Added user-specific task filtering by status or due date.
    - Implemented a priority system for tasks (low, medium, high).
    
- Light/dark mode toggle
## Getting Started

Prerequisites
- Node.js
- MongoDB
- React.js
- Express.js

Installation
- Clone the repository:
    - git clone https://github.com/xdbugsDbunny/Task-Manager.git
        -  

- Install dependencies for both frontend and backend:
    - npm install
        -

- Start the development server for both frontend and backend:
    - npm run dev
        -

- Note: Before starting, ensure you comment/uncomment the CORS origin in api/index.js for localhost or deployed environment. The same applies to the baseURL in App.jsx.
    
```javascript
import Component from 'my-project'

function App() {

    axios.defaults.baseURL = "https://task-manager-black-one.vercel.app";
    axios.defaults.withCredentials = true;
    // axios.defaults.baseURL = "http://localhost:8000";
  return <Component />
}
```

```javascrpit
    app.use(
    cors({
        // origin: "http://localhost:5173",
        origin: "https://task-manager-black-one.vercel.app",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "other-header"],
    })
    );

```

