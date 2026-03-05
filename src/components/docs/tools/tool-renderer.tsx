"use client";

import * as React from "react";
import { CalculatorTool } from "./calculator";
import { ChecklistTool } from "./checklist";
import { toolRegistry } from "@/lib/docs/tools/registry";

interface ToolRendererProps {
  toolId: string;
  className?: string;
}

export function ToolRenderer({ toolId, className }: ToolRendererProps) {
  const tool = toolRegistry[toolId];

  if (!tool) {
    console.warn(`Tool "${toolId}" not found in registry`);
    return null;
  }

  switch (tool.type) {
    case "calculator":
      return <CalculatorTool config={tool} className={className} />;
    case "checklist":
      return <ChecklistTool config={tool} className={className} />;
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- exhaustive switch fallback
      console.warn(`Unknown tool type: ${(tool as any).type}`);
      return null;
  }
}
