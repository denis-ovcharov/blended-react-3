import * as Yup from "yup";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";
import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";

interface CreatePostFormProps {
  onClose: () => void;
}
interface InitialValues {
  title: string;
  body: string;
}
const initialValues: InitialValues = {
  title: "",
  body: "",
};
export default function CreatePostForm({ onClose }: CreatePostFormProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success("Post created successfully");
    },
  });

  const handleSubmit = (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>,
  ) => {
    mutate(values, {
      onSuccess() {
        actions.resetForm();
      },
    });
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
      {({ isValid, dirty }) => (
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
              rows="8"
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
              disabled={!isValid || !dirty}
            >
              Create post
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
