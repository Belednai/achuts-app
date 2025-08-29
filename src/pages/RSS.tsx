const RSS = () => {
  // Generate RSS feed content
  const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Achut's Law Notebook</title>
    <description>Legal insights, constitutional commentary, and case analyses from a Kenyan perspective</description>
    <link>https://lawnotebook.com</link>
    <atom:link href="https://lawnotebook.com/rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    
    <item>
      <title>Constitutional Rights in the Digital Age: Privacy vs. Security in Kenya</title>
      <description>An in-depth analysis of how the 2010 Constitution addresses digital privacy rights and the challenges posed by modern surveillance technologies.</description>
      <link>https://lawnotebook.com/articles/constitutional-rights-digital-age</link>
      <pubDate>Fri, 15 Mar 2024 00:00:00 GMT</pubDate>
      <guid>https://lawnotebook.com/articles/constitutional-rights-digital-age</guid>
    </item>
    
    <item>
      <title>Understanding Criminal Procedure: Recent Amendments to the CPC</title>
      <description>A comprehensive review of the latest amendments to the Criminal Procedure Code and their implications for legal practice.</description>
      <link>https://lawnotebook.com/articles/criminal-procedure-amendments</link>
      <pubDate>Sun, 10 Mar 2024 00:00:00 GMT</pubDate>
      <guid>https://lawnotebook.com/articles/criminal-procedure-amendments</guid>
    </item>
    
    <item>
      <title>Land Rights and Succession Laws: A Practical Guide</title>
      <description>Navigate the complexities of land inheritance and succession under Kenyan law with practical examples and case studies.</description>
      <link>https://lawnotebook.com/articles/land-rights-succession-guide</link>
      <pubDate>Tue, 05 Mar 2024 00:00:00 GMT</pubDate>
      <guid>https://lawnotebook.com/articles/land-rights-succession-guide</guid>
    </item>
  </channel>
</rss>`;

  // Set headers and return RSS content
  window.location.href = `data:application/rss+xml;charset=utf-8,${encodeURIComponent(rssContent)}`;
  
  return null;
};

export default RSS;