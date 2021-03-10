**PostCSS** is a CSS Parser that can be extended with plugins.
We made a selection of plugins useful for Swissquote.
Here are some features made possible by them.

[TOC]

## All plugins

All included plugins have a short example accompanying them below.

| Plugin                               | Description                                 |
| ------------------------------------ | ------------------------------------------- |
| `postcss-assets`                     | Embed images & size functions               |
| `postcss-filter-gradient`            | Gradient fallback for IE9                   |
| `postcss-import`                     | Import files                                |
| `postcss-scss`                       | Inline comments support                     |
| `postcss-url`                        | Update relative URLs after import           |
| `postcss-advanced-variables`         | Sass-like variables, mixins and loops       |
| `postcss-nested`                     | Sass-like nested selectors                  |
| `postcss-atroot`                     | place rules back up to the root             |
| `postcss-property-lookup`            | reference other property values             |
| `postcss-dir-pseudo-class`           | Use the `:dir()` pseudo class for LTR/RTL   |
| `postcss-logical`                    | New LTR/RTL and flow related properties     |
| `autoprefixer`                       | Add or remove Vendor prefixes               |
| `postcss-csso`                       | Minify CSS                                  |
| `postcss-attribute-case-insensitive` | Support case insensitive attributes         |
| `postcss-calc`                       | Resolves calculations                       |
| `postcss-color-function`             | W3C color methods                           |
| `postcss-color-gray`                 | Shades of gray                              |
| `postcss-color-hex-alpha`            | `#rrggbbaa` colors                          |
| `postcss-color-hsl`                  | Allow to define colors using `hsl()`        |
| `postcss-color-hwb`                  | `hwb()` color function                      |
| `postcss-color-rebeccapurple`        | Adds the `rebbeccapurple` color             |
| `postcss-color-rgb`                  | Change W3C Color Level 4 `rgb()` to Level 3 |
| `postcss-color-rgba-fallback`        | Add an RGB fallback to RGBA colors          |
| `postcss-custom-media`               | W3C custom media queries                    |
| `postcss-custom-properties`          | W3C custom variables                        |
| `postcss-custom-selectors`           | W3C custom selectors                        |
| `postcss-font-family-system-ui`      | Change `system-ui` to a font-family list    |
| `postcss-font-variant`               | Transformed to `font-feature-settings`      |
| `postcss-image-set-polyfill`         | Use `image-set()` for image selection       |
| `postcss-initial`                    | Use initial value for a property            |
| `postcss-media-minmax`               | W3C < <= >= > media queries                 |
| `postcss-nesting`                    | W3C nested selectors                        |
| `postcss-pseudo-class-any-link`      | Allows you to use :any-link pseudo class.   |
| `postcss-pseudoelements`             | Adjust `::` to `:`                          |
| `postcss-replace-overflow-wrap`      | Converts `overflow-wrap` to `word-wrap`     |
| `postcss-selector-matches`           | W3C `:matches()` pseudo-classes             |
| `postcss-selector-not`               | W3C `:not()` pseudo-classes                 |

## Organization

### Nested Styles (`postcss-nesting`, `postcss-nested`, `postcss-atroot`)

```css
/* Before */

.parent {
  background: white;

  .before {
    color: #333;
  }

  @at-root {
    .child {
      background: black;
    }
  }

  .after {
    color: #eee;
  }
}

/* After */

.child {
  background: black;
}

.parent {
  background: white;
}

.parent .before {
  color: #333;
}

.parent .after {
  color: #eee;
}
```

### Import CSS Files (`postcss-import`, `postcss-url`)

With `@import`, you can import your CSS files to create a single CSS output file.
All relative links are updated when they are imported.

```css
/* Before */

/** foo.scss **/

body {
  background: #eee;
}

/** media/bar.scss **/

.button {
  background: url("../../images/buttons/background.png");
}

/** style.scss **/

@import "foo.scss";
@import "media/bar.scss" (min-width: 25em);

/* After */

body {
  background: #eee;
}

@media (min-width: 25em) {
  .button {
    background: url("../images/buttons/background.png"); /* the path has been rebased */
  }
}
```

### Mixins (`sassy-mixins`)

`@mixin` allows to create Sass style mixins.

```css
/* Before */

@mixin icon($name) {
  padding-left: 16px;

  &::after {
    content: "";
    background: url(/icons/$(name).png);
  }
}

.search {
  @include icon(search);
}

/* After */

.search {
  padding-left: 16px;
}

.search::after {
  content: "";
  background: url(/icons/search.png);
}
```

### Comments (`postcss-scss`)

```css
/* Before */

// single line comment
.button {
  color: orange;
}

/* After */

/* single line comment */
.button {
  color: orange;
}
```

## Variables

### Variables (`postcss-advanced-variables`, `postcss-custom-properties`)

We have two possible ways of using variables:

1.  Sass style variables : `$variable`
1.  CSS properties (Official specification): `--variable`

Sass style variables are provided as a compatibility layer.
We recommend to use the CSS properties as they are future proof and will be directly supported in browsers in the future.

```css
/* Before */

:root {
  --color: #f00;
}

$blue: #056ef0;
$column: 200px;

.menu {
  width: calc(4 * $column);
}

.menu_link {
  color: var(--color);
  background: $blue;
  width: $column;
}

/* After */

.menu {
  width: calc(4 * 200px);
}

.menu_link {
  color: #f00;
  background: #056ef0;
  width: 200px;
}
```

### Property Lookup (`postcss-property-lookup`)

```css
/* Before */

.heading {
  margin: 20px;
  padding: @margin;
}

/* After */

.heading {
  margin: 20px;
  padding: 20px;
}
```

## Images

### Images in CSS (`postcss-assets`)

```css
/* Before */

body {
  background: inline(
    "background.png"
  ); /* Be careful to not use this on big files */
}

.button {
  background: resolve("foobar.jpg");
  background: resolve("icons/baz.png");
  width: width("foobar.png");
  height: height("foobar.png");
  background-size: size("foobar.png");
}

/* After */

body {
  background: url(data:image/gif;base64,...);
}

.button {
  background: url("../images/foobar.jpg?14a931c501f");
  background: url("../images/icons/baz.png?14a931c501f");
  width: 320px;
  height: 240px;
  background-size: 320px 240px;
}
```

### Image set (`postcss-image-set-polyfill`)

```css
/* Before */

.BigImage {
  background-image: image-set(
    url(img/test.png) 1x,
    url(img/test-2x.png) 2x,
    url(my-img-print.png) 600dpi
  );
}

/* After */

.BigImage {
  background-image: url(img/test.png);
}

@media (-webkit-min-device-pixel-ratio: 2),
  (-o-min-device-pixel-ratio: 2/1),
  (min-resolution: 192dpi) {
  .BigImage {
    background-image: url(img/test-2x.png);
  }
}

@media (-webkit-min-device-pixel-ratio: 6.25),
  (-o-min-device-pixel-ratio: 25/4),
  (min-resolution: 600dpi) {
  .BigImage {
    background-image: url(my-img-print.png);
  }
}
```

### Help with Right-to-left languages (`postcss-logical`, `postcss-dir-pseudo-class`)

```css
/* Before */
.Banner {
  color: #222222;
  inset: logical 0 5px 10px;
  padding-inline: 20px 40px;
  resize: block;
}

// `postcss-dir-psseudo-class`
.Banner__title:dir(rtl) {
  margin-right: 10px;
}

.Banner__title:dir(ltr) {
  margin-left: 10px;
}

/* After */

.Banner {
  color: #222222;
  top: 0;
  left: 5px;
  bottom: 10px;
  right: 5px;
}

.Banner:dir(ltr) {
  padding-left: 20px;
  padding-right: 40px;
}

.Banner:dir(rtl) {
  padding-right: 20px;
  padding-left: 40px;
}

.Banner {
  resize: vertical;
}

// `postcss-dir-psseudo-class`
[dir="rtl"] .Banner__title {
  margin-right: 10px;
}

[dir="ltr"] .Banner__title {
  margin-left: 10px;
}
```

## Dynamic Styles

### Math in your CSS (`postcss-calc`)

```css
/* Before */

:root {
  --main-font-size: 16px;
}

body {
  font-size: var(--main-font-size);
}

h1 {
  font-size: calc(var(--main-font-size) * 2);
  height: calc(100px - 2em);
  margin-bottom: calc(var(--main-font-size) * 1.5);
}

/* After */

body {
  font-size: 16px;
}

h1 {
  font-size: 32px;
  height: calc(100px - 2em); // em's won't be resolved
  margin-bottom: 24px;
}
```

### Conditionals (`postcss-advanced-variables`)

```css
/* Before */

.notice--clear {
  @if 3 < 5 {
    background: green;
  } @else {
    background: blue;
  }
}

/* After */

.notice--clear {
  background: green;
}
```

### Loops (`postcss-advanced-variables`)

```css
/* Before */

@each $icon in (foo, bar, baz) {
  .icon-$(icon) {
    background: url("icons/$(icon).png");
  }
}

@for $i from 1 to 3 {
  .b-$i {
    width: #{i}px;
  }
}

/* After */

.icon-foo {
  background: url("icons/foo.png");
}

.icon-bar {
  background: url("icons/bar.png");
}

.icon-baz {
  background: url("icons/baz.png");
}

.b-1 {
  width: 1px;
}
.b-2 {
  width: 2px;
}
.b-3 {
  width: 3px;
}
```

### Initial Values (`postcss-initial`)

```css
/* Before */

a {
  animation: initial;
  background: initial;
  white-space: initial;
}

/* After */

a {
  animation: none 0s ease 0s 1 normal none running;
  animation: initial;
  background: transparent none repeat 0 0 / auto auto padding-box border-box
    scroll;
  background: initial;
  white-space: normal;
}
```

### Colors (`postcss-color-function`, `postcss-color-gray`, `postcss-color-hex-alpha`, `postcss-color-hwb`, `postcss-color-rebeccapurple`, `postcss-color-rgb`, `postcss-color-rgba-fallback`, `postcss-color-hsl`)

#### Color Fallbacks

Some colors functions don't work in all browsers, these plugins will create fallbacks.

`rebeccapurple` is a whole different story, it's an homage to [Eric Meyer's daughter](https://github.com/postcss/`postcss-color-rebeccapurple`#why-this-plugin-).

```css
/* Before */

blockquote {
  background: rgba(
    153,
    221,
    153,
    0.8
  ); // This will create a fallback without the alpha

  border-color: #9d9c; // This will be transformed to rgba

  color: rebeccapurple; // ... sad story, homage to eric meyer
}

.Quote--clear {
  background: rgb(250.5 255 255); // Allows to declare colors with rgb() level 4

  color: hsl(
    200grad 100% 50% / 20%
  ); // This will declare colors with hsl() level 4

  border-color: hwb(90, 0%, 0%, 0.5); // This will transform colors to rgba()
}

/* After */

blockquote {
  background: #9d9;
  background: rgba(153, 221, 153, 0.8);

  border-color: #9d9;
  border-color: rgba(153, 221, 153, 0.8);

  color: #639;
}

.Quote--clear {
  background: rgb(251, 255, 255);

  color: hsla(180, 100%, 50%, 0.2);

  border-color: #80ff00;
  border-color: rgba(128, 255, 0, 0.5);
}
```

#### Color manipulation

You can change a color by applying modifiers.
Apart from the ones presented here, there are [a lot of modifiers](https://github.com/postcss/`postcss-color-function`#list-of-color-adjuster) available

```css
/* Before */

a {
  color: color(red alpha(-10%)); // Change the opacity of red
}

a:hover {
  color: color(red blackness(80%)); // Darken the color
}

body {
  color: hwb(90, 0%, 0%, 0.6); // This will be transformed to rgba
}

/* After */

a {
  color: red;
  color: rgba(255, 0, 0, 0.9);
}

a:hover {
  color: #300;
}

body {
  color: #80ff00;
  color: rgba(128, 255, 0, 0.6);
}
```

#### Levels of gray

You can also get levels of gray.

```css
/* Before */

p {
  color: gray(85); // Level of gray

  background: gray(10%, 50%); // Level of gray with opacity
}

/* After */

p {
  color: #555;

  background: #1a1a1a;
  background: rgba(26, 26, 26, 0.5);
}
```

## Syntax simplification

### Selectors (`postcss-selector-matches`, `postcss-selector-not`, `postcss-pseudo-class-any-link`, `postcss-custom-selectors`)

These plugins help with the creation

```css
/* Before */

@custom-selector :--button button, .button;
@custom-selector :--enter :hover, :focus;

:--button {
  /* styles for your buttons */
}
:--button:--enter {
  /* hover/focus styles for your button */
}

p:not(:first-child, .special) {
  color: red;
}

p:matches(:first-child, .special) {
  color: red;
}

nav :any-link {
  background-color: yellow;
}

[frame="hsides" i] {
  border-style: solid none;
}

/* After */

.button,
button {
  /* styles for your buttons */
}

.button:focus,
.button:hover,
button:focus,
button:hover {
  /* hover/focus styles for your button */
}

p:not(:first-child):not(.special) {
  color: red;
}

p.special,
p:first-child {
  color: red;
}

nav :link,
nav :visited {
  background-color: #ff0;
}

[frame="hsides"],
[frame="Hsides"],
[frame="hSides"],
[frame="HSides"],
[frame="hsIdes"],
[frame="HsIdes"],
[frame="hSIdes"],
[frame="HSIdes"],
[frame="hsiDes"],
[frame="HsiDes"],
[frame="hSiDes"],
[frame="HSiDes"],
[frame="hsIDes"],
[frame="HsIDes"],
[frame="hSIDes"],
[frame="HSIDes"],
[frame="hsidEs"],
[frame="HsidEs"],
[frame="hSidEs"],
[frame="HSidEs"],
[frame="hsIdEs"],
[frame="HsIdEs"],
[frame="hSIdEs"],
[frame="HSIdEs"],
[frame="hsiDEs"],
[frame="HsiDEs"],
[frame="hSiDEs"],
[frame="HSiDEs"],
[frame="hsIDEs"],
[frame="HsIDEs"],
[frame="hSIDEs"],
[frame="HSIDEs"],
[frame="hsideS"],
[frame="HsideS"],
[frame="hSideS"],
[frame="HSideS"],
[frame="hsIdeS"],
[frame="HsIdeS"],
[frame="hSIdeS"],
[frame="HSIdeS"],
[frame="hsiDeS"],
[frame="HsiDeS"],
[frame="hSiDeS"],
[frame="HSiDeS"],
[frame="hsIDeS"],
[frame="HsIDeS"],
[frame="hSIDeS"],
[frame="HSIDeS"],
[frame="hsidES"],
[frame="HsidES"],
[frame="hSidES"],
[frame="HSidES"],
[frame="hsIdES"],
[frame="HsIdES"],
[frame="hSIdES"],
[frame="HSIdES"],
[frame="hsiDES"],
[frame="HsiDES"],
[frame="hSiDES"],
[frame="HSiDES"],
[frame="hsIDES"],
[frame="HsIDES"],
[frame="hSIDES"],
[frame="HSIDES"] {
  border-style: solid none;
}
```

### Media Queries (`postcss-custom-media`, `postcss-media-minmax`)

Media queries should be written with `min-width` and `max-width` but it leads to unclear declarations.

With custom media queries, and query ranges, it's much easier to write.

```css
/* Before */

@media (width >= 500px) and (width <= 1200px) {
  /* your styles */
}

/* or coupled with custom media queries */
@custom-media --medium-screen (width < 500px) or (width > 1200px);

@media (--medium-screen) {
  /* your styles */
}

/* After */

@media (min-width: 500px) and (max-width: 1200px) {
  /* your styles */
}

/* or coupled with custom media queries */
@media (max-width: 499px) or (min-width: 1201px) {
  /* your styles */
}
```

## Fallbacks

Browsers have the tendency to do everything their way, either with vendor prefixes or by using a custom syntax no other browser supports. These plugins make it easy for you.

### Vendor Prefixes (`autoprefixer`)

Tired of having to look for what prefix to use in your CSS ?
You don't need this anymore!
With **Autoprefixer** this is all done for you.
You can write your CSS following the W3C standards and Autoprefixer will handle the rest for you

```css
/* Before */

:fullscreen a {
  display: flex;
}

/* After */

:-webkit-full-screen a {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
:-moz-full-screen a {
  display: flex;
}
:-ms-fullscreen a {
  display: -ms-flexbox;
  display: flex;
}
:fullscreen a {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
```

### Browser support (`postcss-font-family-system-ui`, `postcss-pseudoelements`, `postcss-replace-overflow-wrap`, `postcss-filter-gradient`, `postcss-font-variant`)

Some ways of writing CSS are compatible with modern browsers but not with older ones.
These plugins ensure some properties include a fallback.

They are enabled if your target browsers need those fixes.

```css
/* Before */

body {
  font-family: system-ui;
}

.button::before {
  content: attr(href);
}

.foo {
  overflow-wrap: break-word;
}

.buy {
  background: linear-gradient(to bottom, #1e5799, #7db9e8);
}

h2 {
  font-variant-caps: small-caps;
}

table {
  font-variant-numeric: lining-nums;
}

/* After */

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;
}

.button:before {
  content: attr(href);
}

.foo {
  word-wrap: break-word;
}

.buy {
  background: linear-gradient(to bottom, #1e5799, #7db9e8);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff1e5799", endColorstr="#ff7db9e8", GradientType=0);
}

h2 {
  font-feature-settings: "smcp";
  font-variant-caps: small-caps;
}

table {
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
}
```
