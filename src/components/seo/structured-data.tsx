/**
 * Structured Data Component
 * 
 * Injects JSON-LD structured data into pages for SEO.
 * This helps Google understand your content and enables rich snippets.
 */

import { getOrganizationSchema, getWebSiteSchema, getServiceProviderSchema } from '@/lib/utils/seo';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'service-provider';
  data?: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema: Record<string, unknown>;

  switch (type) {
    case 'organization':
      schema = getOrganizationSchema();
      break;
    case 'website':
      schema = getWebSiteSchema();
      break;
    case 'service-provider':
      schema = getServiceProviderSchema(data);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and required for SEO
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Multiple Structured Data Component
 * 
 * Renders multiple JSON-LD schemas on a single page
 */
interface MultipleStructuredDataProps {
  schemas: Array<Record<string, unknown>>;
}

export function MultipleStructuredData({ schemas }: MultipleStructuredDataProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and required for SEO
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

