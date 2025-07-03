# FlexFusion Elite - Gym Management System

Welcome to FlexFusion Elite, a full-stack web application designed to manage a premium fitness center. This system provides a seamless experience for both gym members and administrators, featuring user registration, membership selection, class information, and a complete admin dashboard for managing the gym's operations.

 ## Live Demo
**Application:** https://gym-management-system-1-s1km.onrender.com/

## Table of Contents
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Creating the First Admin User](#creating-the-first-admin-user)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Features

### Member-Facing Features
- **Modern Landing Page:** A visually appealing introduction to the gym.
- **User Registration & Login:** Secure user authentication using JWT (JSON Web Tokens).
- **Membership Selection:** Users can choose from Basic, Premium, and Platinum membership tiers.
- **Dynamic Class Pages:** Dedicated pages for each membership tier, showing available classes.
- **User Profile:** A personal dashboard for members to view their details and stats.
- **Password & Profile Updates:** Members can securely update their name and password.

### Admin Features
- **Secure Admin Login:** Separate, secure login portal for administrators.
- **Dynamic Dashboard:** At-a-glance view of key metrics like total members, revenue, classes, and trainers.
- **Full CRUD Functionality:**
    - **Member Management:** Add, view, edit, and delete gym members.
    - **Class Management:** Create, update, and delete fitness classes.
    - **Trainer Management:** Manage trainer profiles and information.
- **Dynamic Content Loading:** A single-page application feel within the admin panel, where content is loaded without page reloads.


## Tech Stack

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for storing all application data.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT (jsonwebtoken):** For generating and verifying secure authentication tokens.
- **bcrypt.js:** For hashing user passwords before storing them.
- **dotenv:** For managing environment variables.

### Frontend
- **HTML5 & CSS3:** Core markup and styling.
- **Bootstrap 4:** For responsive layout and pre-styled components.
- **Vanilla JavaScript:** For DOM manipulation, API calls (`fetch`), and interactivity.
- **Font Awesome:** For icons.

### Deployment
- **Database:** MongoDB Atlas (M0 Free Tier)
- **Web Service:** Render (Free Tier)
- **Version Control:** Git & GitHub

## Project Structure
```
/
├── config/
│   └── db.js             # Database connection logic
├── middleware/
│   └── authMiddleware.js # JWT verification middleware
├── models/
│   ├── Admin.js
│   ├── User.js
│   ├── Class.js
│   └── Trainer.js
├── public/               # All frontend HTML, CSS, JS files
├── routes/
│   ├── admin.js          # Admin CRUD routes
│   ├── auth.js           # Registration & Login routes
│   └── user.js           # Member-specific routes
├── .env                  # Environment variables (local)
├── .gitignore
├── package.json
├── README.md
├── seedAdmin.js          # Script to create the first admin
└── server.js             # Main Express server
```

## Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a MongoDB Atlas account.
- [Git](https://git-scm.com/)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/flexfusion-gym.git
    cd flexfusion-gym
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment variables file:**
    Create a file named `.env` in the root of the project and add the following, replacing the values as needed:
    ```
    # For local MongoDB installation
    MONGO_URI=mongodb://localhost:27017/flexfusionDB

    # OR, for a MongoDB Atlas cluster
    # MONGO_URI=mongodb+srv://<user>:<password>@cluster-url...

    # A long, random string for JWT
    JWT_SECRET=your_super_secret_random_string_here_12345
    ```

4.  **Start the development server:**
    The server will run on `http://localhost:5000`.
    ```bash
    npm run dev
    ```

### Creating the First Admin User
The application has no public admin registration page. To create the first admin, run the provided seed script.

1.  Configure the desired admin credentials in `seedAdmin.js`.
2.  Run the script from your terminal:
    ```bash
    npm run seed:admin
    ```

## API Endpoints
A brief overview of the available API routes. All `/admin` and `/user` routes are protected.

- **Authentication (`/api/auth`)**
  - `POST /register`: Register a new user.
  - `POST /login`: Log in a user.
  - `POST /admin-login`: Log in an admin.

- **User (`/api/user`)**
  - `GET /profile`: Get the profile of the currently logged-in user.
  - `PUT /profile`: Update the logged-in user's profile.
  - `DELETE /profile`: Delete the logged-in user's account.
  - `POST /membership`: Update the user's membership plan.

- **Admin (`/api/admin`)**
  - `GET /stats`: Get dashboard statistics.
  - `GET /members`, `POST /members`: Manage all members.
  - `GET /members/:id`, `PUT /members/:id`, `DELETE /members/:id`: Manage a single member.
  - `GET /classes`, `POST /classes`, `PUT /classes/:id`, `DELETE /classes/:id`: CRUD for classes.
  - `GET /trainers`, `POST /trainers`, `PUT /trainers/:id`, `DELETE /trainers/:id`: CRUD for trainers.

## Deployment
This project is configured for easy deployment on **Render**.

1.  **Database:** Create a free MongoDB database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/).
2.  **Web Service:** Create a new "Web Service" on [Render](https://render.com) and connect it to your GitHub repository.
3.  **Configuration:**
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
4.  **Environment Variables:** Add your `MONGO_URI` (from Atlas) and `JWT_SECRET` in the Render dashboard environment settings.
5.  **Seed Admin:** After the first deploy, use the "Shell" tab in Render to run `npm run seed:admin` to create your live admin user.

## Future Improvements
- [ ] **Class Booking System:** Implement the backend logic for users to book classes and for admins to see attendance.
- [ ] **Payment Integration:** Integrate a payment gateway like Stripe or Razorpay for membership payments.
- [ ] **Enhanced Analytics:** Build out the analytics page with charts (e.g., using Chart.js) to visualize gym growth and member activity.
- [ ] **Password Reset:** Implement a "Forgot Password" feature using a token-based email service (e.g., Nodemailer + SendGrid).
- [ ] **Image Uploads:** Allow admins to upload images for trainers and classes.
