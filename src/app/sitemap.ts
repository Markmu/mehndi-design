import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 基础URL
  const baseUrl = process.env.HOST || 'http://localhost:3000';

  // 静态路由
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }
  ]



  // 返回所有路由
  return staticRoutes.map(route => ({
    url: route.url,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency as "weekly" | "always" | "hourly" | "daily" | "monthly" | "yearly" | "never",
    priority: route.priority
  }));
}