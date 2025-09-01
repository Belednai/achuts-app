// Data seeding and migration utilities

import type { Article, Notification, PageView, ActivityEvent } from './types';
import { storage } from './storage';
import { authService } from './auth';

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Migrate existing articles from static data to storage
export async function migrateExistingArticles(): Promise<void> {
  // Import existing articles from the static data
  const existingArticles = [
    {
      title: "Constitutional Rights in the Digital Age: Privacy vs. Security in Kenya",
      summary: "An in-depth analysis of how the 2010 Constitution addresses digital privacy rights and the challenges posed by modern surveillance technologies.",
      category: "Constitutional Law",
      tags: ["Privacy Rights", "Digital Law", "Constitutional Analysis"],
      publishDate: "March 15, 2024",
      readingTime: "8 min read",
      slug: "constitutional-rights-digital-age",
      featured: true,
    },
    {
      title: "Understanding Criminal Procedure: Recent Amendments to the CPC",
      summary: "A comprehensive review of the latest amendments to the Criminal Procedure Code and their implications for legal practice.",
      category: "Criminal Law",
      tags: ["Criminal Procedure", "Legal Updates", "Court Practice"],
      publishDate: "March 10, 2024",
      readingTime: "6 min read",
      slug: "criminal-procedure-amendments",
    },
    {
      title: "Land Rights and Succession Laws: A Practical Guide",
      summary: "Navigate the complexities of land inheritance and succession under Kenyan law with practical examples and case studies.",
      category: "Property Law",
      tags: ["Land Law", "Succession", "Property Rights"],
      publishDate: "March 5, 2024",
      readingTime: "10 min read",
      slug: "land-rights-succession-guide",
    },
    {
      title: "Employment Law Update: New Regulations on Remote Work",
      summary: "Recent changes in employment regulations addressing remote work arrangements and their legal implications for employers and employees.",
      category: "Employment Law",
      tags: ["Employment", "Remote Work", "Labor Law"],
      publishDate: "February 28, 2024",
      readingTime: "5 min read",
      slug: "employment-remote-work-regulations",
    },
    {
      title: "Corporate Governance in Kenya: New Compliance Requirements",
      summary: "Understanding the latest corporate governance guidelines and their impact on business operations in Kenya.",
      category: "Corporate Law",
      tags: ["Corporate Governance", "Compliance", "Business Law"],
      publishDate: "February 20, 2024",
      readingTime: "7 min read",
      slug: "corporate-governance-compliance",
    },
    {
      title: "Environmental Law and Climate Change Litigation",
      summary: "Exploring the growing field of environmental law and climate change litigation in the East African context.",
      category: "Environmental Law",
      tags: ["Environmental Law", "Climate Change", "Litigation"],
      publishDate: "February 15, 2024",
      readingTime: "9 min read",
      slug: "environmental-law-climate-litigation",
    }
  ];

  const storedArticles = storage.getArticles();
  
  // Only migrate if no articles exist in storage
  if (storedArticles.length === 0) {
    const migratedArticles: Article[] = existingArticles.map(article => ({
      id: generateId(),
      title: article.title,
      slug: article.slug,
      content: generateSampleContent(article.title, article.summary),
      summary: article.summary,
      coverImage: undefined,
      category: article.category,
      tags: article.tags,
      status: 'PUBLISHED' as const,
      publishedAt: new Date(article.publishDate).toISOString(),
      createdAt: new Date(article.publishDate).toISOString(),
      updatedAt: new Date().toISOString(),
      readingTime: article.readingTime
    }));

    storage.setArticles(migratedArticles);

    // Log migration activity
    storage.addActivity({
      id: generateId(),
      type: 'ARTICLE_CREATED',
      description: `Migrated ${migratedArticles.length} existing articles to admin system`,
      timestamp: new Date().toISOString(),
      metadata: { count: migratedArticles.length }
    });

    console.log(`Migrated ${migratedArticles.length} articles to admin storage`);
  }
}

// Generate sample content for migrated articles
function generateSampleContent(title: string, summary: string): string {
  return `# ${title}

${summary}

## Introduction

This article provides a comprehensive analysis of the topic at hand, examining various legal frameworks, precedents, and their practical implications for legal practitioners and the general public.

## Legal Framework

The legal framework governing this area is complex and multifaceted, involving various statutes, regulations, and case law that have evolved over time.

### Key Legislation

- Primary legislation that establishes the foundational principles
- Secondary regulations that provide detailed implementation guidance
- Recent amendments that address contemporary challenges

### Case Law Development

Courts have played a crucial role in interpreting and developing the law in this area through landmark decisions that have shaped current practice.

## Practical Implications

The practical implications of these legal developments are far-reaching and affect various stakeholders including:

1. Legal practitioners who must adapt their practice to new requirements
2. Businesses that need to ensure compliance with updated regulations
3. Individual citizens whose rights and obligations are affected

## Current Challenges

Several challenges remain in the implementation and interpretation of these legal provisions:

- Balancing competing interests and rights
- Ensuring effective enforcement mechanisms
- Adapting to technological and social changes

## Future Outlook

Looking ahead, we can expect continued evolution in this area of law as society and technology continue to advance. Legal practitioners must stay informed about these developments to effectively serve their clients.

## Conclusion

This analysis demonstrates the importance of understanding both the theoretical foundations and practical applications of the law in this area. Continued monitoring of developments will be essential for effective legal practice.

---

*This article is for informational purposes only and does not constitute legal advice. Consult with a qualified legal professional for specific legal guidance.*`;
}

// Seed initial notifications
export function seedNotifications(): void {
  const existingNotifications = storage.getNotifications();
  
  if (existingNotifications.length === 0) {
    const initialNotifications: Notification[] = [
      {
        id: generateId(),
        title: "Welcome to Admin Dashboard",
        body: "Your admin dashboard has been successfully set up. You can now manage articles, notifications, and view analytics.",
        type: "INFO",
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: "Security Reminder",
        body: "Please change your default admin credentials and ensure strong password protection.",
        type: "WARN",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
      },
      {
        id: generateId(),
        title: "System Initialization Complete",
        body: "All admin systems have been initialized successfully. Your existing articles have been migrated to the new system.",
        type: "INFO",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      }
    ];

    storage.setNotifications(initialNotifications);
    console.log(`Seeded ${initialNotifications.length} initial notifications`);
  }
}

// Seed sample page views for analytics
export function seedPageViews(): void {
  const existingViews = storage.getPageViews();
  
  if (existingViews.length === 0) {
    const sampleViews: PageView[] = [];
    const articles = storage.getArticles();
    
    // Generate sample views for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Random number of views per day (0-50)
      const viewsPerDay = Math.floor(Math.random() * 50);
      
      for (let j = 0; j < viewsPerDay; j++) {
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        const randomSecond = Math.floor(Math.random() * 60);
        
        const viewTime = new Date(date);
        viewTime.setHours(randomHour, randomMinute, randomSecond);
        
        // Random page - either article or other page
        let path = '/';
        if (Math.random() > 0.3 && articles.length > 0) {
          // 70% chance of article view
          const randomArticle = articles[Math.floor(Math.random() * articles.length)];
          path = `/articles/${randomArticle.slug}`;
        } else {
          // 30% chance of other pages
          const otherPages = ['/', '/about', '/contact', '/articles', '/subscribe'];
          path = otherPages[Math.floor(Math.random() * otherPages.length)];
        }
        
        sampleViews.push({
          id: generateId(),
          path,
          timestamp: viewTime.toISOString(),
          userAgent: 'Mozilla/5.0 (sample data)',
          ip: '127.0.0.1'
        });
      }
    }
    
    // Add sample views
    sampleViews.forEach(view => storage.addPageView(view));
    console.log(`Seeded ${sampleViews.length} sample page views for analytics`);
  }
}

// Run all initialization
export async function initializeAdminSystem(): Promise<void> {
  console.log('Initializing admin system...');
  
  try {
    // Initialize owner account
    console.log('Creating owner account...');
    await authService.initializeOwnerAccount();
    
    // Migrate existing articles
    console.log('Migrating articles...');
    await migrateExistingArticles();
    
    // Run storage migrations
    console.log('Running storage migrations...');
    storage.migrateArticles();
    
    // Seed initial notifications
    console.log('Seeding notifications...');
    seedNotifications();
    
    // Seed sample page views for analytics
    console.log('Seeding page views...');
    seedPageViews();
    
    console.log('Admin system initialization complete!');
    
    // Add initialization activity
    storage.addActivity({
      id: generateId(),
      type: 'ARTICLE_CREATED',
      description: 'Admin system initialization completed',
      timestamp: new Date().toISOString(),
      metadata: {
        articlesCount: storage.getArticles().length,
        notificationsCount: storage.getNotifications().length,
        pageViewsCount: storage.getPageViews().length
      }
    });
    
  } catch (error) {
    console.error('Error initializing admin system:', error);
    throw error;
  }
}

// Force initialization (for debugging)
export async function forceInitializeAdminSystem(): Promise<void> {
  console.log('Force initializing admin system...');
  
  // Clear all data first
  storage.clearAllData();
  
  // Then reinitialize
  await initializeAdminSystem();
}

// Reset admin system (for development/testing)
export function resetAdminSystem(): void {
  console.log('Resetting admin system...');
  storage.clearAllData();
  console.log('Admin system reset complete');
}
