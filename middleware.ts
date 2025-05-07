
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");

    if (!accessTokenCookie) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/projects/:path*","/errordetection/:path*","/cleandata/:path*"],
};
