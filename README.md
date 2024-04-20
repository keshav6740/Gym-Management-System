# Gym-Management-System


Welcome to the Gym Management System project! This system is designed to manage various aspects of a gym, including user registration, membership management, class attendance tracking, and more.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Technologies Used](#technologies-used)
5. [Contributing](#contributing)
6. [License](#license)

## Features

- User registration and authentication
- Membership management (Basic, Premium, Platinum)
- Class selection and enrollment
- Attendance marking for members
- Admin dashboard for managing users, classes, and memberships
- Responsive web design for seamless user experience on different devices

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/gym-management-system.git
   ```

2. Navigate to the project directory:
   ```bash
   cd gym-management-system
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up MySQL database:
   - Create a MySQL database named `proj` or any preferred name.
   - Import the database schema from `database_schema.sql` located in the project root directory.

5. Configure MySQL connection:
   - Open `backend/server.js`.
   - Modify the MySQL connection settings (`host`, `user`, `password`, `database`) according to your MySQL setup.

6. Start the server:
   ```bash
   npm install -g nodemon
   nodemon App.js
   ```

7. Access the application in your browser at `http://localhost:5000`.

## Usage

- Register as a new user or log in if you already have an account.
- Explore different membership plans and choose one that suits your needs.
- Enroll in classes based on your selected membership.
- Mark your attendance for classes through the user profile page.
- Admins can access the admin dashboard to manage users, classes, and memberships.

## Technologies Used

- Frontend:
  - HTML, CSS, JavaScript
  - Bootstrap (CSS framework)
  - Font Awesome (icon library)

- Backend:
  - Node.js with Express.js (Web framework)
  - MySQL (Database)
  - Body-parser (Middleware for parsing HTTP request bodies)

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/my-feature`).
6. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

---
