# SmrtFeed: Research Paper Management and Analysis

SmrtFeed is a powerful web application designed to help researchers and academics organize, analyze, and share insights from research papers. Built with Next.js, Supabase, and OpenAI, it offers a seamless experience for managing your academic literature.

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
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:

   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_API_URL=your_api_url

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
