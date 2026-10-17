# Contributing

## Commit messages

Use this title format:

```text
<Type>: <Short description>
```

- Capitalize the type and end it with a colon: `Feat:`, `Fix:`, and so on.
- Capitalize the short description and write it in English.
- Do not put a period at the end.
- Make the title say at a glance what kind of change it contains.

### Types

| Type | Use it for |
|---|---|
| `Feat` | A new capability, such as a technique, block, format, or tool |
| `Fix` | Correcting a bug or inaccurate information |
| `Docs` | Documentation-only changes |
| `Refactor` | Restructuring without changing behavior, such as moving or renaming |
| `Style` | Formatting, spelling, or layout changes that do not change meaning |
| `Chore` | Maintenance such as `.gitignore`, settings, and dependencies |

### Examples

```text
Feat: Add page-flip emphasis type
Fix: Correct safe zone values for Reels
Docs: Add lineage document
Refactor: Move screen-moment rules into blocks
Chore: Ignore render outputs
```

Incorrect examples:

```text
feat: add page flip            ← type is lowercase
Feat: Add page-flip emphasis.  ← ends with a period
Added new emphasis             ← no type
```

If needed, add a blank line after the title and write a commit body.
