import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';

const mockArticle = {
  title: "Test Article Title",
  summary: "This is a test article summary",
  category: "Test Category",
  tags: ["tag1", "tag2", "tag3"],
  publishDate: "March 15, 2024",
  readingTime: "5 min read",
  slug: "test-article-slug",
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    renderWithRouter(
      <ArticleCard {...mockArticle} />
    );

    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.summary)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.category)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.publishDate)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.readingTime)).toBeInTheDocument();
  });

  it('renders Read Article button with correct link', () => {
    renderWithRouter(
      <ArticleCard {...mockArticle} />
    );

    const readButton = screen.getByRole('button', { name: /read article/i });
    expect(readButton).toBeInTheDocument();
    
    const link = readButton.closest('a');
    expect(link).toHaveAttribute('href', `/articles/${mockArticle.slug}`);
  });

  it('renders tags correctly', () => {
    renderWithRouter(
      <ArticleCard {...mockArticle} />
    );

    mockArticle.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('applies featured styling when featured prop is true', () => {
    renderWithRouter(
      <ArticleCard {...mockArticle} featured={true} />
    );

    const card = screen.getByText(mockArticle.title).closest('.group');
    expect(card).toHaveClass('md:col-span-2', 'lg:col-span-2');
  });
});
