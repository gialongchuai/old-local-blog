import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "./types/blog.type";

export const blogApi = createApi({
  reducerPath: "blogApi", // tên field trong redux state
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (build) => ({
    // generic trả về ds post, void không truyền tham số
    getPots: build.query<Post[], void>({
      query: () => "posts", // câu query thêm posts cuối : http.../posts
      // method () không tham số do get mà
    }),
  }),
});

// tự động gợi ý useGetPotsQuery theo trong object
export const { useGetPotsQuery } = blogApi;
