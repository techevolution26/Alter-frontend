import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import type { User } from "@/lib/types";

export default function Nav({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-vigil/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-linen">
          Alter
        </Link>

        <nav className="flex items-center gap-1 font-body text-sm">
          <Link
            href="/testimonies"
            className="rounded-full px-3 py-2 text-linen/80 transition hover:bg-white/5 hover:text-linen"
          >
            Testimonies
          </Link>
          <Link
            href="/events"
            className="rounded-full px-3 py-2 text-linen/80 transition hover:bg-white/5 hover:text-linen"
          >
            Events
          </Link>
          <Link
            href="/give"
            className="rounded-full px-3 py-2 text-linen/80 transition hover:bg-white/5 hover:text-linen"
          >
            Give
          </Link>

          <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />

          {user ? (
            <>
              <span className="hidden px-2 text-linen/60 sm:inline">Hi, {user.full_name.split(" ")[0]}</span>
              <form action={logoutAction}>
                <button type="submit" className="rounded-full px-3 py-2 text-linen/80 transition hover:bg-white/5 hover:text-linen">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3 py-2 text-linen/80 transition hover:bg-white/5 hover:text-linen">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary ml-1 !px-4 !py-1.5 text-sm">
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
