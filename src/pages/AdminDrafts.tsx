import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  FileEdit, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Send,
  Clock,
  Tag,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { storage } from "@/lib/storage";
import type { Article } from "@/lib/types";

const AdminDrafts = () => {
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [filteredDrafts, setFilteredDrafts] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Drafts - Admin Dashboard";
    loadDrafts();
  }, []);

  useEffect(() => {
    filterDrafts();
  }, [drafts, searchQuery]);

  const loadDrafts = () => {
    const allArticles = storage.getArticles();
    const draftArticles = allArticles.filter(article => article.status === 'DRAFT');
    // Sort by most recent first
    draftArticles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setDrafts(draftArticles);
  };

  const filterDrafts = useCallback(() => {
    let filtered = drafts;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(draft => 
        draft.title.toLowerCase().includes(query) ||
        draft.summary?.toLowerCase().includes(query) ||
        draft.category.toLowerCase().includes(query) ||
        draft.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredDrafts(filtered);
  }, [drafts, searchQuery]);

  const publishDraft = async (id: string) => {
    setIsLoading(true);
    try {
      const draft = storage.getArticleById(id);
      if (!draft) {
        throw new Error('Draft not found');
      }

      // Check if slug is unique among published articles
      const publishedArticles = storage.getArticles().filter(a => a.status === 'PUBLISHED');
      const slugExists = publishedArticles.some(a => a.slug === draft.slug && a.id !== id);
      
      if (slugExists) {
        toast({
          title: "Cannot publish",
          description: "An article with this slug already exists. Please edit the draft and change the slug.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Update article to published status
      const updatedArticle: Article = {
        ...draft,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.updateArticle(updatedArticle);
      loadDrafts();
      
      toast({
        title: "Draft published successfully",
        description: `"${draft.title}" is now live on your website.`,
      });

      // Log activity
      storage.addActivity({
        id: Date.now().toString(),
        type: 'ARTICLE_PUBLISHED',
        description: `Published article: ${draft.title}`,
        timestamp: new Date().toISOString(),
        metadata: { articleId: id, slug: draft.slug }
      });

    } catch (error) {
      toast({
        title: "Error publishing draft",
        description: error instanceof Error ? error.message : "Failed to publish draft.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (id: string) => {
    setIsLoading(true);
    try {
      const draft = storage.getArticleById(id);
      storage.deleteArticle(id);
      loadDrafts();
      
      toast({
        title: "Draft deleted",
        description: "The draft has been permanently removed.",
      });

      // Log activity
      storage.addActivity({
        id: Date.now().toString(),
        type: 'ARTICLE_UPDATED',
        description: `Deleted draft: ${draft?.title || 'Unknown'}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete draft.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSinceUpdate = (dateStr: string) => {
    const now = new Date();
    const updated = new Date(dateStr);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Drafts</h1>
            <p className="text-muted-foreground mt-2">
              Manage your unpublished articles and work in progress
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link to="/admin/articles/new?status=DRAFT">
                <Plus className="h-4 w-4 mr-2" />
                New Draft
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileEdit className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Drafts</p>
                  <p className="text-lg font-semibold">{drafts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Recent Updates</p>
                  <p className="text-lg font-semibold">
                    {drafts.filter(d => {
                      const dayAgo = new Date();
                      dayAgo.setDate(dayAgo.getDate() - 1);
                      return new Date(d.updatedAt) > dayAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Publish</p>
                  <p className="text-lg font-semibold">
                    {drafts.filter(d => d.title && d.content && d.summary).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Drafts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Drafts ({filteredDrafts.length})</CardTitle>
            <CardDescription>
              {searchQuery 
                ? `Showing search results for "${searchQuery}"`
                : `All your unpublished articles`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDrafts.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrafts.map((draft) => {
                      const isComplete = draft.title && draft.content && draft.summary;
                      
                      return (
                        <TableRow key={draft.id}>
                                                   <TableCell>
                           <div>
                             <Link 
                               to={`/articles/${draft.slug}`} 
                               target="_blank"
                               className="hover:underline cursor-pointer"
                             >
                               <p className="font-medium text-primary hover:text-primary/80">
                                 {draft.title || "Untitled Draft"}
                               </p>
                             </Link>
                             {draft.summary && (
                               <p className="text-sm text-muted-foreground truncate max-w-md">
                                 {draft.summary}
                               </p>
                             )}
                             <div className="flex items-center space-x-1 mt-1">
                               {draft.tags.slice(0, 3).map(tag => (
                                 <Badge key={tag} variant="outline" className="text-xs">
                                   {tag}
                                 </Badge>
                               ))}
                               {draft.tags.length > 3 && (
                                 <Badge variant="outline" className="text-xs">
                                   +{draft.tags.length - 3}
                                 </Badge>
                               )}
                             </div>
                           </div>
                         </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{draft.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{formatDate(draft.updatedAt)}</p>
                              <p className="text-muted-foreground text-xs">
                                {getTimeSinceUpdate(draft.updatedAt)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">DRAFT</Badge>
                              {isComplete ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Ready
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  Incomplete
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                                               <DropdownMenuItem asChild>
                                 <Link to={`/admin/articles/${draft.id}/edit`}>
                                   <Edit className="h-4 w-4 mr-2" />
                                   Edit Draft
                                 </Link>
                               </DropdownMenuItem>
                               <DropdownMenuItem asChild>
                                 <Link to={`/articles/${draft.slug}`} target="_blank">
                                   <Eye className="h-4 w-4 mr-2" />
                                   Preview Draft
                                 </Link>
                               </DropdownMenuItem>
                                {isComplete && (
                                  <DropdownMenuItem 
                                    onClick={() => publishDraft(draft.id)}
                                    disabled={isLoading}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                  <Link to={`/articles/${draft.slug}`} target="_blank">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{draft.title || "this draft"}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteDraft(draft.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileEdit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No drafts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search criteria."
                    : "You don't have any drafts yet. Start writing your next article!"
                  }
                </p>
                {searchQuery ? (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/admin/articles/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Draft
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDrafts;
