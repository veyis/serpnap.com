'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Building2,
  Gauge,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { TechnicalAuditData, StatusLevel } from '@/lib/data/audit-report-types';
import { defaultAuditData } from '@/lib/data/audit-report-types';

type Step = 'client' | 'performance' | 'leads' | 'competition' | 'review';

const STEPS: { id: Step; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'client', label: 'Client Info', icon: Building2 },
  { id: 'performance', label: 'Performance', icon: Gauge },
  { id: 'leads', label: 'Lead Response', icon: Clock },
  { id: 'competition', label: 'Competition', icon: Users },
  { id: 'review', label: 'Review & Export', icon: FileText },
];

const STATUS_OPTIONS: { value: StatusLevel; label: string; color: string }[] = [
  { value: 'red', label: 'Critical', color: 'bg-red-500' },
  { value: 'yellow', label: 'Warning', color: 'bg-yellow-500' },
  { value: 'green', label: 'Good', color: 'bg-green-500' },
];

function StatusSelect({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: StatusLevel;
  onChange: (value: StatusLevel) => void;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="flex gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-[color,background-color]',
              'border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              value === option.value
                ? cn(option.color, 'text-white border-transparent')
                : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  description,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full h-11 rounded-lg border border-border bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring',
            'placeholder:text-muted-foreground/60',
            prefix ? 'pl-8 pr-4' : 'px-4',
            suffix && 'pr-12'
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TechnicalAuditReport() {
  const [currentStep, setCurrentStep] = useState<Step>('client');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<TechnicalAuditData>({
    practiceName: '',
    practiceUrl: '',
    contactName: '',
    city: '',
    state: '',
    industry: 'dental',
    estimatedLostRevenue: 85000,
    speedLatencyStatus: 'red',
    leadResponseStatus: 'red',
    conversionArchitectureStatus: 'yellow',
    performance: defaultAuditData.performance!,
    leadAnalysis: {
      ...defaultAuditData.leadAnalysis!,
      city: '',
    },
    competition: {
      clientProfile: {
        name: '',
        reviewCount: 48,
        averageRating: 4.3,
        hasAIResponses: false,
        lsaOptimized: false,
        monthlyPosts: 2,
      },
      topCompetitor: {
        name: '',
        reviewCount: 142,
        averageRating: 4.8,
        hasAIResponses: true,
        lsaOptimized: true,
        monthlyPosts: 8,
      },
      marketShare: 15,
      rankingPosition: 4,
    },
    reportDate: new Date().toISOString().split('T')[0],
    preparedBy: 'SERPNAP Technical Analysis Team',
  });

  const updateFormData = useCallback(
    <K extends keyof TechnicalAuditData>(key: K, value: TechnicalAuditData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updatePerformance = useCallback(
    <K extends keyof TechnicalAuditData['performance']>(
      key: K,
      value: TechnicalAuditData['performance'][K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        performance: { ...prev.performance, [key]: value },
      }));
    },
    []
  );

  const updateLeadAnalysis = useCallback(
    <K extends keyof TechnicalAuditData['leadAnalysis']>(
      key: K,
      value: TechnicalAuditData['leadAnalysis'][K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        leadAnalysis: { ...prev.leadAnalysis, [key]: value },
      }));
    },
    []
  );

  const updateClientProfile = useCallback(
    <K extends keyof TechnicalAuditData['competition']['clientProfile']>(
      key: K,
      value: TechnicalAuditData['competition']['clientProfile'][K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        competition: {
          ...prev.competition,
          clientProfile: { ...prev.competition.clientProfile, [key]: value },
        },
      }));
    },
    []
  );

  const updateCompetitorProfile = useCallback(
    <K extends keyof TechnicalAuditData['competition']['topCompetitor']>(
      key: K,
      value: TechnicalAuditData['competition']['topCompetitor'][K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        competition: {
          ...prev.competition,
          topCompetitor: { ...prev.competition.topCompetitor, [key]: value },
        },
      }));
    },
    []
  );

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleGeneratePDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Update city in lead analysis before generating
      const finalData = {
        ...formData,
        leadAnalysis: {
          ...formData.leadAnalysis,
          city: formData.leadAnalysis.city || formData.city,
        },
        competition: {
          ...formData.competition,
          clientProfile: {
            ...formData.competition.clientProfile,
            name: formData.competition.clientProfile.name || formData.practiceName,
          },
        },
      };
      const { generateTechnicalAuditPDF } = await import('@/lib/utils/audit-pdf-generator');
      await generateTechnicalAuditPDF(finalData);
    } finally {
      setIsGenerating(false);
    }
  }, [formData]);

  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 'client':
        return formData.practiceName && formData.contactName && formData.city && formData.state;
      case 'performance':
        return formData.performance.mobileScore >= 0;
      case 'leads':
        return formData.leadAnalysis.averageResponseTime > 0;
      case 'competition':
        return formData.competition.topCompetitor.name;
      default:
        return true;
    }
  }, [currentStep, formData]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-lg shadow-black/5">
        <div className="p-6 sm:p-8 bg-linear-to-r from-zinc-900 to-zinc-800 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6" />
            <h2 className="text-[20px] sm:text-[24px] font-bold">Technical Audit Report Generator</h2>
          </div>
          <p className="text-white/70 text-sm sm:text-base">
            Generate a clinical diagnostic report that closes high-ticket clients. Not marketing fluff - a technical MRI.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="border-b border-border/50 px-6 sm:px-8 py-4 bg-muted/30">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = index < currentStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 transition-colors',
                    isActive
                      ? 'text-foreground'
                      : isComplete
                        ? 'text-emerald-600'
                        : 'text-muted-foreground/50'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                      isActive
                        ? 'bg-foreground text-background'
                        : isComplete
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-muted/50'
                    )}
                  >
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-medium hidden sm:block">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8">
          {/* Step 1: Client Info */}
          {currentStep === 'client' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Enter the client&apos;s information. This data will appear on the first page of the confidential diagnostic report.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Practice Name"
                  value={formData.practiceName}
                  onChange={(v) => updateFormData('practiceName', v)}
                  placeholder="Smith Dental Associates"
                />
                <InputField
                  label="Practice Website"
                  value={formData.practiceUrl}
                  onChange={(v) => updateFormData('practiceUrl', v)}
                  type="url"
                  placeholder="https://smithdental.com"
                />
              </div>

              <InputField
                label="Contact Name"
                value={formData.contactName}
                onChange={(v) => updateFormData('contactName', v)}
                placeholder="Dr. John Smith"
                description="The name of the decision maker receiving this report"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="City"
                  value={formData.city}
                  onChange={(v) => updateFormData('city', v)}
                  placeholder="Austin"
                />
                <InputField
                  label="State"
                  value={formData.state}
                  onChange={(v) => updateFormData('state', v)}
                  placeholder="TX"
                />
              </div>

              <SelectField
                label="Industry"
                value={formData.industry}
                onChange={(v) => updateFormData('industry', v as TechnicalAuditData['industry'])}
                options={[
                  { value: 'dental', label: 'Dental Practice' },
                  { value: 'medical', label: 'Medical Practice' },
                  { value: 'contractor', label: 'Contractor / Home Services' },
                  { value: 'legal', label: 'Law Firm' },
                  { value: 'restaurant', label: 'Restaurant' },
                  { value: 'other', label: 'Other' },
                ]}
              />

              <InputField
                label="Estimated Lost Annual Revenue"
                value={formData.estimatedLostRevenue}
                onChange={(v) => updateFormData('estimatedLostRevenue', parseInt(v) || 0)}
                type="number"
                prefix="$"
                description="The headline number - how much revenue they're losing due to infrastructure issues"
                min={0}
                step={5000}
              />

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-4">Executive Status Overview</h3>
                <div className="space-y-4">
                  <StatusSelect
                    label="Speed/Latency Status"
                    value={formData.speedLatencyStatus}
                    onChange={(v) => updateFormData('speedLatencyStatus', v)}
                    description="Website and mobile performance"
                  />
                  <StatusSelect
                    label="Lead Response Status"
                    value={formData.leadResponseStatus}
                    onChange={(v) => updateFormData('leadResponseStatus', v)}
                    description="Speed to lead and automation"
                  />
                  <StatusSelect
                    label="Conversion Architecture Status"
                    value={formData.conversionArchitectureStatus}
                    onChange={(v) => updateFormData('conversionArchitectureStatus', v)}
                    description="Funnel optimization and CRO"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Performance */}
          {currentStep === 'performance' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Enter data from PageSpeed Insights or your own analysis. This creates the &quot;LCP Death Spiral&quot; page that proves technical failure.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Mobile Score"
                  value={formData.performance.mobileScore}
                  onChange={(v) => updatePerformance('mobileScore', parseInt(v) || 0)}
                  type="number"
                  min={0}
                  max={100}
                  description="PageSpeed mobile score (0-100)"
                />
                <InputField
                  label="Desktop Score"
                  value={formData.performance.desktopScore}
                  onChange={(v) => updatePerformance('desktopScore', parseInt(v) || 0)}
                  type="number"
                  min={0}
                  max={100}
                  description="PageSpeed desktop score (0-100)"
                />
              </div>

              <h3 className="text-sm font-semibold text-foreground pt-4 border-t border-border/50">
                Core Web Vitals
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="LCP (Largest Contentful Paint)"
                  value={formData.performance.lcpTime}
                  onChange={(v) => updatePerformance('lcpTime', parseFloat(v) || 0)}
                  type="number"
                  step={0.1}
                  suffix="sec"
                  description="Target: < 2.5s (Good: green, Needs improvement: 2.5-4s, Poor: > 4s)"
                />
                <InputField
                  label="FID (First Input Delay)"
                  value={formData.performance.fid}
                  onChange={(v) => updatePerformance('fid', parseInt(v) || 0)}
                  type="number"
                  suffix="ms"
                  description="Target: < 100ms"
                />
                <InputField
                  label="CLS (Cumulative Layout Shift)"
                  value={formData.performance.cls}
                  onChange={(v) => updatePerformance('cls', parseFloat(v) || 0)}
                  type="number"
                  step={0.01}
                  description="Target: < 0.1"
                />
                <InputField
                  label="TTFB (Time to First Byte)"
                  value={formData.performance.ttfb}
                  onChange={(v) => updatePerformance('ttfb', parseInt(v) || 0)}
                  type="number"
                  suffix="ms"
                  description="Target: < 800ms"
                />
              </div>

              <h3 className="text-sm font-semibold text-foreground pt-4 border-t border-border/50">
                Impact Calculations
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Estimated Bounce Rate"
                  value={formData.performance.bounceRate}
                  onChange={(v) => updatePerformance('bounceRate', parseInt(v) || 0)}
                  type="number"
                  suffix="%"
                  min={0}
                  max={100}
                  description="% of visitors who leave before interacting"
                />
                <InputField
                  label="Technical Tax"
                  value={formData.performance.technicalTax}
                  onChange={(v) => updatePerformance('technicalTax', parseInt(v) || 0)}
                  type="number"
                  suffix="%"
                  min={0}
                  max={100}
                  description="% of ad spend wasted due to poor performance"
                />
              </div>
            </div>
          )}

          {/* Step 3: Lead Response */}
          {currentStep === 'leads' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  This creates the &quot;Ghost Lead Analysis&quot; - a timeline showing how leads go cold. The &quot;7 minute half-life&quot; stat is devastating.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Market City (for half-life stat)"
                  value={formData.leadAnalysis.city}
                  onChange={(v) => updateLeadAnalysis('city', v)}
                  placeholder={formData.city || 'Austin'}
                  description="Leave blank to use client's city"
                />
                <InputField
                  label="Lead Intent Half-Life"
                  value={formData.leadAnalysis.leadHalfLife}
                  onChange={(v) => updateLeadAnalysis('leadHalfLife', parseInt(v) || 7)}
                  type="number"
                  suffix="min"
                  description="Industry standard is ~7 minutes"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Current Response System"
                  value={formData.leadAnalysis.currentResponseSystem}
                  onChange={(v) => updateLeadAnalysis('currentResponseSystem', v)}
                  placeholder="Manual Processing"
                  description="e.g., 'Manual Processing', 'Email only', 'No system'"
                />
                <InputField
                  label="Average Response Time"
                  value={formData.leadAnalysis.averageResponseTime}
                  onChange={(v) => updateLeadAnalysis('averageResponseTime', parseInt(v) || 60)}
                  type="number"
                  suffix="min"
                  description="How long it takes to respond to a lead"
                />
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <h4 className="text-sm font-medium text-foreground mb-3">Timeline Preview</h4>
                <div className="space-y-3">
                  {formData.leadAnalysis.timeline.map((event, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full shrink-0',
                          event.status === 'success'
                            ? 'bg-green-500'
                            : event.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        )}
                      />
                      <span className="text-sm font-medium text-foreground w-20">{event.time}</span>
                      <span className="text-sm text-muted-foreground">{event.event}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Timeline is pre-configured to show lead decay. Adjust response time above to change impact.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Competition */}
          {currentStep === 'competition' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900">
                <Users className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <p className="text-sm text-violet-800 dark:text-violet-200">
                  The &quot;ego hit&quot; page. Compare their Google Business Profile to their top competitor. This shows they&apos;re being &quot;out-programmed&quot;.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Client Profile */}
                <div className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50">
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-4">
                    Their Practice
                  </h4>
                  <div className="space-y-3">
                    <InputField
                      label="Reviews Count"
                      value={formData.competition.clientProfile.reviewCount}
                      onChange={(v) => updateClientProfile('reviewCount', parseInt(v) || 0)}
                      type="number"
                    />
                    <InputField
                      label="Average Rating"
                      value={formData.competition.clientProfile.averageRating}
                      onChange={(v) => updateClientProfile('averageRating', parseFloat(v) || 0)}
                      type="number"
                      step={0.1}
                      min={1}
                      max={5}
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="client-ai"
                        checked={formData.competition.clientProfile.hasAIResponses}
                        onChange={(e) => updateClientProfile('hasAIResponses', e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="client-ai" className="text-sm text-foreground">
                        Has AI Responses
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="client-lsa"
                        checked={formData.competition.clientProfile.lsaOptimized}
                        onChange={(e) => updateClientProfile('lsaOptimized', e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="client-lsa" className="text-sm text-foreground">
                        LSA Optimized
                      </label>
                    </div>
                  </div>
                </div>

                {/* Competitor Profile */}
                <div className="p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50">
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-4">
                    Top Competitor
                  </h4>
                  <div className="space-y-3">
                    <InputField
                      label="Competitor Name"
                      value={formData.competition.topCompetitor.name}
                      onChange={(v) => updateCompetitorProfile('name', v)}
                      placeholder="Competitor X"
                    />
                    <InputField
                      label="Reviews Count"
                      value={formData.competition.topCompetitor.reviewCount}
                      onChange={(v) => updateCompetitorProfile('reviewCount', parseInt(v) || 0)}
                      type="number"
                    />
                    <InputField
                      label="Average Rating"
                      value={formData.competition.topCompetitor.averageRating}
                      onChange={(v) => updateCompetitorProfile('averageRating', parseFloat(v) || 0)}
                      type="number"
                      step={0.1}
                      min={1}
                      max={5}
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="comp-ai"
                        checked={formData.competition.topCompetitor.hasAIResponses}
                        onChange={(e) => updateCompetitorProfile('hasAIResponses', e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="comp-ai" className="text-sm text-foreground">
                        Has AI Responses
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="comp-lsa"
                        checked={formData.competition.topCompetitor.lsaOptimized}
                        onChange={(e) => updateCompetitorProfile('lsaOptimized', e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label htmlFor="comp-lsa" className="text-sm text-foreground">
                        LSA Optimized
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Review your data and generate the PDF. Remember: This is a technical autopsy, not a sales pitch.
                </p>
              </div>

              {/* Summary */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Client
                  </h4>
                  <p className="text-lg font-semibold text-foreground">{formData.practiceName || '—'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.city}, {formData.state}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                  <h4 className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2">
                    Lost Revenue
                  </h4>
                  <p className="text-2xl font-bold text-red-600">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                    }).format(formData.estimatedLostRevenue)}
                  </p>
                  <p className="text-sm text-red-600/70">Annually</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Mobile Score
                  </h4>
                  <p className="text-2xl font-bold text-foreground">
                    {formData.performance.mobileScore}/100
                  </p>
                  <p className="text-sm text-muted-foreground">
                    LCP: {formData.performance.lcpTime}s
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Response Time
                  </h4>
                  <p className="text-2xl font-bold text-foreground">
                    {formData.leadAnalysis.averageResponseTime} min
                  </p>
                  <p className="text-sm text-muted-foreground">
                    vs. 7 min half-life
                  </p>
                </div>
              </div>

              {/* Status Indicators Preview */}
              <div className="p-4 rounded-lg border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-3">Status Overview</h4>
                <div className="flex gap-3">
                  {[
                    { label: 'Speed', status: formData.speedLatencyStatus },
                    { label: 'Lead Response', status: formData.leadResponseStatus },
                    { label: 'Conversion', status: formData.conversionArchitectureStatus },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium text-white',
                        item.status === 'red' && 'bg-red-500',
                        item.status === 'yellow' && 'bg-yellow-500',
                        item.status === 'green' && 'bg-green-500'
                      )}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Date */}
              <InputField
                label="Report Date"
                value={formData.reportDate}
                onChange={(v) => updateFormData('reportDate', v)}
                type="text"
                placeholder="2024-01-15"
              />

              <InputField
                label="Prepared By"
                value={formData.preparedBy}
                onChange={(v) => updateFormData('preparedBy', v)}
                placeholder="SERPNAP Technical Analysis Team"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentStepIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep === 'review' ? (
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating || !formData.practiceName}
                className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                <Download className={cn('w-4 h-4', isGenerating && 'animate-pulse')} />
                {isGenerating ? 'Generating...' : 'Generate PDF Report'}
              </Button>
            ) : (
              <Button onClick={goNext} disabled={!isStepValid} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
