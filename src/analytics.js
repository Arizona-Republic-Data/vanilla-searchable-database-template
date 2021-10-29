/**
 * Track custom events.
 */
export function trackEvent(ga, dbName, action, label) {
  if (!ga) {
    // Analytics library not present. Do nothing.
    return;
  }

  ga("send", "event", "database", action, label, {
    dimension1: "custom",
    // Site Code
    dimension28: "PPHX",
    // Page Type
    dimension30: "data",
    // Content SSTS Section
    dimension61: "news",
    // Content SSTS Subsection
    dimension62: "local",
    // Content SSTS Topic
    dimension63: "arizona-data",
    // Content SSTS Subtopic
    dimension64: "null",
    // Publisher Region
    dimension67: "west",
    // Publisher State
    dimension68: "AZ",
    dimension92: `database|${action}`,
    // Market Name
    dimension95: "Phoenix AZ",
    // Legacy Company Flag
    dimension99: "Gannett",
    dimension153: dbName,
    // Market Tier
    dimension162: "1",
  });
}
