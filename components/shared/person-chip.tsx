import type { Person } from "@/types";
import { cn } from "@/lib/utils";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type PersonAvatarProps = {
  person: Person;
  size?: "xs" | "sm" | "md";
  className?: string;
};

const sizeClasses: Record<NonNullable<PersonAvatarProps["size"]>, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-[11px]",
  md: "size-8 text-xs",
};

export function PersonAvatar({
  person,
  size = "sm",
  className,
}: PersonAvatarProps) {
  const isExternal = person.relationshipType === "external";
  return (
    <div
      aria-label={person.name}
      title={`${person.name} · ${person.role}`}
      className={cn(
        "grid place-items-center rounded-full font-medium ring-1 ring-inset",
        isExternal
          ? "bg-attention-subtle text-attention-foreground ring-attention/40"
          : "bg-action-subtle text-action ring-action/20",
        sizeClasses[size],
        className,
      )}
    >
      {initialsOf(person.name)}
    </div>
  );
}

type PersonStackProps = {
  people: readonly Person[];
  max?: number;
  size?: PersonAvatarProps["size"];
};

export function PersonStack({ people, max = 4, size = "sm" }: PersonStackProps) {
  const visible = people.slice(0, max);
  const remainder = people.length - visible.length;
  const overlap = size === "xs" ? "-ml-1" : size === "sm" ? "-ml-1.5" : "-ml-2";
  return (
    <div className="flex items-center">
      {visible.map((p, i) => (
        <div key={p.id} className={cn(i > 0 && overlap)}>
          <PersonAvatar person={p} size={size} className="ring-2 ring-background" />
        </div>
      ))}
      {remainder > 0 && (
        <span className={cn("ml-2 text-xs text-muted-foreground")}>
          +{remainder}
        </span>
      )}
    </div>
  );
}
