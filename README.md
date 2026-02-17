# Dev-Blocks - Medium-like Blog Application
### A Modern Blogging Platform for Developers

Dev-Blocks is a full-stack blogging application designed for developers to share knowledge, read articles, and connect with peers. It features a rich text editor, robust content management, and social interaction capabilities.

Live: https://dev-blocks.vercel.app/

## System Architecture

```mermaid
graph TD
    User[User] -->|HTTPS| Frontend[Next.js Frontend]
    Frontend -->|REST API| Backend[Express Backend]
    Frontend -->|Auth| Clerk[Clerk Auth]
    Backend -->|Auth Verification| Clerk
    Backend -->|Queries| DB[(PostgreSQL Database)]
```

## Database Schema

![Database Schema](docs/schema.png)


```mermaid
erDiagram
    User ||--o{ Post : writes
    User ||--o{ Comment : makes
    User ||--o{ Like : likes
    User ||--o{ Bookmark : bookmarks
    User ||--o{ Notification : receives
    User ||--o{ ReadingHistory : has
    User ||--o{ Follow : "follows/followed by"
    
    Post ||--o{ Comment : has
    Post ||--o{ Like : has
    Post ||--o{ Bookmark : has
    Post ||--o{ PostTag : has
    
    Post {
        string id
        string title
        string content
        string slug
        string status
    }
    
    User {
        string id
        string username
        string email
        string clerkId
    }
    
    Comment {
        string id
        string content
        string parentId
    }
```

## Screenshots

| Home Page | Post View | Editor |
|:---:|:---:|:---:|
| ![Home](docs/home.png) | ![Post](docs/post.png) | ![Write](docs/write.png) |

| User Profile | Bookmarks | Drafts |
|:---:|:---:|:---:|
| ![Account](docs/account.png) | ![Bookmarks](docs/bookmark.png) | ![Drafts](docs/drafts.png) |## Features

- **User Authentication:** Secure login and signup via Clerk.
- **Rich Text Editor:** WYSIWYG editor for creating formatting posts (TipTap).
- **Post Management:** Create, edit, publish, delete, and archive posts.
- **Draft System:** Auto-save drafts to work on later.
- **Social Interactions:** Like, Bookmark, and Comment on posts.
- **User Profiles:** Customizable profiles with bio, social links, and post history.
- **Follow System:** Follow other authors to see their latest content.
- **Reading History:** Track read articles and scroll depth.
- **Search & Filtering:** Find posts by keywords or tags.
- **Notifications:** Real-time alerts for likes, comments, and follows.

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Editor:** TipTap (Rich Text Editor)
- **HTTP Client:** Axios
- **Icons:** React Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Logging:** Winston
- **Testing:** Vitest + Supertest
- **Rate Limiting:** express-rate-limit

### Authentication
- **Provider:** Clerk (Social Auth, Email/Password)

### Hosting 
- **Frontend:** Vercel 
- **Backend:** Render

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Clerk Account

### 1. Clone the repository
```bash
git clone https://github.com/PraveenUppar/Dev-Blocks.git
cd dev-blocks
```

### 2. Environment Setup

Create a `.env` file in **frontend** and **backend** directories.

**Frontend (`frontend/.env`)**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (`backend/.env`)**
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/devblocks
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

### 3. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Project Structure

```
dev-blocks/
├── frontend/                 # Next.js Frontend
│   ├── app/                  # App Router Pages
│   ├── components/           # Reusable Components
│   ├── lib/                  # Utilities (Axios, Utils)
│   ├── types/                # TypeScript Interfaces
│   └── public/               # Static Assets
│
├── backend/                  # Express Backend
│   ├── src/
│   │   ├── config/           # App Configuration
│   │   ├── controllers/      # Route Controllers
│   │   ├── middleware/       # Auth, Validation, Error Handling
│   │   ├── routes/           # API Routes
│   │   ├── services/         # Business Logic
│   │   └── utils/            # Helper Functions
│   └── prisma/               # Database Schema
│
└── docs/                     # Documentation & Improvements
```
