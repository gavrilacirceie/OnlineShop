import { formatRevenue } from '../../../utils/formatPrice';

const tones = {
    blue: {
        accent: "bg-blue-500",
        icon: "bg-blue-50 text-blue-600 ring-blue-100",
        glow: "bg-blue-400/10",
    },
    violet: {
        accent: "bg-violet-500",
        icon: "bg-violet-50 text-violet-600 ring-violet-100",
        glow: "bg-violet-400/10",
    },
    emerald: {
        accent: "bg-emerald-500",
        icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        glow: "bg-emerald-400/10",
    },
};

const DashboardOverview = ({
    title,
    amount,
    Icon,
    description,
    tone = "blue",
    revenue = false,
}) => {
    const palette = tones[tone] ?? tones.blue;
    const numericAmount = Number(amount) || 0;
    const displayedAmount = revenue
        ? `$${formatRevenue(numericAmount)}`
        : numericAmount.toLocaleString("en-US");

    return (
        <article className="group relative min-h-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className={`absolute inset-x-0 top-0 h-1 ${palette.accent}`} />
            <div className={`absolute -right-12 -top-12 h-36 w-36 rounded-full ${palette.glow} transition-transform duration-500 group-hover:scale-125`} />

            <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-500">
                            {title}
                        </p>
                        <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                            {displayedAmount}
                        </p>
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${palette.icon}`}>
                        <Icon className="text-xl" aria-hidden="true" />
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className={`h-2 w-2 rounded-full ${palette.accent}`} />
                    <p className="text-sm leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default DashboardOverview
