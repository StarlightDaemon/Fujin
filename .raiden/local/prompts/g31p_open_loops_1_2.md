# G31P Task Brief — Fujin Open Loops 1 & 2
> Two targeted fixes to ToolShell. All design decisions are made — execute exactly as specified.
> Produce complete file outputs — no placeholders, no ellipsis, no "rest unchanged."

---

## 1. CONTEXT

You are working on **Fujin**, a Mantine v7 React component library.

**Repo root:** `/mnt/e/Fujin/`

Two open loops exist in `ToolShell` (`components/ToolShell.tsx`):

**Open Loop 1 — NavLink active background bleed**
Mantine v7's `NavLink` sets `data-active` on active items and applies its own background
color via internal Mantine theming. The current `styles` override only sets `color` and
`borderRadius` — it does not override the active background. In light theme the Mantine
default (a blue tint) will bleed through instead of `var(--fujin-bg-elevated)`.

**Open Loop 2 — Mobile burger button not wired**
`ToolShell` has `toggleMobile` internally but no way for callers to trigger it. The
`AppShell` collapses the rail on mobile, but there is no surface to expose the toggle.

Both fixes touch only `components/ToolShell.tsx`, `dev/App.tsx`, `llms-full.txt`, and
`.raiden/state/OPEN_LOOPS.md`.

---

## 2. CORE RULES (apply to all output)

1. All colors via `var(--fujin-*)` CSS custom properties — no hex values, no `tokens.color.*`.
2. All spacing via `tokens.spacing.*` — no bare pixel numbers.
3. `borderRadius` is always `tokens.radius.default` (0).
4. No new abstractions, no new hooks, no shared style objects beyond what exists.
5. `import tokens from '../tokens.json'` stays in every component file.

---

## 3. FIX 1 — NavLink Active Background

**File:** `components/ToolShell.tsx`

**Current code (lines 117–124):**
```tsx
styles={{
  root: {
    borderRadius: tokens.radius.default,
    color: item.active
             ? 'var(--fujin-text-primary)'
             : 'var(--fujin-text-secondary)',
  },
}}
```

**Replace with:**
```tsx
styles={{
  root: {
    borderRadius: tokens.radius.default,
    color: item.active
             ? 'var(--fujin-text-primary)'
             : 'var(--fujin-text-secondary)',
    '&[data-active]': {
      backgroundColor: 'var(--fujin-bg-elevated)',
      color:           'var(--fujin-text-primary)',
    },
    '&:hover': {
      backgroundColor: 'var(--fujin-bg-elevated)',
    },
  },
}}
```

No other changes to NavLink. The `&[data-active]` selector overrides Mantine's internal
active background. The `&:hover` selector prevents Mantine's hover background from using
its own theme color. Both use `backgroundColor` (not `background`) to avoid overriding
`background-image` if Mantine sets one internally.

---

## 4. FIX 2 — Mobile Burger Button

**File:** `components/ToolShell.tsx`

### 4a. Update the props interface

**Current:**
```tsx
export interface ToolShellProps {
  navItems:  NavItem[];
  logo?:     ReactNode;
  footer?:   ReactNode;
  children:  ReactNode;
}
```

**Replace with:**
```tsx
export interface ToolShellProps {
  navItems:  NavItem[];
  logo?:     ReactNode;
  footer?:   ReactNode;
  children:  ReactNode;
  header?:   (controls: { toggleMobile: () => void; mobileOpen: boolean }) => ReactNode;
}
```

### 4b. Update the function signature

**Current:**
```tsx
export function ToolShell({ navItems, logo, footer, children }: ToolShellProps) {
```

**Replace with:**
```tsx
export function ToolShell({ navItems, logo, footer, children, header }: ToolShellProps) {
```

### 4c. Add the header style object

Add this constant after the existing `main` style object (before the `return`):

```tsx
  const headerBar: React.CSSProperties = {
    background:    'var(--fujin-bg-surface)',
    borderBottom:  `1px solid var(--fujin-border-subtle)`,
    display:       'flex',
    alignItems:    'center',
    padding:       `0 ${tokens.spacing.scale.md}px`,
    height:        '100%',
  };
```

### 4d. Update the AppShell configuration

**Current:**
```tsx
  return (
    <AppShell
      navbar={{
        width:     railWidth,
        breakpoint:'sm',
        collapsed: { mobile: !mobileOpen },
      }}
      padding={0}
    >
```

**Replace with:**
```tsx
  return (
    <AppShell
      header={header ? { height: tokens.spacing.scale.xl * 2 } : undefined}
      navbar={{
        width:     railWidth,
        breakpoint:'sm',
        collapsed: { mobile: !mobileOpen },
      }}
      padding={0}
    >
```

`tokens.spacing.scale.xl * 2` = `24 * 2` = `48` — the header height in pixels.

### 4e. Add the AppShell.Header render

Add this block immediately after the opening `<AppShell ...>` tag and before `<AppShell.Navbar`:

```tsx
      {header && (
        <AppShell.Header style={headerBar}>
          {header({ toggleMobile, mobileOpen })}
        </AppShell.Header>
      )}
```

No other changes to the JSX.

### 4f. Verify the complete updated export type in index.ts

`components/index.ts` already exports `ToolShellProps` — no change needed there since
`ToolShellProps` is updated in-place.

---

## 5. UPDATE DEV HARNESS

**File:** `dev/App.tsx`

Add the `header` render prop to the `<ToolShell>` element to demonstrate the burger button.

**Current ToolShell opening tag:**
```tsx
    <ToolShell
      logo={<span style={{ fontWeight: tokens.typography.fontWeight.bold, color: 'var(--fujin-text-primary)' }}>Fujin UI</span>}
      navItems={[
        { label: 'Dashboard', icon: '⊞', active: true },
        { label: 'Reports', icon: '≡' },
        { label: 'Settings', icon: '⚙' },
      ]}
      footer={
        <UnstyledButton onClick={toggle} style={plainBtnStyle}>
          Toggle Theme
        </UnstyledButton>
      }
    >
```

**Replace with:**
```tsx
    <ToolShell
      logo={<span style={{ fontWeight: tokens.typography.fontWeight.bold, color: 'var(--fujin-text-primary)' }}>Fujin UI</span>}
      navItems={[
        { label: 'Dashboard', icon: '⊞', active: true },
        { label: 'Reports', icon: '≡' },
        { label: 'Settings', icon: '⚙' },
      ]}
      footer={
        <UnstyledButton onClick={toggle} style={plainBtnStyle}>
          Toggle Theme
        </UnstyledButton>
      }
      header={({ toggleMobile, mobileOpen }) => (
        <UnstyledButton
          onClick={toggleMobile}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        tokens.spacing.scale.xs,
            color:      'var(--fujin-text-secondary)',
            fontFamily: tokens.typography.fontFamily.base,
            fontSize:   tokens.typography.fontSize.lg,
            padding:    `0 ${tokens.spacing.scale.sm}px`,
            cursor:     'pointer',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </UnstyledButton>
      )}
    >
```

No other changes to `dev/App.tsx`.

---

## 6. UPDATE DOCUMENTATION

**File:** `llms-full.txt`

**Change 1 — Update the ToolShell interface block**

Find:
```
interface ToolShellProps {
  navItems:  NavItem[];
  logo?:     ReactNode;   // shown at top of rail; click toggles collapse
  footer?:   ReactNode;   // shown at bottom of rail (user profile, settings)
  children:  ReactNode;   // main content area
}
```

Replace with:
```
interface ToolShellProps {
  navItems:  NavItem[];
  logo?:     ReactNode;   // shown at top of rail; click toggles collapse
  footer?:   ReactNode;   // shown at bottom of rail (user profile, settings)
  children:  ReactNode;   // main content area
  header?:   (controls: { toggleMobile: () => void; mobileOpen: boolean }) => ReactNode;
  // render prop — if provided, an AppShell.Header (48px) is rendered above the rail.
  // Use to place a burger button or top bar content. controls.toggleMobile opens the
  // mobile rail; controls.mobileOpen reflects current state.
}
```

**Change 2 — Update the ToolShell Behavior section**

Find:
```
- Mobile: rail hidden by default; wire a burger button to internal `toggleMobile`
```

Replace with:
```
- Mobile: rail hidden by default; pass a `header` render prop to render a top bar with
  a burger button. The render prop receives `{ toggleMobile, mobileOpen }`.
```

---

## 7. UPDATE OPEN LOOPS

**File:** `.raiden/state/OPEN_LOOPS.md`

Mark the two resolved loops. Find and replace each section:

**Find:**
```markdown
## ToolShell Mobile Burger Button
**Status:** Unresolved
```
**Replace with:**
```markdown
## ToolShell Mobile Burger Button
**Status:** Resolved
```

**Find:**
```markdown
## Mantine NavLink Active State Background
**Status:** Unresolved
```
**Replace with:**
```markdown
## Mantine NavLink Active State Background
**Status:** Resolved
```

Leave the detail text under each loop intact — only the status line changes.

---

## 8. OUTPUT FORMAT

For each file, output:

```
### FILE: <relative path from repo root>
```
followed by the complete file contents in a fenced code block.

Files to output (all complete, no truncation):
1. `components/ToolShell.tsx`
2. `dev/App.tsx`
3. `llms-full.txt`
4. `.raiden/state/OPEN_LOOPS.md`
