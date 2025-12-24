import { ShortCard } from "@/components/community/ShortCard";
import { mockShorts } from "@/lib/community-mock-data";

export function ShortsTab() {
  // Duplicate for demo
  const shorts = [...mockShorts, ...mockShorts.map(s => ({ ...s, id: `${s.id}-dup` }))];

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        {shorts.map((short) => (
          <ShortCard key={short.id} short={short} />
        ))}
      </div>
    </div>
  );
}
