// lib/avatar.ts
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export function generateAvatar(seed: string, size = 128) {
  // createAvatar(...).toDataUri() is the correct modern method
  return createAvatar(adventurer, {
    seed,
    size,
    backgroundColor: ["b6a4ff"],
  }).toDataUri();
}
