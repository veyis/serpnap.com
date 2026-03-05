import type { SEOIssue } from "@/schemas/seo-checker";
import type { AnalysisContext } from "../types";

/**
 * Validate schema fields against Google's structured data requirements.
 * Required fields missing → error (score penalty), recommended → warning.
 * Only validates the first occurrence of each schema type.
 */
function validateSchemaFields(items: Record<string, unknown>[]): {
  issues: SEOIssue[];
  scorePenalty: number;
} {
  const issues: SEOIssue[] = [];
  let scorePenalty = 0;
  const validated = new Set<string>();

  for (const item of items) {
    const rawType = item["@type"];
    const types = Array.isArray(rawType)
      ? rawType.map(String)
      : rawType
        ? [String(rawType)]
        : [];

    for (const type of types) {
      if (validated.has(type)) continue;

      switch (type) {
        case "LocalBusiness": {
          validated.add(type);
          const required: string[] = [];
          if (!item.name) required.push("name");
          if (!item.address) required.push("address");
          if (required.length > 0) {
            issues.push({
              type: "error",
              category: "structured",
              message: `LocalBusiness missing required: ${required.join(", ")}`,
              fix: "Add name and address (streetAddress, addressLocality, postalCode) to LocalBusiness schema",
              impact: "high",
            });
            scorePenalty += 5;
          } else {
            // Validate address sub-fields
            const addr = item.address as Record<string, unknown> | undefined;
            if (addr && typeof addr === "object") {
              const sub: string[] = [];
              if (!addr.streetAddress) sub.push("streetAddress");
              if (!addr.addressLocality) sub.push("addressLocality");
              if (!addr.postalCode) sub.push("postalCode");
              if (sub.length > 0) {
                issues.push({
                  type: "warning",
                  category: "structured",
                  message: `LocalBusiness address incomplete: missing ${sub.join(", ")}`,
                  fix: "Include full address details for local search visibility",
                  impact: "medium",
                });
                scorePenalty += 2;
              }
            }
          }
          const rec: string[] = [];
          if (!item.telephone) rec.push("telephone");
          if (!item.image) rec.push("image");
          if (!item.url) rec.push("url");
          if (rec.length >= 2) {
            issues.push({
              type: "warning",
              category: "structured",
              message: `LocalBusiness missing recommended: ${rec.join(", ")}`,
              fix: "Add telephone, image, and url for better local search results",
              impact: "low",
            });
          }
          break;
        }

        case "Product": {
          validated.add(type);
          if (!item.name) {
            issues.push({
              type: "error",
              category: "structured",
              message: "Product schema missing required: name",
              fix: "Add a name property to your Product schema",
              impact: "high",
            });
            scorePenalty += 5;
          }
          if (!item.review && !item.aggregateRating && !item.offers) {
            issues.push({
              type: "error",
              category: "structured",
              message:
                "Product needs review, aggregateRating, or offers for rich results",
              fix: "Add at least one of: review, aggregateRating, or offers to enable product snippets",
              impact: "high",
            });
            scorePenalty += 5;
          }
          if (!item.image) {
            issues.push({
              type: "warning",
              category: "structured",
              message: "Product schema missing recommended: image",
              fix: "Add product image for better rich result display",
              impact: "medium",
            });
          }
          break;
        }

        case "BreadcrumbList": {
          validated.add(type);
          const els = item.itemListElement;
          if (Array.isArray(els) && els.length > 0) {
            const first = els[0] as Record<string, unknown>;
            if (first && typeof first === "object") {
              const fm: string[] = [];
              if (first.position == null) fm.push("position");
              if (!first.name) fm.push("name");
              if (fm.length > 0) {
                issues.push({
                  type: "warning",
                  category: "structured",
                  message: `BreadcrumbList items missing: ${fm.join(", ")}`,
                  fix: "Each ListItem needs position (number), name (text), and item (URL)",
                  impact: "medium",
                });
                scorePenalty += 2;
              }
            }
          }
          break;
        }

        case "WebSite": {
          validated.add(type);
          const rec: string[] = [];
          if (!item.name) rec.push("name");
          if (!item.url) rec.push("url");
          if (rec.length > 0) {
            issues.push({
              type: "warning",
              category: "structured",
              message: `WebSite schema missing recommended: ${rec.join(", ")}`,
              fix: "Add name and url to WebSite schema for site identification",
              impact: "medium",
            });
            scorePenalty += 2;
          }
          if (item.potentialAction) {
            issues.push({
              type: "warning",
              category: "structured",
              message:
                "WebSite potentialAction (sitelinks searchbox) deprecated since November 2024",
              fix: "Google removed the sitelinks search box globally. This markup is harmless but no longer generates rich results",
              impact: "low",
            });
          }
          break;
        }

        case "VideoObject": {
          validated.add(type);
          const required: string[] = [];
          if (!item.name) required.push("name");
          if (!item.thumbnailUrl) required.push("thumbnailUrl");
          if (!item.uploadDate) required.push("uploadDate");
          if (required.length > 0) {
            issues.push({
              type: "error",
              category: "structured",
              message: `VideoObject missing required: ${required.join(", ")}`,
              fix: "Add name, thumbnailUrl, and uploadDate for video rich results",
              impact: "high",
            });
            scorePenalty += 5;
          }
          if (!item.description) {
            issues.push({
              type: "warning",
              category: "structured",
              message: "VideoObject missing recommended: description",
              fix: "Add description for better video search display",
              impact: "low",
            });
          }
          break;
        }

        case "Article":
        case "BlogPosting":
        case "NewsArticle": {
          validated.add(type);
          // datePublished/dateModified already validated separately
          const rec: string[] = [];
          if (!item.headline) rec.push("headline");
          if (!item.image) rec.push("image");
          if (!item.author) {
            rec.push("author");
          } else if (
            typeof item.author === "object" &&
            !Array.isArray(item.author)
          ) {
            const author = item.author as Record<string, unknown>;
            if (!author.name) rec.push("author.name");
          }
          if (rec.length >= 2) {
            issues.push({
              type: "warning",
              category: "structured",
              message: `${type} missing recommended: ${rec.join(", ")}`,
              fix: `Add headline, image, and author (with name) for ${type.toLowerCase()} rich results`,
              impact: "medium",
            });
            scorePenalty += 2;
          }
          break;
        }

        case "Organization": {
          validated.add(type);
          const rec: string[] = [];
          if (!item.name) rec.push("name");
          if (!item.url) rec.push("url");
          if (!item.logo) rec.push("logo");
          if (rec.length >= 2) {
            issues.push({
              type: "warning",
              category: "structured",
              message: `Organization missing recommended: ${rec.join(", ")}`,
              fix: "Add name, url, and logo for brand identity in search results",
              impact: "medium",
            });
            scorePenalty += 2;
          }
          break;
        }

        case "HowTo": {
          validated.add(type);
          issues.push({
            type: "warning",
            category: "structured",
            message:
              "HowTo rich results deprecated (Google announced deprecation on September 13, 2023)",
            fix: "Google no longer shows HowTo rich results in Search. Existing HowTo markup is generally harmless, but don't treat it as an active rich result opportunity",
            impact: "low",
          });
          break;
        }
      }
    }
  }

  return { issues, scorePenalty: Math.min(scorePenalty, 15) };
}

export function analyzeStructured(ctx: AnalysisContext): {
  score: number;
  issues: SEOIssue[];
  schemaTypes: string[];
} {
  const issues: SEOIssue[] = [];
  let score = 100;
  const schemaTypes: string[] = [];
  let malformedJsonCount = 0;
  let malformedPenalty = 0;
  let validJsonCount = 0;
  const allParsedItems: Record<string, unknown>[] = [];

  const jsonLdPattern =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const jsonLdMatches = [...ctx.html.matchAll(jsonLdPattern)];

  if (jsonLdMatches.length === 0) {
    issues.push({
      type: "warning",
      category: "structured",
      message: "No JSON-LD structured data found (optional but recommended)",
      fix: "Add Schema.org markup for eligible rich results and clearer content semantics",
      impact: "low",
    });
    score = 80;
  } else {
    for (const match of jsonLdMatches) {
      try {
        const jsonContent = match[1].trim();
        if (!jsonContent) {
          malformedJsonCount++;
          continue;
        }
        const data = JSON.parse(jsonContent);
        validJsonCount++;
        // Flatten @graph arrays and top-level arrays
        const topItems = Array.isArray(data) ? data : [data];
        const items: Record<string, unknown>[] = [];
        for (const item of topItems) {
          items.push(item);
          // Traverse @graph arrays for nested schema types
          if (Array.isArray(item["@graph"])) {
            for (const graphItem of item["@graph"]) {
              if (graphItem && typeof graphItem === "object")
                items.push(graphItem as Record<string, unknown>);
            }
          }
        }
        allParsedItems.push(...items);
        for (const item of items) {
          if (item["@type"]) {
            const types = Array.isArray(item["@type"])
              ? item["@type"]
              : [item["@type"]];
            for (const t of types) {
              const type = String(t);
              if (!schemaTypes.includes(type)) schemaTypes.push(type);
            }
          }
          if (
            item["@context"] &&
            !JSON.stringify(item["@context"]).includes("schema.org")
          ) {
            issues.push({
              type: "warning",
              category: "structured",
              message: "JSON-LD @context doesn't reference schema.org",
              fix: 'Use @context: "https://schema.org" for proper validation',
              impact: "medium",
            });
            score -= 5;
          }
        }
      } catch (error) {
        malformedJsonCount++;
        let errorDetail = "Invalid JSON syntax";
        if (error instanceof SyntaxError) {
          const errorMsg = error.message;
          if (errorMsg.includes("position"))
            errorDetail = `JSON syntax error: ${errorMsg.split("at position")[0].trim()}`;
          else if (errorMsg.includes("token"))
            errorDetail = `JSON syntax error: ${errorMsg}`;
        }
        issues.push({
          type: "error",
          category: "structured",
          message: `Malformed JSON-LD detected: ${errorDetail}`,
          fix: "Fix JSON syntax errors - use a JSON validator to check your structured data",
          impact: "high",
        });
        malformedPenalty += 15;
      }
    }

    // Cap total malformed penalty to avoid tanking the score on pages with many blocks
    score -= Math.min(malformedPenalty, 30);

    if (validJsonCount > 0 && schemaTypes.length > 0) {
      issues.push({
        type: "success",
        category: "structured",
        message: `JSON-LD found: ${schemaTypes.slice(0, 3).join(", ")}${schemaTypes.length > 3 ? ` (+${schemaTypes.length - 3} more)` : ""}`,
      });
      const richSchemas = [
        "Organization",
        "WebSite",
        "FAQPage",
        "Article",
        "Product",
        "LocalBusiness",
        "BreadcrumbList",
        "HowTo",
        "Recipe",
        "Event",
      ];
      const foundRichSchemas = schemaTypes.filter((t) =>
        richSchemas.includes(t),
      );
      if (foundRichSchemas.length > 0) {
        issues.push({
          type: "success",
          category: "structured",
          message: `Rich snippet eligible: ${foundRichSchemas.join(", ")}`,
        });
        // Only award bonus if no malformed JSON-LD was found (don't recover past deductions)
        if (malformedJsonCount === 0) {
          score = Math.min(100, score + 5);
        }
      }
      const hasOrganization = schemaTypes.some(
        (t) => t === "Organization" || t === "LocalBusiness",
      );
      const hasWebSite = schemaTypes.includes("WebSite");
      if (!hasOrganization && !hasWebSite) {
        issues.push({
          type: "warning",
          category: "structured",
          message: "Consider adding Organization or WebSite schema",
          fix: "Add Organization schema for brand identity and WebSite schema for site-level entity context",
          impact: "low",
        });
      }
    } else if (validJsonCount > 0 && schemaTypes.length === 0) {
      issues.push({
        type: "warning",
        category: "structured",
        message: "JSON-LD present but no valid @type detected",
        fix: "Ensure your JSON-LD includes a valid @type property from Schema.org",
        impact: "medium",
      });
      score = Math.max(50, score - 20);
    }

    if (malformedJsonCount > 0 && validJsonCount > 0) {
      issues.push({
        type: "warning",
        category: "structured",
        message: `${malformedJsonCount} of ${jsonLdMatches.length} JSON-LD blocks have errors`,
        fix: "Fix or remove malformed JSON-LD scripts",
        impact: "medium",
      });
    }
  }

  const hasMicrodata = /itemscope|itemtype/i.test(ctx.html);
  if (hasMicrodata) {
    if (jsonLdMatches.length === 0) {
      issues.push({
        type: "success",
        category: "structured",
        message: "Microdata structured data detected",
      });
      score = Math.max(score, 70);
    } else {
      issues.push({
        type: "success",
        category: "structured",
        message: "Both JSON-LD and Microdata present",
      });
    }
  }

  const hasRdfa =
    /typeof=["'][^"']*schema\.org/i.test(ctx.html) ||
    /vocab=["'][^"']*schema\.org/i.test(ctx.html);
  if (hasRdfa && jsonLdMatches.length === 0 && !hasMicrodata) {
    issues.push({
      type: "success",
      category: "structured",
      message: "RDFa structured data detected",
    });
    score = Math.max(score, 65);
  }

  // BreadcrumbList schema detection
  const hasBreadcrumbSchema2 = schemaTypes.includes("BreadcrumbList");
  if (
    !hasBreadcrumbSchema2 &&
    ctx.url.pathname !== "/" &&
    ctx.url.pathname.split("/").filter(Boolean).length >= 2
  ) {
    issues.push({
      type: "warning",
      category: "structured",
      message: "No BreadcrumbList schema detected for deep page",
      fix: "Consider adding BreadcrumbList JSON-LD when breadcrumb navigation exists",
      impact: "low",
    });
  } else if (hasBreadcrumbSchema2) {
    issues.push({
      type: "success",
      category: "structured",
      message: "BreadcrumbList schema enables breadcrumb rich results",
    });
  }

  // FAQ schema validation (if FAQPage exists, check for questions)
  // Since August 2023, FAQ rich results only show for authoritative government/health sites.
  if (schemaTypes.includes("FAQPage")) {
    issues.push({
      type: "warning",
      category: "structured",
      message:
        "FAQPage rich results limited to government/health sites since August 2023",
      fix: "Google only shows FAQ rich results for authoritative government and health websites. Keep markup for voice search and AI platforms, but don't expect traditional SERP rich results",
      impact: "low",
    });
    const faqJsonLd = jsonLdMatches.find((m) => m[1].includes("FAQPage"));
    if (faqJsonLd) {
      try {
        const faqData = JSON.parse(faqJsonLd[1]);
        // Traverse @graph to find the FAQPage entry if nested
        let faqEntry = faqData;
        if (Array.isArray(faqData["@graph"])) {
          const graphFaq = faqData["@graph"].find(
            (item: Record<string, unknown>) => {
              const types = Array.isArray(item["@type"])
                ? item["@type"]
                : [item["@type"]];
              return types.includes("FAQPage");
            },
          );
          if (graphFaq) faqEntry = graphFaq;
        }
        const mainEntity = faqEntry.mainEntity || faqEntry["mainEntity"];
        if (Array.isArray(mainEntity) && mainEntity.length > 0) {
          issues.push({
            type: "success",
            category: "structured",
            message: `FAQPage schema with ${mainEntity.length} question(s)`,
          });
        } else {
          issues.push({
            type: "warning",
            category: "structured",
            message:
              "FAQPage schema present but no questions found in mainEntity",
            fix: "Add Question items to the FAQPage mainEntity array",
            impact: "low",
          });
        }
      } catch {
        /* already reported as malformed */
      }
    }
  }

  // SameAs property for entity signals (Organization/Person)
  // Scope check to JSON-LD blocks only to avoid matching "sameAs" in JS or body text
  const jsonLdText = jsonLdMatches.map((m) => m[1]).join(" ");
  if (
    schemaTypes.includes("Organization") ||
    schemaTypes.includes("Person") ||
    schemaTypes.includes("LocalBusiness")
  ) {
    const hasSameAs = /"sameAs"/i.test(jsonLdText);
    if (hasSameAs) {
      issues.push({
        type: "success",
        category: "structured",
        message:
          "SameAs property links entity to external profiles (Google Knowledge Panel eligible)",
      });
    } else {
      issues.push({
        type: "warning",
        category: "structured",
        message: "Organization/Person schema missing sameAs property",
        fix: "Add sameAs URLs (social profiles, Wikipedia, etc.) to strengthen entity signals for Knowledge Panel",
        impact: "low",
      });
    }
  }

  // Article schema date check
  if (
    schemaTypes.includes("Article") ||
    schemaTypes.includes("BlogPosting") ||
    schemaTypes.includes("NewsArticle")
  ) {
    const hasDatePub = /"datePublished"/i.test(jsonLdText);
    const hasDateMod = /"dateModified"/i.test(jsonLdText);
    if (hasDatePub && hasDateMod) {
      issues.push({
        type: "success",
        category: "structured",
        message: "Article schema has datePublished and dateModified",
      });
    } else if (hasDatePub && !hasDateMod) {
      issues.push({
        type: "warning",
        category: "structured",
        message: "Article schema missing dateModified",
        fix: "Add dateModified to Article schema - Google uses this for content freshness signals",
        impact: "low",
      });
    } else if (!hasDatePub) {
      issues.push({
        type: "warning",
        category: "structured",
        message: "Article schema missing datePublished",
        fix: "Add datePublished to Article schema for proper rich result display",
        impact: "medium",
      });
      score -= 3;
    }
  }

  // VideoObject schema for video content
  const hasVideoOnPage =
    /<video[\s>]/i.test(ctx.html) ||
    /<iframe[^>]+src=["'][^"']*(?:youtube|vimeo)/i.test(ctx.html);
  if (hasVideoOnPage && !schemaTypes.includes("VideoObject")) {
    issues.push({
      type: "warning",
      category: "structured",
      message: "Video content found without VideoObject schema",
      fix: "Add VideoObject JSON-LD schema for video content to enable video rich results",
      impact: "medium",
    });
    score -= 3;
  }

  // Schema field-level validation against Google's structured data requirements
  if (allParsedItems.length > 0) {
    const fieldValidation = validateSchemaFields(allParsedItems);
    issues.push(...fieldValidation.issues);
    score -= fieldValidation.scorePenalty;
  }

  return { score: Math.max(0, score), issues, schemaTypes };
}
