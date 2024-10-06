# SmrtFeed: Research Paper Management and Analysis

SmrtFeed is a powerful web application designed to help researchers and academics organize, analyze, and share insights from research papers. Built with Next.js, Vercel Postgres, Supabase Auth, Prisma ORM, and OpenAI, it offers a seamless experience for managing your academic literature.

## Features

- **Paper Management**: Easily add, edit, and delete research papers.

- **AI-Powered Analysis**: Automatically extract key insights and generate summaries using OpenAI's GPT models.

- **Interactive Dashboard**: View and interact with your saved papers through a user-friendly interface.

- **PDF Extraction**: Upload PDF files directly and extract their content for analysis.

- **URL-based Paper Addition**: Add papers by simply providing a URL.

- **Social Sharing**: Generate tweet-like summaries of papers for easy sharing.

- **URL-based Paper Addition**: Add papers by simply providing a URL.

- **Social Sharing**: Generate tweet-like summaries of papers for easy sharing.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- OpenAI API key
- Vercel account (for Vercel Postgres)
- PostgreSQL database (for Prisma ORM)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/smrtfeed.git
   cd smrtfeed
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Install Vercel CLI and log in:

   ```
   npm install -g vercel@latest
   vercel login
   ```

4. Link your project to Vercel:

   ```
   vercel link
   ```

5. Pull environment variables:

   ```
   vercel env pull .env.development.local
   ```

6. Install Vercel Postgres SDK:

   ```
   npm install @vercel/postgres
   ```

7. Set up Prisma:

   ```
   npx prisma generate
   npx prisma db push
   ```

8. Run the development server:

   ```
   npm run dev
   ```

9. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

This project uses Prisma ORM for database management and Vercel Postgres for data storage. To update your database schema:

1. Modify the `prisma/schema.prisma` file
2. Run `npx prisma generate` to update the Prisma client
3. Run `npx prisma db push` to apply changes to your database

To interact with your Vercel Postgres database, you can use the `@vercel/postgres` SDK in your code:

## File Storage

SmrtFeed uses Vercel Blob for file storage. Make sure you have set up a Vercel project and obtained the necessary credentials for Vercel Storage.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
