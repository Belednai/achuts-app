import { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image,
  Code,
  Eye,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length);
      }
      textarea.focus();
    }, 0);
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      insertText(`[${linkText}](${linkUrl})`);
      setLinkText("");
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  };

  const formatButtons = [
    {
      icon: Bold,
      tooltip: "Bold",
      action: () => insertText("**", "**", "bold text")
    },
    {
      icon: Italic,
      tooltip: "Italic",
      action: () => insertText("*", "*", "italic text")
    },
    {
      icon: Underline,
      tooltip: "Strikethrough",
      action: () => insertText("~~", "~~", "strikethrough text")
    },
    {
      icon: Code,
      tooltip: "Inline Code",
      action: () => insertText("`", "`", "code")
    },
    {
      icon: Quote,
      tooltip: "Quote",
      action: () => insertText("\n> ", "", "quoted text")
    },
    {
      icon: List,
      tooltip: "Bullet List",
      action: () => insertText("\n- ", "", "list item")
    },
    {
      icon: ListOrdered,
      tooltip: "Numbered List",
      action: () => insertText("\n1. ", "", "list item")
    }
  ];

  const renderMarkdownPreview = (markdown: string) => {
    // Simple markdown renderer for preview
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Strikethrough
      .replace(/~~(.*)~~/gim, '<del>$1</del>')
      // Inline code
      .replace(/`([^`]*)`/gim, '<code class="bg-muted px-1 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    return html;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Content Editor</CardTitle>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center">
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="edit" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
              {formatButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.tooltip}
                  className="h-8 w-8 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
              
              {/* Link Dialog */}
              <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" title="Insert Link" className="h-8 w-8 p-0">
                    <Link className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                    <DialogDescription>
                      Add a link to your content
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkText">Link Text</Label>
                      <Input
                        id="linkText"
                        placeholder="Enter link text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkUrl">URL</Label>
                      <Input
                        id="linkUrl"
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={insertLink} disabled={!linkText || !linkUrl}>
                      Insert Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertText("\n```\n", "\n```\n", "code block")}
                title="Code Block"
                className="h-8 px-3"
              >
                Code Block
              </Button>
            </div>

            {/* Editor */}
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Write your article content in Markdown..."}
              className="min-h-96 font-mono text-sm resize-none"
            />

            {/* Help text */}
            <div className="text-xs text-muted-foreground">
              <p>💡 <strong>Markdown Tips:</strong></p>
              <p>• Use # for headings (# H1, ## H2, ### H3)</p>
              <p>• **bold**, *italic*, ~~strikethrough~~</p>
              <p>• [link text](url) for links</p>
              <p>• ```code``` for code blocks</p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-md p-4 min-h-96 bg-background">
              {value ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownPreview(value) 
                  }}
                />
              ) : (
                <p className="text-muted-foreground text-center py-12">
                  Nothing to preview yet. Start writing in the Edit tab.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
