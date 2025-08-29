import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  title: string;
  summary: string;
  category: string;
  tags: string[];
  publishDate: string;
  readingTime: string;
  slug: string;
  coverImage?: string;
  featured?: boolean;
}

const ArticleCard = ({
  title,
  summary,
  category,
  tags,
  publishDate,
  readingTime,
  slug,
  coverImage,
  featured = false,
}: ArticleCardProps) => {
  return (
    <Card data-testid="article-card" className={`group hover:shadow-elegant transition-all duration-300 border-border/50 ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      {coverImage && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={coverImage}
            alt={title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {category}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {publishDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readingTime}
          </div>
        </div>
        
        <h3 className={`font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className={`text-muted-foreground line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
          {summary}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <Link to={`/articles/${slug}`}>
          <Button variant="ghost" className="w-full justify-between group/btn">
            Read Article
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;