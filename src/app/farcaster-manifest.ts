import { getBaseUrl } from "@/lib/constants";
import { type domainManifestSchema } from "@farcaster/frame-sdk";
import { type z } from "zod";

type Manifest = z.input<typeof domainManifestSchema>;

const appUrl = getBaseUrl();

// Docs
// https://miniapps.farcaster.xyz/docs/guides/publishing#host-a-manifest-file
export const farcasterManifest: Manifest = {
  accountAssociation: {
    "header": "eyJmaWQiOjY3NDc5MiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDYyRTdhOGRCYjhEODUzOGUxY0RiNUQ4OTMwMzBCYjE2ZUEwMEIyRjIifQ",
    "payload": "eyJkb21haW4iOiJoeXBlcm1pbmkudmVyY2VsLmFwcCJ9",
    "signature": "c7fFm8wlNxqF8aL/MTFo76ad+/p9gzEeHeCPgq7djzMT+UvSTqPUjCjb32z/Z+CZjKRmMYSPJwaSoulvGvHdZxw="
  },
  frame: {
    version: "1",
    name: "Farcaster Mini App",
    homeUrl: `${appUrl}/farcaster`,
    iconUrl: `${appUrl}/icon.png`,
    splashImageUrl: `${appUrl}/splash.gif`,
    splashBackgroundColor: "#000000",
    // webhookUrl: "https://api.example.com/webhook/farcaster",
    subtitle: "Test your Farcaster mini app",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    screenshotUrls: [
      `${appUrl}/screen-home.png`,
      `${appUrl}/screen-club.png`,
      `${appUrl}/screen-animation.png`,
    ],
    // primaryCategory: "",
    // tags: [],
    heroImageUrl: `${appUrl}/hero.png`,
    tagline: "Test your Farcaster mini app",
    ogTitle: "Farcaster Mini App Example",
    ogDescription:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt",
    ogImageUrl: `${appUrl}/og-image.png`,
    noindex: false,
    // requiredChains: [],
    // requiredCapabilities: [
    // "wallet.getEthereumProvider",
    // "wallet.getSolanaProvider",
    // "actions.ready",
    // "actions.openUrl",
    // "actions.close",
    // "actions.setPrimaryButton",
    // "actions.addMiniApp",
    // "actions.signIn",
    // "actions.viewCast",
    // "actions.viewProfile",
    // "actions.composeCast",
    // "actions.viewToken",
    // "actions.sendToken",
    // "actions.swapToken",
    // "haptics.impactOccurred",
    // "haptics.notificationOccurred",
    // "haptics.selectionChanged",
    // "back",
    // ],
    // castShareUrl
  },
};
