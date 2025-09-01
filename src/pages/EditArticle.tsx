import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Article ID Required</h1>
            <p className="text-muted-foreground mt-2">
              No article ID provided for editing.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ArticleForm mode="edit" articleId={id} />
    </AdminLayout>
  );
};

export default EditArticle;
