import { useDispatch, useSelector } from "react-redux";
import PostItem from "../PostItem";
import { RootState } from "../../../../store";
import { cacelEditingPost, deletePost, editingPost } from "../../blog.slice";
import { useEffect } from "react";
import http from "../../../../utils/http";
import { error } from "console";

// useEffect xử lý bất đồng bộ
// gọi api nếu thành công dispatch tới action success ngược lại fail
// (aciton/getPostListSuccess or action/getPostListFailed)

// KHÔNG ĐƯỢC: dispatch action/getPostList rồi qua
// reducer bên kia gọi bất đồng bộ vì
// useReducer trong createSlice chỉ xử lý đồng bộ, rồi
export default function PostList() {
  const postList = useSelector((state: RootState) => state.blog.postList);
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();

    http
      .get("/posts", {
        signal: controller.signal
      })
      .then((res) => {
        const postListResult = res.data;
        dispatch({ type: "blog/getPostListSuccess", payload: postListResult });
      })
      .catch((error) => {
        if(error.code !== "ERR_CANCELED") {
          dispatch({ type: "blog/getPostListFailed", payload: error });
        }
      });

    return () => {
      // unmount : cleanup func
      controller.abort();
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
              {postList.map((post) => (
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
