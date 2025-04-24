# Subscription Tracker API

A robust REST API for managing subscription services, built with Node.js, Express, and MongoDB. Features include subscription management, automated renewal reminders, and user authentication.

## 🚀 Features

- **User Management**
  - Registration and authentication
  - JWT-based authorization
  - Password reset functionality
  - User profile management

- **Subscription Management**
  - Create, read, update, and delete subscriptions
  - Track multiple subscriptions per user
  - Support for various currencies and categories
  - Automated renewal tracking

- **Automated Reminders**
  - Email notifications for upcoming renewals
  - Configurable reminder schedules
  - Customizable email templates
  - Powered by QStash for reliable scheduling

- **Security Features**
  - Rate limiting with Arcjet
  - JWT authentication
  - Password hashing
  - Environment-based configurations

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- QStash account (for reminders)
- SMTP server access (for emails)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/subscriptiontracker-api.git
cd subscriptiontracker-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
   - `.env.development.local` for development
   - `.env.production.local` for production

4. Configure environment variables:
```env
# Server
PORT=5500
SERVER_URL=http://localhost:5500

# Database
DB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Arcjet (Rate Limiting)
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

# QStash (Task Scheduling)
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key

# Email
EMAIL_PASSWORD=your_email_password
```

## 🚦 Running the API

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📚 API Documentation

API documentation is available via Swagger UI at `/api-docs` when the server is running.

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Reset password

#### Subscriptions
- `GET /api/v1/subscriptions` - List all subscriptions
- `POST /api/v1/subscriptions` - Create new subscription
- `GET /api/v1/subscriptions/:id` - Get subscription details
- `PUT /api/v1/subscriptions/:id` - Update subscription
- `DELETE /api/v1/subscriptions/:id` - Delete subscription

#### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

## 📦 Project Structure

```
subscriptiontracker-api/
├── config/               # Configuration files
├── controllers/         # Request handlers
├── database/           # Database models and connection
├── middlewares/        # Custom middleware
├── routes/             # API routes
├── utils/              # Utility functions
└── app.js             # Application entry point
```

## 🔒 Security Features

1. **Rate Limiting**
   - Implemented using Arcjet
   - Configurable limits per IP
   - Bot detection and prevention

2. **Authentication**
   - JWT-based token authentication
   - Secure password hashing with bcrypt
   - Token expiration and refresh

3. **Data Validation**
   - Input validation for all endpoints
   - MongoDB schema validation
   - Error handling middleware

## 📧 Email Notifications

The API uses nodemailer for sending email notifications:
- Subscription renewal reminders
- Password reset links
- Account verification

## ⏰ Scheduled Tasks

QStash is used for handling scheduled tasks:
- Subscription renewal reminders
- Status updates
- Automated notifications

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔍 Error Handling

The API implements centralized error handling:
- Custom error classes
- Detailed error messages
- Appropriate HTTP status codes
- Error logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Chimaobi - Initial work - [YourGithub](https://github.com/ceasermikes002)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [QStash](https://upstash.com/)
- [Arcjet](https://arcjet.com/)