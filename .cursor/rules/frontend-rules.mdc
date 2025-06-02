---
description: 
globs: apps/web/**.*
alwaysApply: false
---
### Component Structure

- Prefer `grid` over `flex` unless working with two sibling tags
- Use `flex` for simple parent-child layouts:

```jsx
<div>
  <img />
  <p>Some text</p>
</div>
```

- Always use appropriate semantic HTML
- Use `SanityImage` for any images generated in Sanity if the component is available
- Use `Buttons.tsx` resolver for any buttons unless specified otherwise

## Internationalization Rules

Only apply these rules when specifically asked about internationalization:

| Replace | With |
|---------|------|
| left | start |
| right | end |
| ml | ms |
| mr | me |
| pl | ps |
| pr | pe |
| border-l | border-s |
| border-r | border-e |
| text-left | text-start |
| text-right | text-end |
| float-left | float-start |
| float-right | float-end |

For buttons with directional arrows, use an RTL prop to correctly handle horizontal inversion.