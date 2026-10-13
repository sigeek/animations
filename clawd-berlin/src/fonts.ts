import { loadFont } from "@remotion/google-fonts/Poppins";

// loadFont blocks rendering until the font is ready.
export const { fontFamily: FONT_FAMILY } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});
