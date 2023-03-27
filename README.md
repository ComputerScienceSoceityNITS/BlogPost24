# A Simple Backend Server for a Blog Posting Application

## Tech Stack:
1. NodeJs/ExpressJs
2. MongoDB/Mongoose
3. Typescript

**Installation**

1. Clone the repo _Or_ Run `git pull origin master` if already cloned.
2. Run `npm install` in the terminal to install all related dependencies.
3. Create a ".env" file in the root folder as per ".env.example" file present.
4. Run `npm run dev`.

**Steps for Contributing**
1. Fork the repository.
2. Clone the forked repo to your local device.
3. Run `git checkout -b [BRANCH_NAME]` in your preferred terminal.
4. [BRANCH_NAME] in the above step should be the issue name being worked upon.
5. Make all your code changes, then commit and push to your forked repo.
6. Open a Pull Request to the master branch of the main repo and link the PR with the Issue being referenced(Fetch before a PR).

## Routes
#### Auth Routes:
- POST `/auth/signup` Signup
- POST `/auth/login` Login
- POST `/auth/forgotPassword` Forget Password
- POST `/auth/resetPassword/:id/:resetToken` Reset Password

#### Blog Routes:
- GET `/blogs/all?page=N` Get All Blogs (Paginated response of 10 blogs from Nth page)
- POST `/blogs/create` Create a Blog
- DELETE `/blogs/delete/:id` Delete a Blog
- UPDATE `/blogs/update/:id` Update a Blog
- GET `/blogs/:id` Get a specific blog
