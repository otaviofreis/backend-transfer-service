👤 Developed by
Otavio Reis
🔗 linkedin.com/in/otavio-reis-19752226b

# 💸 Simplified Wallet API

The **Simplified Wallet API** is a RESTful application built with **NestJS** and **MongoDB**, simulating a basic payment system inspired by PicPay. The main focus is the **money transfer between users**, following business rules, validations, and external service integrations.

---

## 🔧 Technologies Used

- **NestJS** – Node.js Framework
- **MongoDB** – NoSQL Database
- **Mongoose** – MongoDB ODM
- **Docker** – Containerization (MongoDB)
- **Jest** – Automated Tests
- **Axios** – HTTP Requests
- **TypeScript** – Static Typing
- **class-validator** – DTO Validations
- **Swagger** – API Documentation (if enabled)

---

## 📁 Project Structure

```bash
src/
├── users/             # User module (COMMON or MERCHANT)
├── wallets/           # Wallet module
├── transactions/      # Transfer module
├── notifications/     # Simulated external notification service
├── entities/          # Interfaces and enums
├── app.module.ts      # Main application module

###################################

🧰 Installation, Execution & Testing


# 1. Clone the repository
git clone https://github.com/your-username/your-repository.git
cd your-repository

# 2. Install dependencies
npm install

# 3. Configure the .env file based on .env.example
echo "MONGO_URI=mongodb://localhost:27017/picpay-clone" > .env

# 4. Start MongoDB using Docker
docker run --name mongo -p 27017:27017 -d mongo

# 5. Start the application
npm run start:dev

# 6. Run the tests
npm run test


###################################

📫 Main Endpoint

POST /transfer


Request example:
{
  "value": 100.0,
  "payerId": "payer-id",
  "payeeId": "payee-id"
}

###################################

✅ Requirements Met
 Transfers between users

 Merchants cannot send money

 Balance validation before transfer

 External authorization API integration (GET)

 External notification API integration (POST)

 Atomic operations for consistency

 MongoDB with real data persistence

 Docker for MongoDB container

 Environment variables with .env

 Unit and integration tests with Jest

 Clean and modular codebase

###################################

 🧼 Best Practices & Extra Features
Modular architecture with NestJS

DTOs with full validation

Separation of concerns (services, controllers, DTOs, schemas)

Centralized business logic in services

Proper error handling using NestJS exceptions

Static typing with TypeScript

Axios for HTTP calls with error resilience

MongoDB schema-based modeling with Mongoose

Clean code with ESLint and Prettier

Environment-specific configuration using .env

Optional Swagger API documentation

```
