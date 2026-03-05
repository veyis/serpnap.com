/**
 * Interactive Tools System for Documentation
 * 
 * Provides a type-safe, extensible system for embedding interactive
 * calculators, checklists, and other tools within documentation.
 */

export type ToolType = "calculator" | "checklist";

export interface ToolConfig {
  id: string;
  type: ToolType;
  title: string;
  description?: string;
}

// ============================================================================
// Calculator Types
// ============================================================================

export interface CalculatorField {
  id: string;
  label: string;
  type: "number" | "currency" | "percentage" | "integer";
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
  prefix?: string;
  suffix?: string;
}

export interface CalculatorResult {
  id: string;
  label: string;
  value?: number; // Optional - calculated at runtime by formula
  format?: "currency" | "percentage" | "number" | "integer";
  description?: string;
  highlight?: boolean;
}

export interface CalculatorConfig extends ToolConfig {
  type: "calculator";
  fields: CalculatorField[];
  results: CalculatorResult[];
  formula: (values: Record<string, number>) => Record<string, number>;
  resetLabel?: string;
  calculateLabel?: string;
  realTime?: boolean; // Enable real-time calculation as user types
  exportEnabled?: boolean; // Enable export functionality (CSV/JSON)
}

// ============================================================================
// Checklist Types
// ============================================================================

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  required?: boolean;
}

export interface ChecklistConfig extends ToolConfig {
  type: "checklist";
  items: ChecklistItem[];
  showProgress?: boolean;
  showCategories?: boolean;
  allowPartialSave?: boolean;
  resetLabel?: string;
  saveLabel?: string;
  exportEnabled?: boolean; // Enable export functionality (PDF/CSV)
}

// ============================================================================
// Tool Registry
// ============================================================================

export type ToolDefinition = CalculatorConfig | ChecklistConfig;

export interface ToolRegistry {
  [toolId: string]: ToolDefinition;
}
