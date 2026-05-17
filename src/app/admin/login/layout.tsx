// ─── Login Layout ───
// This layout OVERRIDES the parent admin layout for the login page.
// Without this, the admin layout's auth check would redirect unauthenticated
// users away from the login page itself — creating an infinite redirect loop.

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
