import { z } from 'zod'

export const PageAcfSchema = z
  .object({
    hero_eyebrow: z.string().optional(),
    hero_description: z.string().optional(),
    show_gallery: z.boolean().optional(),
    show_cta: z.boolean().optional(),
    cta_heading: z.string().optional(),
    cta_body: z.string().optional(),
    sponsors_intro: z.string().optional(),
  })
  .passthrough()

export const PageSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  acf: PageAcfSchema.optional(),
})

export type Page = z.infer<typeof PageSchema>
export type PageAcf = z.infer<typeof PageAcfSchema>

export const StatSchema = z.object({ value: z.string(), label: z.string() })
export const FeatureSchema = z.object({ title: z.string(), description: z.string() })

export const SiteOptionsSchema = z.object({
  id: z.number(),
  site_name: z.string(),
  site_tagline: z.string(),
  organization_name: z.string(),
  contact_email: z.string(),
  contact_phone: z.string(),
  postal_address: z.string(),
  kvk_number: z.string(),
  iban_number: z.string(),
  bic_code: z.string(),
  footer_description: z.string(),
  facebook_url: z.string(),
  instagram_url: z.string(),
})

export type SiteOptions = z.infer<typeof SiteOptionsSchema>
export type Stat = z.infer<typeof StatSchema>
export type Feature = z.infer<typeof FeatureSchema>
