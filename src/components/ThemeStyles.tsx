import { getTheme } from "@/lib/data";
import { themeToCssVars } from "@/lib/theme";

/** Server component: injects theme CSS variables + maps them onto design classes */
export default function ThemeStyles() {
  const theme = getTheme();
  const vars = themeToCssVars(theme.colors);
  const css = `
:root {
  ${vars}
}
/* Map theme onto the selected teal/amber design classes */
.bg-teal-800, .bg-teal-900 { background-color: var(--navy) !important; }
.hover\\:bg-teal-900:hover, .hover\\:bg-teal-800:hover { background-color: var(--navy-mid) !important; }
.text-teal-400, .text-teal-600, .text-teal-700, .text-teal-800, .text-teal-900 {
  color: var(--navy) !important;
}
.border-teal-200, .hover\\:border-teal-200:hover, .border-teal-300 {
  border-color: color-mix(in srgb, var(--navy) 35%, transparent) !important;
}
.bg-amber-500 { background-color: var(--accent) !important; }
.hover\\:bg-amber-400:hover { background-color: var(--accent) !important; filter: brightness(1.08); }
.text-amber-400, .text-amber-500 { color: var(--accent) !important;
}
.shadow-amber-500\\/25 { --tw-shadow-color: color-mix(in srgb, var(--accent) 25%, transparent) !important; }
::selection {
  background: var(--accent-soft);
  color: var(--navy);
}
*:focus-visible {
  outline-color: var(--navy);
}
`.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
