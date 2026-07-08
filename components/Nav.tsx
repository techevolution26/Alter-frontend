"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import type { User } from "@/lib/types";
import { useGlobalLoader } from "@/components/GlobalLoaderProvider";

export default function Nav({ user }: { user: User | null }) {
  const pathname = usePathname();
  const { startLoading } = useGlobalLoader();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleNavigationStart = (href: string) => {
    if (pathname === href) {
      return;
    }

    startLoading();
    setMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClassName = (href: string) =>
    `rounded-full px-3 py-2 text-sm transition ${isActive(href)
      ? "bg-ember/15 text-linen shadow-sm"
      : "text-linen/80 hover:bg-white/5 hover:text-linen"
    }`;

  const renderLinks = (mobile = false) => (
    <>
      <Link
        href="/testimonies"
        onClick={() => handleNavigationStart("/testimonies")}
        aria-current={isActive("/testimonies") ? "page" : undefined}
        className={linkClassName("/testimonies")}
      >
        Testimonies
      </Link>
      <Link
        href="/events"
        onClick={() => handleNavigationStart("/events")}
        aria-current={isActive("/events") ? "page" : undefined}
        className={linkClassName("/events")}
      >
        Events
      </Link>
      <Link
        href="/give"
        onClick={() => handleNavigationStart("/give")}
        aria-current={isActive("/give") ? "page" : undefined}
        className={linkClassName("/give")}
      >
        Give
      </Link>

      {user && ["moderator", "field_staff", "admin"].includes(user.role) && (
        <Link
          href="/admin"
          onClick={() => handleNavigationStart("/admin")}
          aria-current={isActive("/admin") ? "page" : undefined}
          className={linkClassName("/admin")}
        >
          Staff
        </Link>
      )}

      {user ? (
        <>
          {!mobile && <span className="hidden px-2 text-linen/60 sm:inline">Hi, {user.full_name.split(" ")[0]}</span>}
          <form action={logoutAction} onSubmit={() => startLoading()}>
            <button type="submit" className="rounded-full px-3 py-2 text-left text-sm text-linen/80 transition hover:bg-white/5 hover:text-linen">
              Sign out
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/login"
            onClick={() => handleNavigationStart("/login")}
            aria-current={isActive("/login") ? "page" : undefined}
            className={linkClassName("/login")}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={() => handleNavigationStart("/register")}
            aria-current={isActive("/register") ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm transition ${isActive("/register")
              ? "bg-ember/15 text-linen shadow-sm"
              : "bg-ember text-linen hover:bg-ember/90"
              }`}
          >
            Join
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-vigil/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-linen">
          Alter_The OverFlow
        </Link>

        <nav className="hidden items-center gap-1 font-body text-sm md:flex">
          {renderLinks()}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-full p-2 text-linen transition hover:bg-white/5"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-menu" className="border-t border-white/10 bg-vigil/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2 font-body text-sm">
            {renderLinks(true)}
          </div>
        </div>
      )}
    </header>
  );
}
