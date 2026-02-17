export interface ChatConfig {
  /** Kapa React SDK integration ID */
  integrationId: string;
  /** DOM element ID for the "Ask AI" button (optional if containerId is provided) */
  buttonId?: string;
  /** DOM element ID for the inline chat container (optional if buttonId is provided) */
  containerId?: string;
}
