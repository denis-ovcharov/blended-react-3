import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";
import toast from "react-hot-toast";

interface PostListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export default function PostList({ posts, onSelectPost }: PostListProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post delited successfully");
    },
  });

  const handleDelete = (post: Post) => {
    mutate(post.id!);
  };

  return (
    <ul className={css.list}>
      {posts.map((post: Post) => (
        <li className={css.listItem} key={post.id}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => onSelectPost(post)}>
              Edit
            </button>
            <button className={css.delete} onClick={() => handleDelete(post)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
