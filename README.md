# WordUp English Learning Website

## Overview
This website is designed for English language learning, with features such as flashcards, quizzes, and chat for crosswords, all designed for dynamic language learning. The website's system ensures users remember words effectively by implementing some methods and simple algorithms.

### Files and Directories

- `.env`: Environment variables for application configuration.
- `app.js`: Main application file, setting up the application and middleware.
- `bull`: Bull queue configurations or job definitions.
- `controllers`: Controller files for request processing and response handling.
- `data`: Scripts or files related to application data.
- `Dockerfile`: Docker container image definition for the application.
- `fly.toml`: Deployment or CI/CD configuration, potentially for Fly platform.
- `models`: Data models defining database schemas and relationships.
- `package-lock.json` & `package.json`: Project dependencies and metadata.
- `routes`: Route definitions and endpoint mappings.
- `server.js`: Entry point of the application, starting the server.
- `services`: Service files with business logic and data processing.
- `serverStore.js`: Export various functions (keeping track of user sessions, socket connections, ...).
- `socketHandlers`: WebSocket connection handlers for real-time communication.
- `socketServer.js`: Includes the configuration of the WebSocket server, handling client connections, and managing real-time data flow between the server and connected clients.
- `stripe.exe`: Executable for handling Stripe webhooks, supporting transaction features in localhost.
- `utils`: Utility functions, helpers, and shared logic.
