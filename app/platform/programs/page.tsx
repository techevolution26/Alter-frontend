import Link from "next/link";
import { apiFetch } from "@/lib/api";
import ProgramCard from "@/components/platform/ProgramCard";
import type { ProgramWithStats } from "@/lib/types";

export default async function PlatformProgramsPage() {
    const programs = await apiFetch<ProgramWithStats[]>("/programs?limit=100", {
        authenticated: false,
    });

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl text-ink">Programs</h2>
                <Link href="/platform/programs/new" className="btn-primary !px-4 !py-1.5 text-sm">
                    New program
                </Link>
            </div>

            {programs.length === 0 ? (
                <p className="mt-8 text-ink/50">No programs yet.</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {programs.map((program) => (
                        <ProgramCard key={program.id} program={program} />
                    ))}
                </div>
            )}
        </div>
    );
}