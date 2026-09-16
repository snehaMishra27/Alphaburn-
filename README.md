# AlphaBurn – Fitness Tracking Web App

**AlphaBurn** is a full-stack fitness tracking web application that helps users track workouts, monitor fitness metrics, calculate BMI, and visualize their progress through an interactive dashboard.

##  Features

*  User Registration & Login
*  Workout Tracking
*  Automatic Calorie Calculation
*  Interactive Progress Charts
*  Sleep & Weight Tracking
*  BMI Calculation
*  Weekly Workout Goals
*  Profile & Password Management
*  Light/Dark Theme
*  Session-based Authentication

##  Tech Stack

**Frontend:** React.js, Bootstrap, Axios, Chart.js
**Backend:** Node.js, Express.js, REST APIs
**Database:** MongoDB, Mongoose
**Authentication:** Express Session, bcrypt
**Testing:** Thunder Client
**Tools:** VS Code, Git & GitHub

##  Architecture

```text
React Frontend
      ↓
Axios / REST APIs
      ↓
Node.js + Express
      ↓
Controllers / Models
      ↓
MongoDB
```

##  UI Preview

###  Login

![Login](./screenshots/login.png)

###  Dashboard

![Dashboard](./screenshots/dashboard.png)

###  Workout Tracking

![Workout](./screenshots/workout.png)

###  Fitness Metrics

![Metrics](./screenshots/metrics.png)

###  Profile

![Profile](./screenshots/profile.png)

##  Calorie Calculation

Calories are calculated based on workout category and duration:

```text
Cardio   → 10 cal/min
Strength → 8 cal/min
Yoga     → 5 cal/min
Other    → 6 cal/min
```

##  Key APIs

| API                  | Purpose             |
| -------------------- | ------------------- |
| `/register`          | Create account      |
| `/login`             | User authentication |
| `/workout/add`       | Add workout         |
| `/workout/list`      | Get workouts        |
| `/metrics/add`       | Add fitness metrics |
| `/dashboard/summary` | Dashboard data      |
| `/calculate-bmi`     | BMI calculation     |

##  My Contribution

**Individual Project**

I developed the complete application including:

* React frontend & UI
* REST APIs using Node.js/Express
* MongoDB database integration
* Authentication & session management
* Workout & metrics tracking
* Chart.js data visualization
* BMI calculation
* API testing & debugging

##  Key Learning

Through AlphaBurn, I gained practical experience in **full-stack development, REST APIs, authentication, database integration, frontend-backend communication, and data visualization.**

## Future Enhancements

* Personalized workout recommendations
* Wearable device integration
* More advanced fitness analytics
* Real-time fitness data
* Improved calorie estimation

##  Author

**Sneha**
B.Tech CSE | Full-Stack Development Enthusiast

