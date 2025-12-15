import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "./types/blog.type";
import { url } from "inspector";

// tagTypes cung cấp cấp call lại 1 lần api khi thành công , thất bại gì đó, có gì lên đọc mutation của docs nhen

export const blogApi = createApi({
  reducerPath: "blogApi", // tên field trong redux state
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  tagTypes: ["Posts"],
  endpoints: (build) => ({
    // generic trả về ds post, void không truyền tham số
    getPots: build.query<Post[], void>({
      query: () => "posts", // câu query thêm posts cuối : http.../posts
      // method () không tham số do get mà

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Posts", id } as const)),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
    addPost: build.mutation<Post, Omit<Post, "id">>({
      query: (body) => ({
        // <a,b> a: trả về 1 bài post sau add, b: tạo post mới với omit loại bỏ id của post khi tạo ra
        url: "posts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
  }),
});

// tự động gợi ý useGetPotsQuery theo trong object
export const { useGetPotsQuery, useAddPostMutation } = blogApi;
