import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import type { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import toast from "react-hot-toast";
interface EditPostFormProps {
  onClose: () => void;
  post: Post;
}
interface InitialValues {
  title: string;
  body: string;
}
export default function EditPostForm({ onClose, post }: EditPostFormProps) {
  const initialValues: InitialValues = {
    title: post.title,
    body: post.body,
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: editPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success("Post edited successfully");
    },
  });
  const handleSubmit = (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>,
  ) => {
    if (!post.id) return;
    mutate(
      {
        postId: post.id,
        newDataPost: values,
      },
      {
        onSuccess() {
          actions.resetForm();
        },
      },
    );
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Too long. Max 100 characters")
      .required("Title is required"),
    body: Yup.string()
      .max(500, "Maximum 500 characters")
      .required("Content is required"),
  });
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="body">Content</label>
            <Field
              id="body"
              as="textarea"
              name="body"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="body" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || !isValid}
            >
              Edit post
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
