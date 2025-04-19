import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // 检查是否是管理员路径
  const isAdminPath = path.startsWith("/admin");

  // 如果用户未登录，重定向到登录页面
  if (!token) {
    if (isAdminPath) {
      return NextResponse.redirect(
        new URL("/auth/signin?callbackUrl=/admin", request.url)
      );
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // 检查用户角色和访问路径
  const userRole = token.role as string;

  // 普通用户不能访问 /admin 路径
  if (userRole === "user" && isAdminPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/images/:path*",
    "/api/tags/:path*",

    // '/((?!api|_next/static|_next/image|pattern.svg|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
