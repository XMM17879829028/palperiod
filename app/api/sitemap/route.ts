import { NextResponse } from 'next/server';

export async function GET() {
  // 获取当前日期作为lastmod
  const date = new Date().toISOString().split('T')[0];

  // 生成站点地图XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://palperiod.vercel.app/</loc>
        <lastmod>${date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://palperiod.vercel.app/pregnancy-calculator</loc>
        <lastmod>${date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://palperiod.vercel.app/sex-calculator</loc>
        <lastmod>${date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    </urlset>`;

  // 返回XML响应
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
} 