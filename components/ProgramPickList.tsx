import type { ProgramWithStats } from "@/lib/types";

function progressPercent(program: ProgramWithStats): number | null {
    if (!program.target_amount) return null;
    const target = parseFloat(program.target_amount);
    if (!(target > 0)) return null;
    const raised = parseFloat(program.total_raised);
    return Math.min(100, Math.round((raised / target) * 100));
}

export default function ProgramPickList({ programs }: { programs: ProgramWithStats[] }) {
    return (
        <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-vigil/15 p-4 has-[:checked]:border-ember has-[:checked]:bg-ember/5">
                <input type="radio" name="program_id" value="" defaultChecked className="mt-1" />
                <div>
                    <span className="font-body text-sm font-medium text-ink">Wherever it's needed most</span>
                    <p className="mt-1 text-xs text-ink/50">
                        Directed to the community's most pressing need right now.
                    </p>
                </div>
            </label>

            {programs.map((program) => {
                const progress = progressPercent(program);
                return (
                    <label
                        key={program.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-vigil/15 p-4 has-[:checked]:border-ember has-[:checked]:bg-ember/5"
                    >
                        <input type="radio" name="program_id" value={program.id} className="mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-body text-sm font-medium text-ink">{program.name}</span>
                                {progress !== null && (
                                    <span className="shrink-0 font-mono text-xs text-clay">{progress}%</span>
                                )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-ink/50">{program.description}</p>
                            {progress !== null && (
                                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-vigil/10">
                                    <div className="h-full rounded-full bg-ember" style={{ width: `${progress}%` }} />
                                </div>
                            )}
                        </div>
                    </label>
                );
            })}
        </div>
    );
}

// A dropdown select version of this component is also available, but is currently unused. It can be found commented out below:


// import type { ProgramWithStats } from "@/lib/types";

// export default function ProgramPickList({ programs }: { programs: ProgramWithStats[] }) {
//     return (
//         <div className="space-y-2">
//             <select
//                 name="program_id"
//                 defaultValue=""
//                 className="field-input"
//                 aria-label="Choose a program"
//             >
//                 <option value="">Wherever it's needed most</option>
//                 {programs.map((program) => (
//                     <option key={program.id} value={program.id}>
//                         {program.name}
//                     </option>
//                 ))}
//             </select>

//             <p className="text-xs text-ink/50">
//                 Directed to the community's most pressing need right now when left on the default option.
//             </p>
//         </div>
//     );
// }