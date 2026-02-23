<p align="center">
  <img src="frontend/app/favicon.ico" alt="Dev-Blocks Logo" width="120" />
</p>

<h1 align="center">Dev-Blocks</h1>

<p align="center">
  A Modern Blogging Platform for Developers
</p>

<p align="center">
  <a href="https://dev-blocks.vercel.app/">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fdev-blocks.vercel.app&label=Live%20Demo" alt="Website" />
  </a>
  <img src="https://img.shields.io/github/license/PraveenUppar/Dev-Blocks" alt="License" />
  <img src="https://img.shields.io/github/stars/PraveenUppar/Dev-Blocks?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/forks/PraveenUppar/Dev-Blocks?style=social" alt="Forks" />
  <img src="https://img.shields.io/github/issues/PraveenUppar/Dev-Blocks" alt="Issues" />
  <img src="https://img.shields.io/github/last-commit/PraveenUppar/Dev-Blocks" alt="Last Commit" />
</p>

---

## Description

Dev-Blocks is a full-stack blogging application designed for developers to share knowledge, read articles, and connect with peers. It features a rich text editor, robust content management, and social interaction capabilities.

🔗 **Live:** [https://dev-blocks.vercel.app/](https://dev-blocks.vercel.app/)

## Features

- **User Authentication:** Secure login and signup via Clerk.
- **Rich Text Editor:** WYSIWYG editor for creating formatted posts (TipTap).
- **Post Management:** Create, edit, publish, delete, and archive posts.
- **Draft System:** Auto-save drafts to work on later.
- **Social Interactions:** Like, Bookmark, and Comment on posts.
- **User Profiles:** Customizable profiles with bio, social links, and post history.
- **Follow System:** Follow other authors to see their latest content.
- **Reading History:** Track read articles and scroll depth.
- **Search & Filtering:** Find posts by keywords or tags.
- **Notifications:** Real-time alerts for likes, comments, and follows.

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
| ![Account](docs/account.png) | ![Bookmarks](docs/bookmark.png) | ![Drafts](docs/drafts.png) |

## Installation

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

## Usage

Visit `http://localhost:3000` to view the application.

1. **Sign up** using Clerk authentication (social or email/password).
2. **Create a post** using the rich text editor.
3. **Explore** posts, like, comment, and bookmark your favorites.
4. **Follow** other authors to see their latest content in your feed.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/PraveenUppar/Dev-Blocks/issues) on GitHub.

## Roadmap

- [ ] Dark mode support
- [ ] Markdown export for posts
- [ ] Email newsletter integration
- [ ] Analytics dashboard for authors

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## Authors and Acknowledgment

Built by [Praveen Uppar](https://github.com/PraveenUppar). Thanks to all contributors who help improve Dev-Blocks.

## License

This project is open source and available under the [MIT License](LICENSE).

## Project Status

This project is actively maintained. Contributions, feedback, and suggestions are always welcome!
