import CreatePost from "./component/CreatePost";
import PostList from "./component/PostList";

export default function Blog() {
  return (
    <>
      <div className="p-5">
        <CreatePost />
        <PostList />
      </div>
    </>
  );
}
