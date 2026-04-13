# DAWN-YSG — Shopify Theme Dev Notes

## Theme
Dawn (Shopify official base theme). All customisations are additive — no core files are forked unless noted below.

---

## Cart Overlay Customisation

### What it is
When the cart drawer opens, a full-screen overlay sits behind the drawer panel.
Three properties are now exposed in the Theme Editor under **Theme settings → Cart → Cart overlay**.

| Setting ID | Type | Default | Description |
|---|---|---|---|
| `cart_overlay_color` | color | `#000000` | Tint colour of the overlay |
| `cart_overlay_opacity` | range 0–100% | `50` | Transparency of the overlay |
| `cart_overlay_blur` | range 0–20px | `0` | Backdrop blur (frosted-glass effect) |

### How the data flows

```
Theme Editor
  └─ config/settings_schema.json   ← declares the three controls (cart section)
       └─ config/settings_data.json ← stores preset defaults
            └─ layout/theme.liquid  ← renders CSS custom properties in :root
                 └─ assets/component-cart-drawer.css ← .drawer consumes the vars
```

### CSS variables emitted by theme.liquid

```css
--cart-overlay-color-rgb: R,G,B;       /* split channels from color picker */
--cart-overlay-opacity: 0–1;           /* opacity divided by 100 */
--cart-overlay-blur: Npx;              /* blur in px */
```

### CSS usage in component-cart-drawer.css

```css
.drawer {
  background-color: rgba(var(--cart-overlay-color-rgb), var(--cart-overlay-opacity));
  backdrop-filter: blur(var(--cart-overlay-blur));
  -webkit-backdrop-filter: blur(var(--cart-overlay-blur));
}
```

### Files changed

| File | Change |
|---|---|
| `config/settings_schema.json` | Added 3 settings to the Cart section (header + color + 2× range) |
| `config/settings_data.json` | Added 3 default values to the Dawn preset |
| `locales/en.default.schema.json` | Added `cart_overlay` translation keys under `settings_schema.cart.settings` |
| `layout/theme.liquid` | Outputs 3 CSS custom properties after the existing drawer vars |
| `assets/component-cart-drawer.css` | `.drawer` background and backdrop-filter now read the CSS vars |

---

## Conventions

- **Translations**: All label strings in `settings_schema.json` use `t:` keys resolved from `locales/en.default.schema.json`. Never hardcode English strings directly in schema.
- **CSS variables**: Follow the pattern `{{ settings.id | divided_by: 100.0 }}` for opacity values (converts 0–100 integer to 0–1 float). Use `{{ settings.color.red }},{{ settings.color.green }},{{ settings.color.blue }}` to split a color picker into RGB channels so `rgba()` works.
- **Defaults**: Always add new setting IDs to `config/settings_data.json` under `presets.Dawn` so the theme doesn't throw undefined errors on first load.
- **Vendor prefixes**: Include `-webkit-backdrop-filter` alongside `backdrop-filter` for Safari support.
