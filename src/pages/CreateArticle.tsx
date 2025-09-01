import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";

const CreateArticle = () => {
  return (
    <AdminLayout>
      <ArticleForm mode="create" />
    </AdminLayout>
  );
};

export default CreateArticle;
