# Vertvista Website Automation Guide
## Templates and Scripts for Consistent Updates

This guide provides reusable templates and automation patterns for maintaining consistency across the Vertvista website, especially for SEO optimization and content updates.

---

## 📁 Available Templates

### 1. **Schema.org Templates** (`templates/` directory)

#### `schema-service-template.json`
- **Purpose**: Standard Service schema for all service pages
- **Use when**: Creating new service pages or updating existing ones
- **Key fields to customize**:
  - `[SERVICE_TYPE]`: E.g., "Indoor Plant Rental", "Green Wall Installation"
  - `[SERVICE_NAME]`: Full descriptive name
  - `[DETAILED_DESCRIPTION]`: 150-200 word comprehensive description
  - `hasOfferCatalog.itemListElement`: List all sub-services or packages
  - `additionalProperty`: Unique features, warranties, guarantees
  - `knowsAbout`: Expertise keywords for AI entity recognition

#### `schema-breadcrumb-template.json`
- **Purpose**: Navigation breadcrumb schema for SEO
- **Use when**: Every page needs breadcrumb navigation
- **Key fields to customize**:
  - `[SECTION_NAME]`: Main section (Services, Resources, Company)
  - `[PAGE_NAME]`: Current page title
  - Update URLs to match actual file paths

#### `schema-organization-template.json`
- **Purpose**: Company-level schema (use on homepage and key pages)
- **Use when**: Homepage, About page, Contact page
- **Key fields to customize**:
  - `hasOfferCatalog`: Update with current service list
  - `sameAs`: Add social media URLs when available
  - Keep contact info current

### 2. **Content Templates**

#### `footer-template.html`
- **Purpose**: Consistent footer across all pages
- **Critical elements**:
  - Phone: `+91-7045251178`
  - Email: `info@vertvista.com` (NOT eco@vertvista.com)
  - Tagline: Must mention "external landscape development services"
- **How to use**: Copy entire footer block when creating new pages

#### `meta-description-patterns.md`
- **Purpose**: Guide for writing AI/LLM-optimized meta descriptions
- **Use when**: Creating any new page or updating existing meta tags
- **Key patterns**:
  1. Question-Based (most services)
  2. Problem-Solution (maintenance/consultation services)
  3. Specification-Focused (product pages)
  4. Authority/Trust (consultative services)

---

## 🔄 Bulk Update Procedures

### Updating Contact Information Site-Wide

**When to do**: Whenever phone, email, or address changes

**Step-by-step**:
1. Update `footer-template.html` with new contact info
2. Run this search to find all pages with old contact info:
   ```bash
   grep -r "eco@vertvista.com" *.html
   grep -r "old-phone-number" *.html
   ```
3. Use MultiEdit tool to update each file:
   - Old email → New email
   - Old phone → New phone
   - Old tagline → New tagline (with landscape mention)

**Files to check** (based on current project):
- All service pages: indoor-plants.html, maintenance.html, planters.html, green-walls.html, green-facade.html, moss-art.html, biophilic-design.html, landscape-design.html
- Static pages: about.html, contact.html, get-started.html
- Resource pages: case-studies.html, testimonials.html, faq.html

### Updating Service List in Navigation

**When to do**: Adding/removing services

**Files to update**:
1. All HTML files with navigation (search for `<nav class="navbar"`)
2. Update dropdown menu items
3. Update footer service links
4. Update homepage service cards

### Adding Schema to Existing Pages

**For service pages**:
1. Copy `schema-service-template.json`
2. Fill in all `[PLACEHOLDER]` fields
3. Add breadcrumb schema from `schema-breadcrumb-template.json`
4. Insert both schemas in `<head>` section as:
   ```html
   <script type="application/ld+json">
   [PASTE SERVICE SCHEMA HERE]
   </script>
   
   <script type="application/ld+json">
   [PASTE BREADCRUMB SCHEMA HERE]
   </script>
   ```

**For product pages**:
1. Use Service schema template
2. Change `hasOfferCatalog` items to `@type: "Product"`
3. Add product-specific fields:
   - `material`: What it's made of
   - `category`: Product category
   - `offers.price`: If fixed pricing available

---

## 📋 SEO Optimization Checklist

Use this checklist when creating or updating any page:

### Meta Tags
- [ ] Title tag 50-60 characters with primary keyword
- [ ] Meta description 150-160 characters using natural language pattern
- [ ] Keywords meta tag with 5-10 relevant terms
- [ ] Canonical URL set correctly

### Schema.org Markup
- [ ] Service/Product schema with comprehensive description
- [ ] Breadcrumb schema for navigation
- [ ] Organization schema (if homepage or major page)
- [ ] All provider contact info correct (phone, email)
- [ ] `areaServed` includes all operating cities
- [ ] `knowsAbout` lists 8-15 expertise keywords

### Content Optimization
- [ ] H1 heading includes primary keyword
- [ ] Natural language questions in subheadings
- [ ] Local keywords mentioned (city names)
- [ ] Pricing/numbers included where relevant
- [ ] Call-to-action buttons clear and prominent

### Footer & Contact
- [ ] Footer uses standard template
- [ ] Phone: +91-7045251178
- [ ] Email: info@vertvista.com
- [ ] Tagline mentions landscape services
- [ ] All service links working

### Navigation
- [ ] All dropdown menus have correct links
- [ ] Breadcrumbs match page hierarchy
- [ ] Mobile menu functional
- [ ] Active page highlighted

---

## 🤖 AI/LLM Search Optimization

### Key Principles

1. **Natural Language**: Write as if answering a question
2. **Entity Recognition**: Use consistent company names, service names
3. **Location Context**: Always mention cities/regions served
4. **Specificity**: Numbers, pricing, metrics build trust with AI
5. **Conversational Tone**: "Need indoor plants?" not "Indoor plant solutions"

### Schema.org Priority Fields for AI

Most important for AI recommendation engines:

1. **Service.description**: 150-200 word comprehensive explanation
2. **knowsAbout**: List all expertise areas (AI uses this for matching)
3. **areaServed**: Geographic context for local recommendations
4. **hasOfferCatalog**: Complete service/product listings with descriptions
5. **additionalProperty**: Unique features that differentiate you

### Testing AI Findability

Ask AI assistants these questions to test optimization:
- "I need indoor plants for my office in Mumbai"
- "Who can install green walls in Bangalore?"
- "Looking for plant maintenance services in India"
- "Best biophilic design company for offices"
- "Where to buy premium planters in Mumbai?"

Your pages should appear in AI responses if properly optimized.

---

## 🛠️ Common Update Scenarios

### Scenario 1: New Service Page Created

1. **Copy structure** from similar existing service page
2. **Use schema-service-template.json** for Schema.org markup
3. **Write meta description** using patterns from meta-description-patterns.md
4. **Add breadcrumb schema** with correct navigation path
5. **Copy footer-template.html** for consistent footer
6. **Add to navigation** in all HTML files
7. **Add to homepage** service cards if major service

### Scenario 2: Pricing Changed

1. **Update service page** pricing tables/sections
2. **Update Schema.org** offers.price fields
3. **Update meta description** if pricing mentioned
4. **Update homepage** service cards if pricing displayed
5. **Check FAQ page** for pricing-related answers

### Scenario 3: New City Coverage Added

1. **Update Schema.org** areaServed arrays in all service pages
2. **Update "Areas We Serve"** sections on service pages
3. **Update homepage** coverage map/list
4. **Update about.html** coverage information
5. **Update meta descriptions** to mention new city
6. **Create location-specific page** if major market (e.g., bangalore.html)

### Scenario 4: Contact Information Changed

1. **Update footer-template.html** with new info
2. **Find all occurrences**:
   ```bash
   grep -r "old-phone" *.html
   grep -r "old-email" *.html
   ```
3. **Bulk update** using MultiEdit on each file
4. **Update Schema.org** provider.telephone and provider.email
5. **Update contact.html** page specifically
6. **Test all contact forms** point to new email

---

## 📊 Quality Assurance

### Before Publishing Any Update

- [ ] All links work (no 404s)
- [ ] Schema validates at https://validator.schema.org/
- [ ] Meta descriptions within 160 characters
- [ ] Footer contact info consistent across pages
- [ ] Mobile responsive (test on phone/tablet)
- [ ] Images load properly with alt text
- [ ] Forms submit correctly
- [ ] Navigation dropdown works
- [ ] Page loads under 3 seconds

### Monthly Maintenance Tasks

- [ ] Check all external links still work
- [ ] Update schema if services changed
- [ ] Review analytics for top landing pages
- [ ] Ensure all contact forms working
- [ ] Test site on latest browsers
- [ ] Update copyright year in footer
- [ ] Check for broken images
- [ ] Verify SSL certificate valid

---

## 🎯 Quick Reference

### Contact Information (Always Current)
- **Phone**: +91-7045251178
- **Email**: info@vertvista.com (NOT eco@vertvista.com)
- **Website**: www.vertvista.com
- **HQ**: Mumbai, India

### Service Coverage Areas
- Mumbai (HQ)
- Pune
- Bangalore
- Chennai
- Hyderabad
- Gujarat
- Delhi NCR (Coming Soon)

### Brand Elements
- **Tagline**: "Breathe • Grow • Thrive"
- **Positioning**: "India's trusted partner for workplace biophilia and external landscape development services"
- **Primary Color**: Green (#2D5016, #3D6B1F)
- **Accent Color**: Lime (#CCFF00)

### File Naming Conventions
- Lowercase with hyphens: `green-walls.html` (not `GreenWalls.html`)
- CSS: `css/style.css`, `css/[page-name].css`
- JS: `js/script.js`, `js/[feature].js`
- Images: `images/[descriptive-name].jpg`

---

## 📞 Support

For questions about these templates or automation procedures:
- Review this guide and template files first
- Check existing implementation on similar pages
- Test changes on staging before production
- Validate schema markup before publishing

Last Updated: 2025-01-XX
