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
    getPosts: build.query<Post[], void>({
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
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query: (data) => {
        throw Error('Xin chao')
      },
      invalidatesTags: (res, error, data) => [{ type: "Posts", id: data.id }],
    }),
    deletePost: build.mutation<{}, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, error, id) => [{ type: "Posts", id: id }]
    }),
  }),
});

// tự động gợi ý useGetPotsQuery theo trong object
export const {
  useGetPostQuery,
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = blogApi;
