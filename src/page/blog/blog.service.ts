import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "./types/blog.type";
import { url } from "inspector";
import { CustomError } from "../../utils/helpers";

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

      providesTags: (result) => // cho nó có tag { type: "Posts", id: "LIST" } hết để có thể gọi lại endpoint này
        result // nếu có cái khác thì gán vào id
          ? [
              ...result.map(({ id }) => ({ type: "Posts", id } as const)),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
    addPost: build.mutation<Post, Omit<Post, "id">>({ // add update delete thường là mutation còn mấy cái khác là query
      query: (body) => {
        try {
          // throw Error('cung la code logic')
          // let a:any = null;
          // a.b = 1;
          return {
            url: "posts",
            method: "POST",
            body,
          };
        } catch (error: any) {
          throw new CustomError(error.message) // custom lỗi cho nó thành name = 'CustomError' hết (ví dụ throw Error hoặc let a:any ... 
          // thì 2 dạng lỗi khác nhau nhưng custom cho chung để toast message)
        }
      }, // nếu có lỗi trả về tag [] rỗng để không gọi endpoint getPosts nữa
      invalidatesTags: (res, error, data) => (error ? [] : [{ type: "Posts", id: "LIST" }]),
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query: (data) => ({
        url: `posts/${data.id}`,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: (res, error, data) => (error ? [] : [{ type: "Posts", id: data.id }]),
    }),
    deletePost: build.mutation<{}, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, error, id) => (error ? [] : [{ type: "Posts", id: id }]),
    }),
  }),
});

// tự động gợi ý action theo như trong object ở trên
export const {
  useGetPostQuery,
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = blogApi;
