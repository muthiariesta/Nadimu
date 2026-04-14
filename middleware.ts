import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/Login", "/register", "/Petastok"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user && pathname === "/Login") {
    return NextResponse.redirect(new URL("/Dashboard", request.url));
  }

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/Dashboard", request.url));
  }

  const { data: profil } = await supabase
    .from("profil")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profil?.role ?? "pengguna";

  if (pathname.startsWith("/Dashboard/pmi") && role !== "pmi") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/Dashboard/penyelenggara") && role !== "penyelenggara") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|asset|peta.html).*)"],
};