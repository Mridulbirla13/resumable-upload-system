# Resumable Upload System (TUS)

This project demonstrates a resumable file upload system using the **TUS protocol**, allowing uploads to pause, resume, and recover from network failures.

## Features
- Resumable uploads using TUS
- Pause / resume support
- Retry on network interruption
- Node.js backend with local file storage
- React frontend using Uppy Dashboard

## Tech Stack
- React
- Uppy (TUS)
- Node.js
- Express
- @tus/server

## Running locally

## Upload State Tracking

This project now tracks every upload using SQLite:

- Upload metadata (id, filename, size)
- Upload status (CREATED, UPLOADING, COMPLETED, FAILED)
- Timestamps for lifecycle events
- A `/status/:id` endpoint to query upload state

This brings the project closer to production-grade behavior while maintaining clarity and simplicity.