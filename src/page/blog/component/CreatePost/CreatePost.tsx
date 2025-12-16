import { FormEvent, useEffect, useMemo, useState } from "react";
import PostItem from "../PostItem";
import PostList from "../PostList";
import { Post } from "../../types/blog.type";
import {
  useAddPostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../blog.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { isEntityError, isErrorWithMessage, isFetchBaseQueryError } from "../../../../utils/helpers";

const inititalState: Omit<Post, "id"> = {
  description: "",
  featureImage: "",
  published: false,
  publishDate: "",
  title: "",
};

type FormError =
  | {
      [key in keyof typeof inititalState]: string;
    }
  | null;

export default function CreatePost() {
  const [formData, setFormData] = useState<Omit<Post, "id"> | Post>(
    inititalState
  );
  const [addPost, addPostResult] = useAddPostMutation();

  const isStartingPost = useSelector((state: RootState) => state.blog.postId);
  const { data, isLoading, isFetching } = useGetPostQuery(isStartingPost, {
    skip: !isStartingPost,
  });

  const [updatePost, updatePostResult] = useUpdatePostMutation();

  // === Lỗi từ thằng rtk query
  // với thằng rtk query thì trả về 3 kiểu lỗi serial | fetchbase query | undefinded
  // tạo formError có cấu trúc giống như init để hứng dữ liệu trả dìa
  // ví dụ bên service trong build mà trong query => throw error thì sẽ nhảy vào Serialize, còn nếu fetch api bị lỗi nhảy vào fetchbasequery

  // === Lỗi từ server
  // hiện tại config cho error khi put post thì có dạng error => publishdate
  // thứ 2 nếu kiểu khác thì chỉ có message string => toast message hiển thị.
  const errorForm: FormError = useMemo(() => {
    const errorResult = isStartingPost
      ? updatePostResult.error
      : addPostResult.error;

      // lên docs đọc bên util
      if(isEntityError(errorResult)) { // bên ông helper utils có hanlde cái error này nên rơ chuột vô là biết ông này thuộc loại fetchBaseQueryError 
        console.log('isEntityError', errorResult); // 
        return errorResult.data.error as FormError
      }
      // if(isErrorWithMessage(errorResult)) {
      //   console.log('isErrorWithMessage', errorResult);
      // }

      // return null chỉ muốn xử lý với message thôi còn các kiểu khác thì toast middle ware khác khó hiểu.
      // Có gì test notel lại khúc này
      return null;
  }, [isStartingPost, updatePostResult, addPostResult]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]); // nhớ có thêm [data] để nhập text thay đổi thì rerender data thay đổi vào form

  const handleSumbit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isStartingPost) {
      await updatePost({
        id: isStartingPost,
        body: formData as Post,
      }).unwrap();
    } else {
      await addPost(formData).unwrap();
    }
    setFormData(inititalState);
  };

  return (
    <>
      <form onSubmit={handleSumbit}>
        <div className="mb-6">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Title"
            required
            value={formData.title}
            onChange={(event) => {
              setFormData((pre) => ({
                ...pre,
                title: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="featuredImage"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Featured Image
          </label>
          <input
            type="text"
            id="featuredImage"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Url image"
            required
            value={formData.featureImage}
            onChange={(event) => {
              setFormData((pre) => ({
                ...pre,
                featureImage: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-6">
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Your description..."
              required
              value={formData.description}
              onChange={(event) => {
                setFormData((pre) => ({
                  ...pre,
                  description: event.target.value,
                }));
              }}
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="publishDate"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Publish Date
          </label>
          <input
            type="datetime-local"
            id="publishDate"
            className="block w-56 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            required
            value={formData.publishDate}
            onChange={(event) => {
              setFormData((pre) => ({
                ...pre,
                publishDate: event.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-6 flex items-center">
          <input
            id="publish"
            type="checkbox"
            className="h-4 w-4 focus:ring-2 focus:ring-blue-500"
            checked={formData.published}
            onChange={(event) => {
              setFormData((pre) => ({
                ...pre,
                published: event.target.checked,
              }));
            }}
          />
          <label
            htmlFor="publish"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            Publish
          </label>
        </div>
        <div>
          {!isStartingPost && (
            <>
              <button
                className="group relative mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800"
                type="submit"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                  Publish Post
                </span>
              </button>
            </>
          )}
          {isStartingPost && (
            <>
              <button
                type="submit"
                className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                  Update Post
                </span>
              </button>
              <button
                type="reset"
                className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                  Cancel
                </span>
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
