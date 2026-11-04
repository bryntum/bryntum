export const
    // <remove-on-release>
    // IMPORTANT: Keep this list up-to-date whenever a theme is added or removed!
    // </remove-on-release>

    // Single Source of Truth for all themes and their displayed labels.
    themeNames = Object.freeze({
        material3       : 'Material 3',
        stockholm       : 'Stockholm',
        svalbard        : 'Svalbard',
        visby           : 'Visby',
        fluent2         : 'Fluent 2',
        'high-contrast' : 'High Contrast'
    }),

    // All theme variants
    themeVariants = Object.freeze({
        light : 'Light',
        dark  : 'Dark'
    }),

    // Family themes with no variant suffix, rendering the declared color-scheme: { fluent2 : 'Fluent 2', ... }
    familyThemes = Object.freeze({ ...themeNames }),

    // Provides a dictionary of all available themes and variants: { 'fluent2-light' : 'Fluent 2 Light', ... }
    themes = Object.freeze(
        Object.fromEntries(
            Object.entries(themeNames)
                .flatMap(([theme, themeLabel]) => [
                    ...Object.entries(themeVariants)
                        .map(([variant, variantLabel]) => [`${theme}-${variant}`, `${themeLabel} ${variantLabel}`]),
                    [theme, themeLabel]
                ])
        )
    );
