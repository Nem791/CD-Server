# CD-Server
Quizlet Clone Project
Overview
This repository contains the Node.js backend for a Quizlet clone. It includes various components essential for a web application, such as routing, models, controllers, and services.

File and Directory Structure
.env: Contains environment variables for configuration.
app.js: Main application setup, middleware configurations, and route definitions.
bull: Configuration or job definitions for Bull queue.
controllers: Handlers for processing client requests and returning responses.
data: Scripts or files related to application data.
Dockerfile: Defines a Docker container image for the application.
fly.toml: Deployment or CI/CD configuration, possibly for Fly platform.
models: Data models defining schema for database tables and relationships.
package-lock.json, package.json: Define project dependencies and metadata.
routes: Route definitions and endpoint handlers.
server.js: Entry point for starting the server and initializing the app.
services: Business logic interacting with models to process data.
severStore.js: Likely involved in server-side data or state management.
socketHandlers: Handlers for WebSocket connections for real-time communication.
socketServer.js: Setup and management of WebSocket connections.
stripe.exe: Executable for handling Stripe webhooks, functional in localhost for transaction features.
utils: Utility functions, helpers, and shared logic.
