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
  article: Article[];
}

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://newsapi.org/v2/" }),
  endpoints: (builder) => ({
    getNews: builder.query<NewsResponse, { q: string; page: number }>({
      query: ({ q, page }) =>
        `everything?q=${q || "technology"}&page=${page}&pageSize=20&apiKey=${API_KEY}`,
      // merge: (currentCache, newItems) => {
      //   currentCache.articles.push(...newItems.articles);
      // },
      // serializeQueryArgs: ({ endpointName }) => endpointName,
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg !== previousArg;
      // },
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
