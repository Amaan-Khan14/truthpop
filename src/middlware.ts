import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest,) {

    const token = await getToken({ req, secret: process.env.SECRET });
    const url = req.nextUrl;
    if (token &&
        (
            url.pathname === '/signin' ||
            url.pathname === '/signup' ||
            url.pathname === '/dashboard' ||
            url.pathname === '/' ||
            url.pathname === '/verify'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }
    const res = NextResponse.next()
    return res;
}

export const config = {
    matcher: [
        '/signin',
        'signup',
        '/dashboard/:path*',
        '/',
        '/verify/:path*'
    ],

}