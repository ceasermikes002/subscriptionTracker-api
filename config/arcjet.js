import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import process from "process";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "POSTMAN"
      ],
    }),
    // More restrictive rate limit configuration
    tokenBucket({
      mode: "LIVE",
      refillRate: 2, // Only refill 2 tokens per interval
      interval: "10s", // Every 10 seconds
      capacity: 5, // Maximum of 5 tokens
    }),
  ],
});

export default aj;
