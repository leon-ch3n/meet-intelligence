"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * Aurora background — soft diagonal color sweep for hero surfaces.
 *
 * Adapted from the shadcn Aurora recipe. Tailwind v4 doesn't ship a plugin
 * that injects color CSS variables, so the color stops are hard-coded here
 * as hex values via inline custom properties. The `animate-aurora` keyframe
 * lives in `app/globals.css`.
 */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-transparent text-slate-950 transition-[background]",
        className,
      )}
      style={
        {
          "--white": "#ffffff",
          "--black": "#000000",
          "--transparent": "transparent",
          "--blue-500": "#3b82f6",
          "--blue-400": "#60a5fa",
          "--blue-300": "#93c5fd",
          "--indigo-300": "#a5b4fc",
          "--violet-200": "#ddd6fe",
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `pointer-events-none absolute -inset-[10px] opacity-60 will-change-transform
             [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
             [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
             [background-image:var(--white-gradient),var(--aurora)]
             [background-size:300%,_200%]
             [background-position:50%_50%,50%_50%]
             blur-[10px] invert filter
             [animation:aurora_120s_linear_infinite]
             after:absolute after:inset-0 after:content-[""]
             after:[background-image:var(--white-gradient),var(--aurora)]
             after:[background-size:200%,_100%]
             after:[background-attachment:fixed] after:mix-blend-difference
             after:[animation:aurora_120s_linear_infinite]`,
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]",
          )}
        />
      </div>
      {children}
    </div>
  );
};
