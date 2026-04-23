# GenWeb.ai - AI Website Builder

GenWeb.ai is a powerful, full-stack AI website builder that allows users to generate modern, responsive, and production-ready websites simply by describing their ideas. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by OpenRouter (DeepSeek), it handles everything from UI/UX design to raw code generation and deployment.

## 🚀 Features

- **AI Website Generation**: Describe your vision and get a fully functional, stylized website in minutes.
- **MERN Stack**: Robust backend with Express and MongoDB for data persistence.
- **Stripe Integration**: One-time credit system for website generation (Pro/Enterprise plans).
- **Modern UI**: Polished, dark-themed dashboard with glassmorphism aesthetics.
- **Live Deployment**: Deploy your generated sites instantly with unique live URLs.
- **Firebase Auth**: Secure Google Login integration.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, Framer Motion, TailwindCSS.
- **Backend**: Node.js, Express, Mongoose, Stripe API, Firebase Admin SDK.
- **AI Engine**: OpenRouter (DeepSeek v3).
- **Database**: MongoDB Atlas.

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Akshayahlawat21/AIwebsite-Builder.git
cd AIwebsite-Builder
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=8000
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. Frontend Setup
```bash
cd ../frontend/vite-project
npm install
```

### 4. Running the App
**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend/vite-project
npm run dev
```

## 🧪 Testing Webhooks Locally
To test the payment system locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```
Then trigger an event:
```bash
stripe trigger checkout.session.completed
```

## 📜 License
This project is licensed under the MIT License.
