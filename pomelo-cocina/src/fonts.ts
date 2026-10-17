import { loadFont as loadItim } from "@remotion/google-fonts/Itim";
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";

// The Paper design's fonts. loadFont blocks rendering until they're ready.
export const { fontFamily: DISPLAY_FONT } = loadItim("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
export const { fontFamily: BODY_FONT } = loadMali("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});
// The kit's debug overlay uses FONT_FAMILY.
export const FONT_FAMILY = BODY_FONT;
