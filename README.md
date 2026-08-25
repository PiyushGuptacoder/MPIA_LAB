# CommunityConnect Frontend

This is the first frontend prototype for the CommunityConnect mini project.

## Concept
Three focus areas:
1. Education
2. Healthcare
3. Civic / Nearby Problems

Common workflow:
Report → Categorize & Locate → Route → Track & Escalate → Resolve & Review

## Files
- index.html — complete frontend
- styles.css — responsive styling and visual design
- script.js — prototype interactions

## Run
Open `index.html` directly in a browser.

For the later Flask version, move:
- `index.html` → `templates/index.html`
- `styles.css` and `script.js` → `static/`

Then connect the forms and case data to Flask routes/database.

## Prototype interactions included
- Category cards open the report modal.
- Report form generates a demo case ID.
- Nearby-case filters work.
- Case buttons show prototype status messages.
- Community-support button filters civic cases.
- Browser location permission can be requested.
- Sign-in currently shows a backend placeholder message.

## Important
This is frontend-only. Authorities, NGOs, authentication, case persistence, maps, notifications and real integrations are intentionally not connected yet.
