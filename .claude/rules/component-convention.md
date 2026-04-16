# Component Convention

## Basic Rules

- Use kebab-case for directory names.
- Use PascalCase for React component file names.
- Non-component files are outside the scope of this rule and should follow the separate lowerCamelCase or lowercase naming rules.
- Declare components in PascalCase.
- Prefer the `ComponentNameProps` pattern for props types.

## Styling

- Use Tailwind utility classes only for styling.
- Inline styles are forbidden.
- Prefer the token utilities from `app/globals.css` for color, background, and typography.

## variants

- For components with variants, use the `const variantStyles = {}` pattern.
- If the component has sizes, separate them into another object such as `sizeStyles`.
- Shared classes may be separated into `baseStyles`.

## State And Rendering

- Components should focus on rendering and interaction wiring.
- Extract long or reusable calculations outside the component.
- Keep conditional rendering in JSX, but move complex derived logic into a hook or `lib`.

## Form Components

- Name input change handlers clearly, such as `handleChange` or `handleSubmit`.
- Use readable names for derived boolean values, such as `canSubmit` or `isChanged`.
