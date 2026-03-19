# Rhiannon Thomas Marketing Consultant

## Current State
The site has 6 sections: Hero, Sprint, Services, Resources, Substack, Contact. Each section is editable via the admin panel at /admin. Content is stored as JSON in the backend and cached in localStorage. No portfolio section exists.

## Requested Changes (Diff)

### Add
- Portfolio section (section 06) between Substack and Contact (Contact becomes 07)
- Portfolio section displays a single card with: title, description, and a "View Portfolio" button linking to a PDF URL in a new tab
- Portfolio tab in admin panel with fields: section heading, card title, card description, PDF URL
- `portfolio` field to `SiteContent` type and `DEFAULT_CONTENT`
- Nav link "Portfolio" added between Substack and Contact

### Modify
- Contact section number updated from 06 to 07 (ghost number and label)
- Section numbering in Home.tsx updated accordingly
- Admin tabs updated to include Portfolio tab

### Remove
- Nothing

## Implementation Plan
1. Update `content.ts`: add `PortfolioContent` interface, add `portfolio` to `SiteContent`, add default portfolio content
2. Update `Home.tsx`: add Portfolio section (black bg, ghost number 06), update Contact to 07, add Portfolio nav link
3. Update `Admin.tsx`: add Portfolio tab and `PortfolioTab` component
