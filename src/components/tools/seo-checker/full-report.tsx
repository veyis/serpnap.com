"use client";

import { useState } from "react";
import {
  BarChart3,
  AlertTriangle,
  FileText,
  Wrench,
  Accessibility,
} from "lucide-react";
import type { SEOCheckResult } from "@/schemas/seo-checker";
import { ReportSectionGroup } from "./report-section-group";
import { ActionBar } from "./action-bar";
import { SERPPreview } from "./serp-preview";
import { ContentMetricsSection } from "./content-metrics-section";
import { IssuesAccordion } from "./issues-accordion";
import { LighthouseEstimationSection } from "./lighthouse-section";
import { AIFixGenerator } from "./ai-fix-generator";
import { PerformanceHintsSection } from "./performance-hints-section";
import { KeywordAnalysisSection } from "./keyword-analysis-section";
import { ChecksPassedCounter } from "./checks-passed-counter";
import { EEATSignalsSection } from "./eeat-signals-section";
import { TopRecommendations } from "./top-recommendations";
import { ServiceCTA } from "./service-cta";
import { GradeBadge } from "./grade-badge";
import { HeadingHierarchySection } from "./heading-hierarchy-section";
import { URLAnalysisSection } from "./url-analysis-section";
import { AccessibilitySection } from "./accessibility-section";
import { BrokenLinksSection } from "./broken-links-section";
import { ContrastSection } from "./contrast-section";
import { InternalLinksSection } from "./internal-links-section";
import { WaterfallSection } from "./waterfall-section";
import { ShareModal } from "./share-modal";
import { ReferencesSummarySection } from "./references-summary-section";

// ============================================================================
// Full Report (sections below score hero)
// ============================================================================

export function FullReport({
  result,
  url,
  onReset,
}: {
  result: SEOCheckResult;
  url: string;
  onReset: () => void;
}) {
  const [showShareModal, setShowShareModal] = useState(false);

  const issueCount = (() => {
    let errors = 0;
    let warnings = 0;
    for (const cat of Object.values(result.categories)) {
      if (!cat) continue;
      for (const issue of cat.issues) {
        if (issue.type === "error") errors++;
        else if (issue.type === "warning") warnings++;
      }
    }
    return { errors, warnings, total: errors + warnings };
  })();

  return (
    <>
      <div className="space-y-5 mt-6">
        {/* Action Bar */}
        <ActionBar
          result={result}
          onReset={onReset}
          onShare={() => setShowShareModal(true)}
        />

        {/* Group 1: Overview — always expanded */}
        <ReportSectionGroup
          icon={BarChart3}
          iconColor="bg-warning/10 text-warning"
          title="Overview"
          description="Score breakdown, SERP preview, and Lighthouse estimation"
          defaultExpanded
        >
          <div className="space-y-4">
            <ReferencesSummarySection categories={result.categories} />
            {result.grade && (
              <GradeBadge grade={result.grade} score={result.overallScore} />
            )}
            {result.pagePreview && (
              <SERPPreview
                title={result.pagePreview.title}
                description={result.pagePreview.description}
                url={result.pagePreview.url || url}
                favicon={result.pagePreview.favicon}
              />
            )}
            {result.lighthouseEstimation && (
              <LighthouseEstimationSection data={result.lighthouseEstimation} />
            )}
            <ChecksPassedCounter result={result} />
          </div>
        </ReportSectionGroup>

        {/* Group 2: Issues & Fixes — expanded if there are issues */}
        <ReportSectionGroup
          icon={AlertTriangle}
          iconColor="bg-destructive/10 text-destructive"
          title="Issues & Fixes"
          description="Errors, warnings, and AI-powered fix suggestions"
          badge={issueCount.total > 0 ? `${issueCount.total} issues` : undefined}
          defaultExpanded={issueCount.total > 0}
        >
          <div className="space-y-4">
            <IssuesAccordion categories={result.categories} />
            <AIFixGenerator result={result} />
            <TopRecommendations recommendations={result.recommendations} />
          </div>
        </ReportSectionGroup>

        {/* Group 3: Content Analysis — collapsed */}
        <ReportSectionGroup
          icon={FileText}
          iconColor="bg-success/10 text-success"
          title="Content Analysis"
          description="Headings, readability, keywords, and E-E-A-T signals"
        >
          <div className="space-y-4">
            {result.headingHierarchy && result.headingHierarchy.length > 0 && (
              <HeadingHierarchySection headings={result.headingHierarchy} />
            )}
            {result.contentMetrics && (
              <ContentMetricsSection
                metrics={result.contentMetrics}
                readability={result.readability}
                contentToCodeRatio={result.contentToCodeRatio}
              />
            )}
            <KeywordAnalysisSection result={result} />
            {result.eeatData && <EEATSignalsSection eeatData={result.eeatData} />}
          </div>
        </ReportSectionGroup>

        {/* Group 4: Technical Deep Dive — collapsed */}
        <ReportSectionGroup
          icon={Wrench}
          iconColor="bg-primary/10 text-primary"
          title="Technical Deep Dive"
          description="URL analysis, performance, resources, and link health"
        >
          <div className="space-y-4">
            {result.urlAnalysis && (
              <URLAnalysisSection urlAnalysis={result.urlAnalysis} url={url} />
            )}
            {result.performanceHints && (
              <PerformanceHintsSection
                hints={result.performanceHints}
                loadTime={result.loadTime}
              />
            )}
            {result.waterfallAnalysis && (
              <WaterfallSection data={result.waterfallAnalysis} />
            )}
            {result.brokenLinkAnalysis && (
              <BrokenLinksSection data={result.brokenLinkAnalysis} />
            )}
            {result.internalLinkStructure && (
              <InternalLinksSection data={result.internalLinkStructure} />
            )}
          </div>
        </ReportSectionGroup>

        {/* Group 5: Accessibility — collapsed */}
        <ReportSectionGroup
          icon={Accessibility}
          iconColor="bg-primary/10 text-primary"
          title="Accessibility"
          description="WCAG compliance, color contrast, and ARIA checks"
        >
          <div className="space-y-4">
            {result.accessibility && (
              <AccessibilitySection accessibility={result.accessibility} />
            )}
            {result.contrastAnalysis && (
              <ContrastSection data={result.contrastAnalysis} />
            )}
          </div>
        </ReportSectionGroup>

        {/* Group 6: Get Help — always flat (no collapsible wrapper) */}
        <ServiceCTA categories={result.categories} />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal result={result} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
}
