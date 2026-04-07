🚀 InsightStream AI
InsightStream AI is a high-performance research dashboard that aggregates global news and provides instant AI-generated summaries. It is engineered for speed, utilizing advanced React patterns to handle massive data streams at 60fps.

🌟 Key Features
AI-Powered Summaries: Integrates Gemini 1.5 Flash to provide 3-point executive summaries of any article.

Infinite Virtualized Scrolling: Powered by @tanstack/react-virtual to render thousands of items with zero lag.

Intelligent Search: Debounced search inputs to minimize API overhead.

Resilient Networking: Custom exponential backoff retry logic for handling API rate limits (429 errors).

Performance Tracking: Throttled scroll progress indicators for real-time visual feedback.

🛠️ Tech Stack
Framework: Next.js 14+ (App Router)

Language: TypeScript

State Management: Redux Toolkit & RTK Query

AI: Google Gemini Pro API

Styling: TailwindCSS & Lucide Icons

Utilities: TanStack Virtual (Virtualization)

🏗️ Technical Architecture

1. Performance Pillars
   The application is built on five core performance optimization pillars:

Debouncing: Search queries wait 500ms before triggering to save API quota.

Throttling: UI progress updates are limited to 50ms intervals to reduce CPU load.

Virtualization: Only elements currently in the viewport are rendered in the DOM.

Cache Merging: RTK Query custom merge logic for seamless infinite pagination.

Exponential Backoff: Staggered retries on failed requests to ensure app stability.

2. API Design
   The project uses a secure Next.js Route Handler (/api/summarize) to communicate with Gemini AI, ensuring API keys are never exposed to the client-side.

🚀 Getting Started
Clone the repository

Bash
git clone https://github.com/yourusername/insightstream-ai.git
cd insightstream-ai
Install dependencies

Bash
npm install
Environment Variables
Create a .env.local file in the root directory:

Code snippet
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
GEMINI_API_KEY=your_gemini_api_key
Run the development server

Bash
npm run dev


Note: This project was built to demonstrate proficiency in high-performance React patterns and AI integration.
