# 🚀 InsightStream AI

**InsightStream AI** is a high-performance research dashboard that aggregates global news and delivers instant AI-generated summaries. It is engineered for speed, using advanced React patterns to efficiently handle massive data streams at 60fps.

---

## 🌟 Key Features

- **AI-Powered Summaries**  
  Integrates Gemini-2.5-flash to generate concise 3-point executive summaries for any article.

- **Infinite Virtualized Scrolling**  
  Uses `@tanstack/react-virtual` to render thousands of items with zero lag.

- **Intelligent Search**  
  Implements debounced inputs to reduce unnecessary API calls.

- **Resilient Networking**  
  Custom exponential backoff retry logic to handle API rate limits (429 errors).

- **Performance Tracking**  
  Throttled scroll progress indicators for smooth, real-time UI feedback.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit & RTK Query
- **AI Integration:** Google Gemini API
- **Styling:** TailwindCSS & Lucide Icons
- **Utilities:** TanStack Virtual

---

## 🏗️ Technical Architecture

### Performance Pillars

The application is built on five core performance optimization strategies:

- **Debouncing**  
  Search queries trigger after a 500ms delay to conserve API usage.

- **Throttling**  
  UI updates are limited to 50ms intervals to reduce CPU overhead.

- **Virtualization**  
  Only visible elements are rendered in the DOM at any given time.

- **Cache Merging**  
  RTK Query custom merge logic enables seamless infinite pagination.

- **Exponential Backoff**  
  Failed requests retry with increasing delays to maintain stability.

---

### API Design

A secure Next.js Route Handler (`/api/summarize`) is used to communicate with the Gemini API.  
This ensures API keys are never exposed on the client side.

---

