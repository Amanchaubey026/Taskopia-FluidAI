# Taskopia-FluidAI
## Introduction

This project is a Task Management System RESTful API built using Node.js and Express.js framework with MongoDB as the database. It allows users to perform CRUD operations (Create, Read, Update, Delete) on tasks. The API includes JWT-based authentication to ensure that only authenticated users can perform these operations.

## Project Type
Backend 

## Deplolyed App

Documentation: https://taskopia-fluidai.onrender.com/api-docs/

Backend: https://taskopia-fluidai.onrender.com

## Directory Structure
```
📦 
├─ README.md
└─ server
   ├─ .babelrc
   ├─ .gitignore
   ├─ config
   │  └─ db.config.js
   ├─ controller
   │  ├─ task.controller.js
   │  └─ user.controller.js
   ├─ index.js
   ├─ middlewares
   │  ├─ auth.middleware.js
   │  └─ errorHandler.middleware.js
   ├─ models
   │  ├─ blacklist.schema.js
   │  ├─ task.schema.js
   │  └─ user.schema.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ task.routes.js
   │  └─ user.routes.js
   └─ test
      └─ app.test.js

```



## Features
- Task Management: Perform CRUD operations on tasks.
- Secure Authentication: User authentication using JWTs.
- Data Validation: Validation for incoming data to ensure required fields and correct data types.
- Error Handling: Graceful error handling with appropriate HTTP status codes and error messages.
- Unit Testing: Basic unit tests for API endpoints using Jest.



  
## Installation & Getting started
### Prerequisites
- Node.js
- MongoDB
- 
Detailed instructions on how to install, configure, and get the project running.

```bash
### Clone the repository:
git clone https://github.com/Amanchaubey026/Taskopia-FluidAI.git

### Navigate to the server directory and install dependencies:
cd server
npm install

```

## Usage

To start Backend

```bash
npm run server

```

## Snapshot of Website


![image](https://github.com/Amanchaubey026/Taskopia-FluidAI/assets/98681520/84296536-1400-4961-b4d1-83d39c8eba39)

![image](https://github.com/Amanchaubey026/Taskopia-FluidAI/assets/98681520/5ef72a66-7301-4632-aa5f-92a6a9828d70)

![image](https://github.com/Amanchaubey026/Taskopia-FluidAI/assets/98681520/3f664488-631e-4d82-ae6c-e54ed328281e)

![image](https://github.com/Amanchaubey026/Taskopia-FluidAI/assets/98681520/dfc19175-e89c-4cae-92f0-4ddcdf7826d8)

![image](https://github.com/Amanchaubey026/Taskopia-FluidAI/assets/98681520/cc408edd-1e24-4b28-8662-8a7bbd3d9f07)









## API Endpoints

Backend Applications provide a list of your API endpoints, methods, brief descriptions.

### User Authentication
<p>POST /api/users/signup - create a new user with validation and registration logic</p>
<p>POST /api/users/login - authenticate a user with validation and authentication logic</p>
<p>POST /api/users/logout - log out a user</p>

### Task Management (Protected Routes)
<p>POST /api/tasks - Create a new task.</p>
<p>GET /api/tasks -Retrieve a list of all tasks.</p>
<p>GET /api/tasks/:id - Retrieve a single task by ID.</p>
<p>PUT /api/tasks/:id -  Update an existing task.</p>
<p>DELETE /api/tasks/:id - Delete a task.</p>


## Technology Stack

### List and provide a brief overview of the technologies used in the project.

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Jest (for testing)

### To run the unit tests using Jest, use the following command:

```bash
npm run test
```


