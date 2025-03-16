import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 需要保护的路径
const protectedPaths = ["/admin"];
// 排除的路径（不需要验证的路径）
const excludedPaths = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 如果是登录页面或其他排除的路径，直接放行
  if (excludedPaths.some(prefix => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 检查是否是受保护的路径
  if (protectedPaths.some((prefix) => path.startsWith(prefix))) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // 如果没有 token，重定向到登录页面
    if (!token) {
      const loginUrl = new URL("/api/auth/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // 检查用户角色（可选）
    if (token.role !== "admin") {
      return new NextResponse("权限不足", { status: 403 });
    }

    return NextResponse.next();
  }

  // 不是受保护的路径，继续请求
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    "/admin/:path*", 
    "/api/images/:path*", 
    "/api/tags/:path*",
  ],
};
