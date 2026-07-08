import { AuthForm } from "@/components/auth/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthForm mode="signin" redirectTo={redirect} />
    </main>
  );
}
