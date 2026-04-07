import { retry } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

const staggeredBaseQuery = retry(
  fetchBaseQuery({ baseUrl: "https://newsapi.org/v2/" }),
  {
    maxRetries: 5, // Try 3 extra times before giving up
  },
);

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: staggeredBaseQuery,
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query<NewsResponse, { q: string; page: number }>({
      query: ({ q, page }) =>
        `everything?q=${q || "technology"}&page=${page}&pageSize=20&apiKey=${API_KEY}`,

      //By default RTK Query uses ALL arguments as the cache key. This makes page 1 and page 2 separate entries. WITH serializeQueryArgs — ignore page, only use q as the key so same cache entry(key) for all pages
      serializeQueryArgs: ({ queryArgs }) => queryArgs.q, //return whatever you want as the cache key

      //Without merge, new data replaces old data. With merge, you control how they combine:
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        currentCache.articles.push(...newItems.articles);
      },

      //Since all pages now share one cache key, RTK Query thinks "I already have data for the cache entry(key), skip the fetch." forceRefetch tells it when to actually make a new request:
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.q !== previousArg?.q
        );
      },

      keepUnusedDataFor: 3600, // Keep in memory for 1 hour to save API credits
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;

//Normal RTK Query — every new argument = new separate cache entry:
// { q: "react", page: 1 } → cache entry 1
// { q: "react", page: 2 } → cache entry 2  ← separate, replaces page 1 in UI
// { q: "react", page: 3 } → cache entry 3  ← separate, replaces page 2 in UI

// What you want for infinite scroll:
// { q: "react", page: 1 } → cache entry: [items 1-20]
// { q: "react", page: 2 } → cache entry: [items 1-20, 21-40]  ← merged
// { q: "react", page: 3 } → cache entry: [items 1-20, 21-40, 61-80] ← merged
