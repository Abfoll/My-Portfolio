# 🚀 MERN Stack Portfolio Website with Admin Panel

A modern, responsive portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Bootstrap. Features a comprehensive admin panel for content management and a professional frontend showcase.


## ✨ Features

### 🌟 Frontend Features
- **Responsive Design** - Bootstrap-powered responsive layout that works on all devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Project Showcase** - Dynamic project gallery with filtering and search
- **Contact Form** - Working contact form with validation and email notifications
- **Skills Section** - Interactive skills display with progress bars
- **About Section** - Personal information and professional summary
- **Resume Download** - Downloadable resume/CV functionality
- **SEO Optimized** - Meta tags, structured data, and optimized performance

### 🔧 Admin Panel Features
- **Secure Authentication** - JWT-based admin login system
- **Project Management** - Add, edit, delete, and reorder portfolio projects
- **Image Upload** - Upload and manage project images with preview
- **Contact Management** - View and manage contact form submissions
- **Content Editor** - Rich text editor for project descriptions
- **Dashboard Analytics** - Basic statistics and insights
- **Profile Management** - Update personal information and skills

### 🛠️ Technical Features
- **RESTful API** - Well-structured API endpoints
- **File Upload** - Image upload with validation and compression
- **Email Integration** - Automated email notifications
- **Database Relations** - Optimized MongoDB schema design
- **Error Handling** - Comprehensive error handling and validation
- **Security** - Password hashing, input sanitization, and CORS protection

## 🏗️ Tech Stack

### Frontend
- **React.js** - Frontend framework
- **Bootstrap 5** - CSS framework for responsive design
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests


### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Additional Tools
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Validator** - For Validation

## 📁 Project Structure

```
portfolio-website/
├── client/                     # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ProjectCard.js
│   │   │   └── ContactForm.js
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js
│   │   │   ├── Projects.js
│   │   │   ├── Contact.js
│   │   │   └── AdminDashboard.js
│   │   ├── context/            # React context
│   │   │   └── AuthContext.js
│   │   ├── utils/              # Utility functions
│   │   │   └── api.js
│   │   ├── styles/             # CSS files
│   │   │   └── custom.css
│   │   └── App.js
│   ├── package.json
│   └── README.md
├── server/                     # Node.js backend
│   ├── models/                 # Database models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Contact.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── contact.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/                  # Utility functions
│   │   └── email.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── uploads/                    # Uploaded files
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abfoll/My-Portfolio.git
   cd portfolio-website
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/portfolio
   
   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Server Configuration  
   PORT=5000
 


6. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:5173/admin/dashboard

## 📱 Usage

### For Visitors
1. Browse the portfolio showcase
2. View project details and live demos
3. Download resume/CV
4. Submit contact form for inquiries

### For Admin
1. Login at `/admin/login` with your credentials
2. Manage projects (add, edit, delete)
3. View and respond to contact messages
4. Update personal information and skills


## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b your-branch-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin your-branch-name`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account
- `GET /api/auth/user` - Get User

### Project Endpoints
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project By Id (auth required)
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Contact Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (auth required)
- `PUT /api/contact/:id/read` - Mark message as read (auth required)







