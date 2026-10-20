import type { ReactNode, SVGProps } from "react";

export type IconName = "grid" | "chart" | "layers" | "globe" | "clock" | "settings" | "search" | "bell" | "user" | "shield" | "sparkles" | "check" | "plus" | "arrow-up-right" | "package" | "close" | "mail" | "pin" | "activity";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number; strokeWidth?: number };

const paths: Record<IconName, ReactNode> = {
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>,
  chart: <><path d="M4 19.5h16"/><path d="M6.5 16V11m5 5V5m5 11v-7"/><path d="m5 8 6-4 5 3 3-2"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2 1-1.2 2.1-1.5-.5a8 8 0 0 1-1.5.9l-.3 1.6h-2.4l-.4-1.6a8 8 0 0 1-1.6-.9l-1.5.5-1.2-2.1 1.2-1a7 7 0 0 1 0-1.8l-1.2-1 1.2-2.1 1.5.5a8 8 0 0 1 1.5-.9l.4-1.6h2.4l.3 1.6a8 8 0 0 1 1.6.9l1.5-.5 1.2 2.1-1.2 1a7 7 0 0 1-.1 1.8Z" transform="translate(-1 -1)"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  shield: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></>,
  sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM5 15l.7 1.8L7.5 17.5l-1.8.7L5 20l-.7-1.8-1.8-.7 1.8-.7L5 15Z"/></>,
  check: <><path d="m5 12 4.5 4.5L19 7"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  "arrow-up-right": <><path d="M7 17 17 7M8 7h9v9"/></>,
  package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9M8 5.3l8 4.5"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  activity: <><path d="M3 12h4l3-8 4 16 3-8h4"/></>,
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{paths[name]}</svg>;
}
