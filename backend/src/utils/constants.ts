/**
 * Application-wide constants.
 * Centralise magic strings / enums here.
 */

export const ITEM_STATUS = {
  LOST: "lost",
  FOUND: "found",
  CLAIMED: "claimed",
  RETURNED: "returned",
} as const;

export type ItemStatusType = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];

export const ITEM_CATEGORIES: string[] = [
  "Electronics",
  "Documents",
  "Keys",
  "Wallet",
  "Clothing",
  "Bag",
  "Jewellery",
  "Other",
];
