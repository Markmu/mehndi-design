# Mehndi Design Gallery

A modern web application showcasing a curated collection of beautiful Henna (Mehndi) designs. This platform allows users to browse, search, and filter designs by various categories and tags.

![Mehndi Design Gallery](public/screenshot.png)

## Features

- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices
- **Design Gallery**: Browse through a comprehensive collection of Henna designs
- **Category Filtering**: Filter designs by categories such as Traditional, Modern, Bridal, etc.
- **Tag-based Organization**: Each design is tagged for easy discovery and organization
- **Image Management**: Admin interface for uploading and managing design images
- **Tag Management**: Ability to edit and manage tags associated with each design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Cloudflare R2 for image storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Cloudflare R2 account (for image storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mehndi-design.git
   cd mehndi-design
  ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
```
Create a .env.local file in the root directory with the following variables:
DATABASE_URL=postgresql://username:password@localhost:5432/mehndi_design

# Cloudflare R2 credentials
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_r2_public_url
```
4. Run migrations:
   ```bash
   npm run db:migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 in your browser to see the application.

### Project Structure

```plaintext
mehndi-design/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── db/             # Database schema and configuration
│   ├── lib/            # Utility functions and services
│   └── model/          # TypeScript interfaces and types
├── .env.local          # Environment variables (not in repo)
├── drizzle.config.ts   # Drizzle ORM configuration
└── next.config.js      # Next.js configuration
```

## Usage
### Browsing Designs
- Visit the home page to see featured categories
- Navigate to the Gallery page to browse all designs
- Use the tag filters to narrow down designs by category
- Click on any design to view it in detail
### Admin Features
- Access the admin interface at /admin
- Upload new designs with associated tags
- Edit tags for existing designs
- Manage the design collection
## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- All Henna designs belong to their respective artists
- Built with Next.js
- Styled with Tailwind CSS
