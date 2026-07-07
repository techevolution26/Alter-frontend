import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl italic text-ink">Welcome back</h1>
      <p className="mt-2 text-ink/60">Sign in to share, pray, and give.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
