import axios from "axios";
import type { Post } from "../types/post";

axios.defaults.baseURL = "https://6980937a6570ee87d50fb41f.mockapi.io/";

export const fetchPosts = async (
  searchText: string,
  page: number = 1,
  limit: number = 12,
) => {
  const res = await axios.get("/posts", {
    params: {
      search: searchText,
      page: page,
      limit: limit,
    },
  });
  const totalRes = await axios.get("/posts", {
    params: { search: searchText || undefined },
  });
  return {
    posts: res.data,
    totalCount: totalRes.data.length,
  };
};

export const createPost = async (newPost: Post) => {
  const { data } = await axios.post("/posts", newPost);
  return data;
};

interface EditPostArgs {
  postId: number;
  newDataPost: Partial<Post>;
}

export const editPost = async ({ newDataPost, postId }: EditPostArgs) => {
  const { data } = await axios.put(`/posts/${postId}`, newDataPost);
  return data;
};

export const deletePost = async (postId: number) => {
  const { data } = await axios.delete(`/posts/${postId}`);
  return data;
};
