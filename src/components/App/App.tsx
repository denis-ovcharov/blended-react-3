import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import { fetchPosts } from "../../services/postService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Post } from "../../types/post";
import { Toaster } from "react-hot-toast";
import EditPostForm from "../EditPostForm/EditPostForm";
import { useDebouncedCallback } from "use-debounce";

const LIMIT = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  type ModalType = "create" | "edit" | null;
  const [isVisible, setIsVisible] = useState<ModalType>(null);
  const { data, isSuccess, isError } = useQuery({
    queryKey: ["posts", query, page],
    queryFn: () => fetchPosts(query, page, LIMIT),
    placeholderData: keepPreviousData,
    retry: 1,
    enabled: page > 0,
    staleTime: Infinity,
  });
  const posts = data?.posts || [];
  const totalPages = data ? Math.ceil(data.totalCount / LIMIT) : 0;

  const updateQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setPage(1);
    },
    500,
  );

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsVisible("edit");
  };
  const handleCreate = () => {
    setIsVisible("create");
  };
  const handleCloseModal = () => {
    setIsVisible(null);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={updateQuery} />
          {isSuccess && totalPages > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          <button className={css.button} onClick={handleCreate}>
            Create post
          </button>
        </header>
        {isVisible === "create" && (
          <Modal onClose={handleCloseModal}>
            <CreatePostForm onClose={handleCloseModal} />
          </Modal>
        )}
        {isVisible === "edit" && selectedPost && (
          <Modal onClose={handleCloseModal}>
            <EditPostForm onClose={handleCloseModal} post={selectedPost} />
          </Modal>
        )}
        {isError && (
          <p
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: 700,
              color: "red",
              border: "1px solid red",
              padding: 12,
            }}
          >
            Error "No posts found"
          </p>
        )}
        {isSuccess && posts.length > 0 && (
          <PostList posts={posts} onSelectPost={handleEdit} />
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
}
