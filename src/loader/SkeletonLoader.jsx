export default function SkeletonLoader() {
  return (
    <div className="rounded-2xl border border-accent/10 bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Table Head */}
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm border-b border-accent/10">
            <tr>
              <th className="px-4 py-3 w-20"></th>
              <th className="px-4 py-3 w-48"></th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3 w-36"></th>
              <th className="px-4 py-3 w-32"></th>
              <th className="px-4 py-3 w-44"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-accent/5">
            {Array.from({ length: 6 }).map((_, index) => (
              <tr
                key={index}
                className={`${index % 2 === 1 ? "bg-muted/20" : ""}`}
              >
                {/* Icon */}
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                </td>

                {/* Title */}
                <td className="px-4 py-3">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                </td>

                {/* Description */}
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted animate-pulse" />
                    <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
                  </div>
                </td>

                {/* Link */}
                <td className="px-4 py-3">
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                </td>

                {/* Created */}
                <td className="px-4 py-3">
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
                    <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}