"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { CalculatorConfig, CalculatorField, CalculatorResult } from "@/lib/docs/tools/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Calculator, RotateCcw, TrendingUp, Info, Share2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CalculatorProps {
  config: CalculatorConfig;
  className?: string;
}

export function CalculatorTool({ config, className }: CalculatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params or defaults
  const [values, setValues] = React.useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    config.fields.forEach((field) => {
      const param = searchParams.get(`${config.id}-${field.id}`);
      initial[field.id] = param ? parseFloat(param) : (field.defaultValue ?? 0);
    });
    return initial;
  });

  const [results, setResults] = React.useState<Record<string, number> | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [calculationError, setCalculationError] = React.useState<string | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  // Sync values to URL params (debounced)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      let hasChanges = false;

      config.fields.forEach((field) => {
        const value = values[field.id] ?? 0;
        const defaultValue = field.defaultValue ?? 0;
        const paramKey = `${config.id}-${field.id}`;

        if (value === 0 || value === defaultValue) {
          if (params.has(paramKey)) {
            params.delete(paramKey);
            hasChanges = true;
          }
        } else {
          const currentParam = params.get(paramKey);
          if (currentParam !== value.toString()) {
            params.set(paramKey, value.toString());
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [values, config.id, config.fields, searchParams, router]);



  // Validate field
  const validateField = React.useCallback((field: CalculatorField, value: number): string | null => {
    // Check for NaN or Infinity first
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      if (field.required) {
        return `${field.label} is required`;
      }
      // Non-required fields can be empty (0 or NaN)
      return null;
    }
    // For required fields, 0 might be valid if min is 0 or undefined
    if (field.required && value === 0 && field.min !== undefined && field.min > 0) {
      return `${field.label} is required`;
    }
    if (field.min !== undefined && value < field.min) {
      return `${field.label} must be at least ${field.min}`;
    }
    if (field.max !== undefined && value > field.max) {
      return `${field.label} must be at most ${field.max}`;
    }
    return null;
  }, []);

  // Perform calculation with error handling
  const performCalculation = React.useCallback(() => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    config.fields.forEach((field) => {
      const value = values[field.id] ?? 0;
      // Skip validation for empty non-required fields
      if (!field.required && (value === 0 || Number.isNaN(value) || !Number.isFinite(value))) {
        return;
      }
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResults(null);
      setCalculationError(null);
      return;
    }

    // Calculate results with error handling
    setIsCalculating(true);
    setCalculationError(null);

    try {
      const calculated = config.formula(values);

      // Validate that all expected results are present
      const resultIds = new Set(config.results.map((r) => r.id));
      const calculatedIds = new Set(Object.keys(calculated));

      const missingResults = Array.from(resultIds).filter((id) => !calculatedIds.has(id));
      if (missingResults.length > 0) {
        throw new Error(`Formula did not return results for: ${missingResults.join(", ")}`);
      }

      // Validate results are numbers
      for (const [key, value] of Object.entries(calculated)) {
        if (!Number.isFinite(value)) {
          throw new Error(`Invalid result for ${key}: ${value}`);
        }
      }

      setResults(calculated);
      setCalculationError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Calculation failed";
      setCalculationError(message);
      setResults(null);
      console.error("Calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [values, config, validateField]);

  // Trigger real-time calculation
  React.useEffect(() => {
    if (config.realTime) {
      performCalculation();
    }
  }, [values, config.realTime, performCalculation]);

  // Handle field change
  const handleChange = (fieldId: string, value: string) => {
    // Handle empty string as 0, but preserve NaN for validation
    const numValue = value === "" || value === "-" ? 0 : parseFloat(value);
    const finalValue = Number.isNaN(numValue) ? 0 : numValue;
    setValues((prev) => ({ ...prev, [fieldId]: finalValue }));

    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  // Calculate results (manual trigger)
  const handleCalculate = () => {
    performCalculation();
  };

  // Reset calculator
  const handleReset = () => {
    const initial: Record<string, number> = {};
    config.fields.forEach((field) => {
      initial[field.id] = field.defaultValue ?? 0;
    });
    setValues(initial);
    setResults(null);
    setErrors({});
    setCalculationError(null);

    // Clear URL params
    const params = new URLSearchParams(searchParams.toString());
    config.fields.forEach((field) => {
      params.delete(`${config.id}-${field.id}`);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Share results
  const handleShare = async () => {
    if (!results) return;

    const params = new URLSearchParams();
    config.fields.forEach((field) => {
      const value = values[field.id];
      if (value !== 0 && value !== (field.defaultValue ?? 0)) {
        params.set(`${config.id}-${field.id}`, value.toString());
      }
    });

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${config.title} Results`,
          text: `Check out my ${config.title} results!`,
          url,
        });
        toast.success("Results shared successfully!");
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share results");
      }
    }
  };

  // Export results
  const handleExport = () => {
    if (!results) return;

    const exportData = {
      calculator: config.title,
      timestamp: new Date().toISOString(),
      inputs: Object.fromEntries(
        config.fields.map((field) => [
          field.label,
          values[field.id] ?? field.defaultValue ?? 0,
        ])
      ),
      results: Object.fromEntries(
        config.results.map((result) => [
          result.label,
          results[result.id] ?? 0,
        ])
      ),
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.id}-results-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Results exported successfully!");
  };

  // Format field value for display
  const formatFieldValue = (field: CalculatorField, value: number): string => {
    // Always return raw number string for type="number" inputs to avoid browser validation issues
    // (e.g., commas in currency format cause input to be cleared)
    return value.toString();
  };

  // Format result value
  const formatResult = (result: CalculatorResult, value: number): string => {
    switch (result.format) {
      case "currency":
        return formatCurrency(value, "USD", false);
      case "percentage":
        return `${value.toFixed(2)}%`;
      case "integer":
        return Math.round(value).toLocaleString();
      case "number":
        return value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      default:
        return value.toLocaleString();
    }
  };

  return (
    <Card className={cn("my-8 border-border/40 bg-foreground/2", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-foreground/60" />
          {config.title}
        </CardTitle>
        {config.description && (
          <CardDescription>{config.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((field) => {
            const value = values[field.id] ?? 0;
            const error = errors[field.id];
            // Show empty string if value is 0 or NaN, otherwise format it
            const displayValue = (value === 0 || Number.isNaN(value) || !Number.isFinite(value))
              ? ""
              : formatFieldValue(field, value);

            return (
              <div key={field.id} className="space-y-1.5">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-foreground/80 flex items-center gap-1.5"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-destructive text-xs">*</span>
                  )}
                </label>
                <div className="relative">
                  {field.prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">
                      {field.prefix}
                    </span>
                  )}
                  <Input
                    id={field.id}
                    type="number"
                    value={displayValue}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step ?? (field.type === "percentage" ? 0.1 : 1)}
                    className={cn(
                      field.prefix && "pl-8",
                      field.suffix && "pr-8",
                      error && "border-destructive"
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-help` : undefined}
                  />
                  {field.suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">
                      {field.suffix}
                    </span>
                  )}
                </div>
                {error && (
                  <p id={`${field.id}-error`} className="text-xs text-destructive">
                    {error}
                  </p>
                )}
                {!error && field.helpText && (
                  <p id={`${field.id}-help`} className="text-xs text-foreground/40 flex items-start gap-1">
                    <Info className="h-3 w-3 mt-0.5 shrink-0" />
                    {field.helpText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Calculation Error */}
        {calculationError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            <div className="font-medium mb-1">Calculation Error</div>
            <div>{calculationError}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!config.realTime && (
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1 sm:flex-initial"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  {config.calculateLabel || "Calculate"}
                </>
              )}
            </Button>
          )}
          {results && (
            <>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                <Share2 className="h-4 w-4" />
                Share
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
            </>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 sm:flex-initial"
          >
            <RotateCcw className="h-4 w-4" />
            {config.resetLabel || "Reset"}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-6 pt-6 border-t border-border/40 space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
              Results
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {config.results.map((result) => {
                const value = results[result.id] ?? 0;
                return (
                  <div
                    key={result.id}
                    className={cn(
                      "rounded-lg border border-border/40 p-4 transition-colors",
                      result.highlight
                        ? "bg-primary/5 border-primary/20"
                        : "bg-foreground/2"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground/70">
                        {result.label}
                      </span>
                      <span
                        className={cn(
                          "text-lg font-semibold",
                          result.highlight
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {formatResult(result, value)}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-xs text-foreground/40 mt-1.5">
                        {result.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
