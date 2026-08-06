import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "sm" | "md" | "lg";
};

const textSize = {
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-3xl",
} as const;

const iconSize = {
  sm: 20,
  md: 28,
  lg: 40,
} as const;

/**
 * Google Meet wordmark — yellow camera icon + "Google Meet" text.
 *
 * Icon SVG lives in /public/google-meet.svg. Text uses the display font.
 */
export function Wordmark({ size = "md" }: Props) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 focus-visible:outline-none"
      aria-label="Google Meet"
    >
      <Image
        src="/google-meet.svg"
        alt=""
        aria-hidden
        width={iconSize[size]}
        height={Math.round((iconSize[size] * 40) / 48)}
        priority
      />
      <span
        className={`font-heading ${textSize[size]} font-normal tracking-tight text-foreground`}
      >
        Google Meet
      </span>
    </Link>
  );
}
