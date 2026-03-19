# Rhiannon Thomas Marketing Consultant

## Current State
Six-section personal site: Hero, Sprint, Services, Resources, Substack, Contact. Content managed via admin panel with password auth. No file upload capability. Sections alternate white/black backgrounds.

## Requested Changes (Diff)

### Add
- Portfolio section (section 06) placed between Substack and Contact
- Portfolio displays a single PDF with a thumbnail image, title, description, and a "View PDF" button
- Admin can upload a thumbnail image and a PDF file via blob-storage, plus set title and description
- Nav updated to include "Portfolio" link
- Portfolio tab added to admin dashboard

### Modify
- Contact section renumbered from 06 to 07
- Contact background changes from black to white (to maintain alternating pattern)
- Footer stays black
- Section ghost numbers updated accordingly
- Nav links updated (add Portfolio before Contact)

### Remove
- Nothing removed

## Implementation Plan
1. Select blob-storage component for PDF and thumbnail file uploads
2. Update `types/content.ts` to add PortfolioItem type and portfolio field in SiteContent
3. Update `Home.tsx`: add Portfolio section (06, black bg), renumber Contact to 07 (white bg), update nav
4. Update `Admin.tsx`: add Portfolio tab with file upload for thumbnail + PDF, title and description fields
5. Update DEFAULT_CONTENT with empty portfolio state
