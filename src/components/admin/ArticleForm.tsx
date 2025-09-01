import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Save, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import { RichTextEditor } from "./RichTextEditor";
import type { Article, CreateArticleRequest } from "@/lib/types";

interface ArticleFormProps {
  mode: 'create' | 'edit';
  articleId?: string;
}

const ArticleForm = ({ mode, articleId }: ArticleFormProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    content: '',
    summary: '',
    coverImage: '',
    category: '',
    tags: [],
    status: 'DRAFT'
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form based on mode and URL params
  useEffect(() => {
    if (mode === 'edit' && articleId) {
      const article = storage.getArticleById(articleId);
      if (article) {
        setFormData({
          title: article.title,
          content: article.content,
          summary: article.summary || '',
          coverImage: article.coverImage || '',
          category: article.category,
          tags: article.tags,
          status: article.status
        });
      }
    } else if (mode === 'create') {
      // Check if status is pre-selected from URL params
      const statusParam = searchParams.get('status');
      if (statusParam === 'DRAFT' || statusParam === 'PUBLISHED') {
        setFormData(prev => ({ ...prev, status: statusParam as 'DRAFT' | 'PUBLISHED' }));
      }
    }
  }, [mode, articleId, searchParams]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, formData.slug]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 160) {
      newErrors.title = 'Title must be 160 characters or less';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.status === 'PUBLISHED') {
      if (!formData.content.trim()) {
        newErrors.content = 'Content is required for published articles';
      }
      
      // Check slug uniqueness for published articles
      const existingArticle = storage.getArticleBySlug(formData.slug || '');
      if (existingArticle && existingArticle.id !== articleId) {
        newErrors.slug = 'This slug is already in use by another published article';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      if (mode === 'create') {
        const newArticle: Article = {
          id: Date.now().toString(),
          ...formData,
          slug: formData.slug || '',
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: formData.status === 'PUBLISHED' ? new Date().toISOString() : undefined
        };

        storage.addArticle(newArticle);
        
        // Log activity
        storage.addActivity({
          id: Date.now().toString(),
          type: formData.status === 'PUBLISHED' ? 'ARTICLE_PUBLISHED' : 'ARTICLE_CREATED',
          description: `${formData.status === 'PUBLISHED' ? 'Published' : 'Created'} article: ${formData.title}`,
          timestamp: new Date().toISOString(),
          metadata: { articleId: newArticle.id, status: formData.status }
        });

        toast({
          title: "Article created",
          description: formData.status === 'PUBLISHED' 
            ? "Article has been published successfully." 
            : "Draft has been saved successfully.",
        });

        // Redirect based on status
        if (formData.status === 'PUBLISHED') {
          navigate('/admin/articles');
        } else {
          navigate('/admin/drafts');
        }
      } else if (mode === 'edit' && articleId) {
        const existingArticle = storage.getArticleById(articleId);
        if (!existingArticle) {
          throw new Error('Article not found');
        }

        const updatedArticle: Article = {
          ...existingArticle,
          ...formData,
          slug: formData.slug || '',
          updatedAt: new Date().toISOString(),
          publishedAt: formData.status === 'PUBLISHED' && !existingArticle.publishedAt 
            ? new Date().toISOString() 
            : existingArticle.publishedAt
        };

        storage.updateArticle(updatedArticle);
        
        // Log activity
        storage.addActivity({
          id: Date.now().toString(),
          type: 'ARTICLE_UPDATED',
          description: `Updated article: ${formData.title}`,
          timestamp: new Date().toISOString(),
          metadata: { articleId, status: formData.status }
        });

        toast({
          title: "Article updated",
          description: "Article has been updated successfully.",
        });

        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'create' ? 'Create New Article' : 'Edit Article'}
            </CardTitle>
            <CardDescription>
              {mode === 'create' 
                ? 'Fill in the details below to create a new article.' 
                : 'Update the article details below.'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter article title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="Auto-generated from title"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  The URL-friendly version of the title. Leave empty to auto-generate.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                  className={errors.category ? 'border-red-500' : ''}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag and press Enter"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                          aria-label={`Remove tag ${tag}`}
                          title={`Remove tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Brief description of the article"
                  rows={3}
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'PUBLISHED' | 'DRAFT') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {formData.status === 'PUBLISHED' 
                    ? 'Published articles will be visible to the public immediately.'
                    : 'Drafts are saved privately and can be published later.'
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {formData.status === 'PUBLISHED' ? 'Publish Article' : 'Save Draft'}
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArticleForm;
