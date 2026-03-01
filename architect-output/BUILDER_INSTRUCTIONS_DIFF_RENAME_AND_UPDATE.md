# BUILDER INSTRUCTIONS: Diff Specification & Rename (v1)

**Status:** Ready for Implementation  
**Context:** Rename the "Differentiation" specification to "Semantic Diff" and update its content to reflect the new normative model for version comparison.  
**Reference:** `project_brief/06 - CHANGES/DOCS-PAGE/DOCS_CHANGES_DIFF.md`

---

## 🎯 Objectives
1.  **Rename Files**: Change `differentiation.md` to `diff.md` in both `apps/docs/specification/` and `apps/docs/es/specification/`.
2.  **Merge & Update Content**: Apply the "Semantic Graph Diff" principles, formal breaking change definition, and refined ChangeSet schema.
3.  **Update Navigation**: Modify `apps/docs/.vitepress/config.ts` to reflect the name change and correct order.
4.  **Codify Comparison Rules**: Include structural, property, and semantic change tables.

---

## 🧱 Step 1: Rename Files
- `apps/docs/specification/differentiation.md` → `apps/docs/specification/diff.md`
- `apps/docs/es/specification/differentiation.md` → `apps/docs/es/specification/diff.md`

---

## 🧱 Step 2: Update `apps/docs/specification/diff.md`

Replace the content with the following normative structure:

### 1. Formal Definition
RIGOR does not perform textual diffs. It performs a **Semantic Graph Diff** over the Canonical Graph Representation.
- **Definition**: A breaking change is any modification that invalidates a previously valid process instance.

### 2. Formal Function
`Diff = f(Graph_A, Graph_B) → ChangeSet`
- Both inputs MUST be protocol-compliant.

### 3. Comparison Rules
- Independent of textual order.
- Ignores formatting/comments.
- Deterministic change ordering.

### 4. Categorized Changes (Normative Tables)
Include the three tables from the proposal:
- **Structural**: NodeAdded (Non-breaking), NodeRemoved (Breaking), NodeRenamed (Breaking by default).
- **Property**: PropertyAdded, PropertyRemoved (Breaking), PropertyTypeChanged (Breaking).
- **Semantic**: ConstraintStrengthened (Breaking), ConstraintWeakened (Non-breaking), RequiredAdded (Breaking).

### 5. Standard ChangeSet Schema
Include the JSON schema example with `changes` array and `summary` block.

### 6. CLI & Exit Codes
Include the `rigor diff` command grammar and the 0-3 exit code table.

---

## 🧱 Step 3: Update `apps/docs/es/specification/diff.md`

Translate the content to Spanish using the title **"Diff Semántico"**. Ensure technical terms like "Breaking Change" are explained or paired with "Cambio de Ruptura".

---

## 🛠️ Step 4: Update Sidebar (`apps/docs/.vitepress/config.ts`)

Reorder and rename entries in the `Protocol Specification` section for both languages:

```typescript
// Proposed Order
{ text: 'Versioning', link: '/specification/versioning' },
{ text: 'Semantic Diff', link: '/specification/diff' }, // Renamed from Differentiation
{ text: 'Migrations', link: '/specification/migrations' },
```

---

## ✅ Verification Checklist
- [ ] Build succeeds: `npm run build:docs`.
- [ ] Sidebar shows "Semantic Diff" (EN) and "Diff Semántico" (ES).
- [ ] Old `differentiation` links are removed or redirect if possible (manual check).
- [ ] JSON ChangeSet example is present and valid.
