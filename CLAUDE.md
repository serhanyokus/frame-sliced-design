# Frame-Sliced Design: repository guidance

- Keep folder names and documentation in English. Leave established industry terms such as hook, punch-in, and safe zone in English; explain them in `glossary.md`.
- Follow Feature-Sliced Design boundaries: a layer may use only the layers below it, slices at the same level do not depend on one another, and every slice has a README. See `README.md`.
- The rationale behind the method is in `lineage.md`.
- Do not add brand-specific material (colors, screens, or raw footage) to this repository. `brands/_template` defines structure only.
- Propose new content or elements before adding them and get approval.

## Commit messages

Use the `<Type>: <Short description>` format. Types: Feat, Fix, Docs, Refactor, Style, Chore. Capitalize the type and description, write the description in English, and do not end the title with a period. See `CONTRIBUTING.md` for details and examples.
