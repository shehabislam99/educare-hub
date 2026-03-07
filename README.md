# Educare Hub
Educare Hub is a full-stack learning platform built with Next.js where students can browse courses, add to cart, buy/enroll, and track progress, while instructors can create and manage courses from a role-based dashboard.

## Setup & Installation
# Prerequisites
- Node.js 18+
- npm
- MongoDB database (local or Atlas)

# 1. Clone and install dependencies
git clone <your-repo-url>
cd educare-hub
npm install

# 2. Configure environment variables
Create .env.local or .env with:
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret


## Route Summary
# Public pages
- `/` Home
- `/about` About page
- `/course` Course listing
- `/course/[id]` Course details + add to cart + buy now
- `/login` Login
- `/signup` Registration
- `/profile` User profile
- `/cart` Student cart
- `/privacy` Privacy policy
- `/terms` Terms and conditions

# Dashboard pages (protected)
- `/dashboard` Auto-redirects by role
- `/dashboard/student` Student dashboard (enrollments data)
- `/dashboard/student/my-enrollments` Student enrolled courses
- `/dashboard/instructor` Instructor dashboard (course analytics)
- `/dashboard/instructor/manage-course` Instructor course list/manage
- `/dashboard/instructor/create-course` Create course
- `/dashboard/instructor/edit-course/[id]` Edit course

# API routes
- `POST /api/login` Login with credentials + JWT cookie
- `POST /api/signup` Register user
- `POST /api/logout` Logout
- `GET /api/auth/[...nextauth]` NextAuth handlers
- `POST /api/auth/[...nextauth]` NextAuth handlers
- `GET /api/course` Fetch all courses (or by `instructorId` query)
- `POST /api/course` Create course
- `GET /api/course/[id]` Get one course
- `PUT /api/course/[id]` Update course
- `DELETE /api/course/[id]` Delete course
- `GET /api/my-courses` Instructor’s own courses
- `GET /api/my-enrollments` Student enrollments with course details
- `POST /api/my-enrollments` Enroll student in a course (buy now)
- `GET /api/cart` Get cart items + count
- `POST /api/cart` Add course to cart
- `DELETE /api/cart` Remove course from cart
- `POST /api/upload` Upload endpoint

# Access control
- `/dashboard/*` routes are protected via `src/proxy.js`.
- Role rules:
  - `student` can access student dashboard routes.
  - `instructor` can access instructor dashboard routes.
  - `/dashboard` redirects to role-specific dashboard.
