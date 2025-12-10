import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispacth } from "../../../../store";
import { deletePost, editingPost, getPostList } from "../../blog.slice";
import PostItem from "../PostItem";
import Skeleton from "../Skeleton";

// useEffect xử lý bất đồng bộ
// gọi api nếu thành công dispatch tới action success ngược lại fail
// (aciton/getPostListSuccess or action/getPostListFailed)

// KHÔNG ĐƯỢC: dispatch action/getPostList rồi qua
// reducer bên kia gọi bất đồng bộ vì
// useReducer trong createSlice chỉ xử lý đồng bộ, rồi
export default function PostList() {
  const postList = useSelector((state: RootState) => state.blog.postList);
  const loading = useSelector((state: RootState) => state.blog.loading);
  const dispatch = useAppDispacth();

  useEffect(() => {
    const promise = dispatch(getPostList());
    return () => {
      promise.abort();
    };
  }, []);

  const handleDelete = (idPost: string) => {
    dispatch(deletePost(idPost));
  };

  const handleEdit = (idPost: string) => {
    dispatch(editingPost(idPost));
  };
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
              {loading && (
                <>
                  <Skeleton />
                  <Skeleton />
                </>
              )}
              {!loading &&
                postList.map((post) => (
                  <PostItem
                    post={post}
                    key={post.id}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
