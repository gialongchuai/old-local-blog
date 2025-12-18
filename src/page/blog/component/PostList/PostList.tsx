import { useDispatch, useSelector } from "react-redux";
import { useDeletePostMutation, useGetPostQuery, useGetPostsQuery } from "../../blog.service";
import PostItem from "../PostItem";
import Skeleton from "../Skeleton";
import { resetEditingPost, startEditingPost } from "../../blog.slice";
import { RootState } from "../../../../store";
import { useEffect } from "react";

export default function PostList() {
  const { data, isLoading, isFetching } = useGetPostsQuery();
  const dispatch = useDispatch();
  const [deletePost, deletePostResult] = useDeletePostMutation()

  const handleEditPost = (id: string) => {
    dispatch(startEditingPost(id));
  };

  const handleDeletePost = async (id: string) => {
    try {
      await dispatch(resetEditingPost());
      await deletePost(id);
    } catch (error) {

    }
  }
  return (
    <>
      <div>
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="mb-10 md:mb-16">
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                Được Dev Blog
              </h2>
              <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi
                tệ. Nhưng ngày mốt sẽ có nắng
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8">
              {isFetching && (
                <>
                  <Skeleton />
                  <Skeleton />
                </>
              )}
              {!isFetching &&
                data?.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    handleEditPost={handleEditPost}
                    handleDeletePost={handleDeletePost}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
