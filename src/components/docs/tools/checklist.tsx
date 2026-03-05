"use client";

import * as React from "react";
import { ChecklistConfig, ChecklistItem } from "@/lib/docs/tools/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, RotateCcw, Save, CheckCheck, Download } from "lucide-react";
import { toast } from "sonner";

interface ChecklistProps {
  config: ChecklistConfig;
  className?: string;
}

export function ChecklistTool({ config, className }: ChecklistProps) {
  const [checked, setChecked] = React.useState<Set<string>>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`checklist-${config.id}`);
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  // Save to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `checklist-${config.id}`,
        JSON.stringify(Array.from(checked))
      );
    }
  }, [config.id, checked]);

  // Toggle item
  const toggleItem = (itemId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Reset checklist
  const handleReset = () => {
    setChecked(new Set());
    toast.success("Checklist reset");
  };

  // Export checklist
  const handleExport = () => {
    const exportData = {
      checklist: config.title,
      timestamp: new Date().toISOString(),
      progress: {
        completed: checked.size,
        total: config.items.length,
        percentage: Math.round((checked.size / config.items.length) * 100),
      },
      items: config.items.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        category: item.category,
        required: item.required,
        completed: checked.has(item.id),
      })),
      completedItems: Array.from(checked),
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.id}-progress-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Checklist exported successfully!");
  };

  // Calculate progress
  const progress = config.items.length > 0
    ? (checked.size / config.items.length) * 100
    : 0;

  // Group items by category if enabled
  const groupedItems = config.showCategories
    ? config.items.reduce((acc, item) => {
        const category = item.category || "General";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {} as Record<string, ChecklistItem[]>)
    : { "": config.items };

  return (
    <Card className={cn("my-8 border-border/40 bg-foreground/5", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCheck className="h-5 w-5 text-foreground/60" />
              {config.title}
            </CardTitle>
            {config.description && (
              <CardDescription className="mt-1.5">
                {config.description}
              </CardDescription>
            )}
          </div>
          {config.showProgress && (
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">
                {checked.size}/{config.items.length}
              </div>
              <div className="text-xs text-foreground/40 mt-0.5">
                {Math.round(progress)}% complete
              </div>
            </div>
          )}
        </div>
        {config.showProgress && (
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-foreground/5 overflow-hidden">
              <div
                className="h-full bg-primary transition-[width] duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Checklist Items */}
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {config.showCategories && category && (
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                  {category}
                </h3>
              )}
              <div className="space-y-2">
                {items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-[border-color,background-color] cursor-pointer group",
                        isChecked
                          ? "bg-primary/5 border-primary/20"
                          : "bg-foreground/5 border-border/40 hover:border-border hover:bg-foreground/5"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(item.id)}
                        className="sr-only"
                        aria-label={item.label}
                      />
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-foreground/30 group-hover:text-foreground/50 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isChecked
                                ? "text-foreground/60 line-through"
                                : "text-foreground/80"
                            )}
                          >
                            {item.label}
                          </span>
                          {item.required && (
                            <span className="text-xs text-destructive">*</span>
                          )}
                        </div>
                        {item.description && (
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isChecked
                                ? "text-foreground/40"
                                : "text-foreground/50"
                            )}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/40">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 sm:flex-initial"
          >
            <RotateCcw className="h-4 w-4" />
            {config.resetLabel || "Reset"}
          </Button>
          {config.exportEnabled && (
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex-1 sm:flex-initial"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
          {config.allowPartialSave && (
            <Button variant="outline" className="flex-1 sm:flex-initial" disabled>
              <Save className="h-4 w-4" />
              {config.saveLabel || "Save Progress"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
