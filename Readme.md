# Decktopus Dashboard

## Description
Decktopus Dashboard is a presentation management system built using Node.js, React, and PostgreSQL. The dashboard allows users to create, manage, and organize presentations. Users can list, create, delete, rename, and sort presentations.

## Core Features
1. **Dashboard**:
   - Displays a list of presentations with the following details:
     - Presentation Name
     - Created By Name
     - Last Updated Date
     - Thumbnail Image
2. **Presentation Creation**:
   - Users can create new presentations by providing:
     - Presentation Name
     - Thumbnail Image Upload
   - New presentations are added to the list after creation.
3. **Presentation Operations**:
   - Users can perform the following actions on any existing presentation:
     - Rename: Change the name of the presentation.
     - Delete: Remove a presentation from the list.
     - Sort: Organize presentations by name, update date, or creator.

## Technologies and Frameworks
- **Backend**: Node.js
- **Frontend**: React
- **Database**: PostgreSQL

## Project Setup

### Backend
1. Clone the repository
2. Navigate to the root directory:
    npm install
    npm run dev
### Frontend
1. Navigate to the root directory:
    cd client
    npm install
    npm run start

### Testing
npx jest tests/presentation.test.js
npx jest --coverage
