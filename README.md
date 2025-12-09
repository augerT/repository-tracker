# Repository Tracker

A full-stack application to track GitHub repository releases using GraphQL, Apollo Client, React, and PostgreSQL.

## Features

- Track multiple GitHub repositories
- View latest release notes with Markdown rendering
- Mark releases as seen
- Sync all repositories for latest releases
- Client-side caching with Apollo Client
- Material-UI design

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd repository-tracker
```

### 2. Set up PostgreSQL Database

```bash
cd backend
npm run db:setup
```
Note: If your psql user is not "postgres", please modify this script in `package.json` to use your correct username.
```
"db:setup": "psql -U postgres -f dbsetup.sql"
```

### 3. Configure Environment Variables

**Backend:**

Modify `backend/.env` with your psql credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Install Dependencies

```bash
npm install
```

This will install concurrently and install both backend and frontend dependencies.

## Running the Application

### Development Mode

```bash
npm run dev
```

This will launch frontend and backend processes concurrently.

## Testing - Backend

### 1. Configure backend/.env.test

Add your GitHub API token to the `.env.test` file to avoid rate limits.
Make sure to configure your DB_USER and DB_PASSWORD variables as well to match your `.env` file!

### 2. Running the tests

From the project root 

Test: `npm run test:backend`

Test with coverage report: `npm run test:backend:coverage`

## Missing Features / Bugs / Suggestions for improvements

### -Real-time update tracking  

Updates must be fetched by using the Sync Releases button. This makes testing the synchronization logic easier, and it's unlikely a repository will actually trigger a new release during the current usage of the app. If this were made for a production, a goodway to implement this would be webhooks via GitHub API, as suggested.

### -User must know owner / repository names when adding repositories

This feels a little unintuitive, that a user must find the owner / repository name themselves. I used these values for the form because that's what the octokit API needs to fetch a repository. It would probably be more intuitve for the user to just paste the URL instead, and would be fairly straightforward to implement, we would just add URL parsing logic into the getRepo function in octokit.ts.

An even better solution could be to use a search REST API to display a list of repositories that match the search, and the user can add repositories from the list of matched repositories.

### -Latest release is not grabbed when adding a repository

I kept it this way for testing purposes, as it makes it easier to test both the repository release fetching, as well as the seenByUser flag. This could be pretty easily implemented using `fetchLatestRelease` method in `octokit.js` when adding a repository.

### -Latest release is not shown on selected repository when "Sync Releases" is pressed

User must manually re-click their currently selected repository to see the latest release. On one hand, it does clearly show that a new release is there, but on the other, it does feel a bit unintuitive. 

### -Repository always gets added to the bottom of the list, and may reorganize on "Sync Releases"

Repositories are sorted alphabetically, but a new repository always gets added to the bottom of the list. It should insert where appropriate, and syncing releases does reorganize the alphabetical order. Different options for sorting could also be implemented, as well as filtering, as mentioned in the stretch goals.

### - No Error shown when adding a repository that doesn't exist

Some kind of user feedback should be given when an error occurrs on the addRepo mutation. 

### - Persistent caching

Persistent caching could be implemented to improve performance on future releoads and visits to the application.

### - Mobile Responsiveness

Stretch goal, as suggested. Has not been tested or designed for mobile responsiveness.

### - Extend more from the Github API result

There are a number of useful keys from the Github API result that could enhance the user exprience, including:

- Github URL
- Release URL
- Owner
- Repo Stars