import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

// Plus Jakarta Sans, the app's own font. loadFont blocks rendering until ready.
export const { fontFamily: FONT_FAMILY } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});
