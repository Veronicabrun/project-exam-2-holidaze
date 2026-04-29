# Holidaze 🌍

## 📖 Description

Holidaze is a venue booking application developed as part of Project Exam 2 at Noroff.

The application allows users to browse venues, book stays, and manage venues depending on their user role.

* Visitors can browse venues and view venue details
* Registered customers can book venues and manage their profile
* Venue managers can create, edit, delete, and manage their own venues

⚠️ This is an exam project. Bookings are not real.

---

## 🚀 Live Site

👉 https://your-netlify-link.netlify.app

---

## 📁 Repository

👉 https://github.com/Veronicabrun/project-exam-2-holidaze

---

## 📊 Project Planning

GitHub Project board (Kanban + timeline):

👉 https://github.com/users/Veronicabrun/projects/1

---

## ✨ Features

### 👀 For all visitors

* View the home page
* View all venues
* Search and filter venues
* View details for a specific venue
* View venue images and information

Visitors cannot:

* Book venues
* Access profile features

---

### 👤 For registered customers

* Register with a `stud.noroff.no` email
* Login and logout
* Book venues
* Select booking dates using React Datepicker
* Select number of guests
* View upcoming bookings
* View booked venues
* Update avatar

---

### 🏢 For venue managers

* Access visitor features
* Create new venues
* Edit owned venues
* Delete owned venues
* View bookings made on owned venues
* Update avatar

---

## 🛠️ Technologies

* React (Create React App)
* React Router DOM
* SCSS / Sass modules
* React Datepicker
* Noroff Holidaze API
* Netlify
* ESLint (via react-scripts)
* Jest & React Testing Library

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/Veronicabrun/project-exam-2-holidaze.git
cd project-exam-2-holidaze
```

### Install dependencies

```bash
npm install
```

### Run the project locally

```bash
npm start
```

The application will run at:
http://localhost:3000

### Build for production

```bash
npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of the project:

```env
REACT_APP_API_KEY=your_api_key
REACT_APP_API_BASE=https://v2.api.noroff.dev
```

You can get the API key from Noroff’s student portal.

Do not commit your real `.env` file to GitHub.

---

## 🧪 Testing

The project includes tests for components, pages, hooks, services, and validation logic.

Run all tests with:

```bash
npm test -- --watchAll=false
```

Current result:

```txt
Test Suites: 8 passed, 8 total  
Tests: 39 passed, 39 total  
```

---

## ✅ Quality Assurance

The application has been tested for:

* Login, registration, and logout
* Venue listing
* Search and filtering
* Venue detail page
* Booking functionality
* Profile features
* Avatar updates
* Venue manager functionality
* Browser console errors
* Netlify production build
* Routing on deployed version

---

## 🚀 Deployment

The application is deployed using Netlify.

Steps:

* Connected GitHub repository
* Added environment variables
* Configured build settings
* Added `_redirects` for React routing
* Fixed CI build issues (warnings treated as errors)
* Verified all routes work in production

Netlify settings:

```txt
Build command: npm run build  
Publish directory: build  
```

Environment variables used in Netlify:

```env
REACT_APP_API_KEY  
REACT_APP_API_BASE  
CI=false  
```

---

## 📸 Screenshots

(Add screenshots here)

---

## 👩‍💻 Author

Veronica 
