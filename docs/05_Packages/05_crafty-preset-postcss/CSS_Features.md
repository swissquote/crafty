
__Postcss__ is a CSS Parser that can be extended with plugins.
We made a selection of plugins useful for Swissquote.
Here are some features made possible by them.

[TOC]

## All plugins

All included plugins have a short example accompanying them below.

| Plugin                         | Meta-plugin     | Description                               |
|--------------------------------|-----------------|-------------------------------------------|
| postcss-assets                 |                 | Embed images & size functions             |
| postcss-filter-gradient        |                 | Gradient fallback for IE9                 |
| postcss-import                 |                 | Import files                              |
| postcss-scss                   |                 | Inline comments support                   |
| postcss-url                    |                 | Rebase urls after import                  |
| postcss-mixins                 |                 | Sass-like mixins                          |
| postcss-advanced-variables     |                 | Sass-like variables and methods           |
| postcss-nested                 |                 | Sass-like nested selectors                |
| postcss-atroot                 |                 | place rules back up to the root           |
| postcss-property-lookup        |                 | reference other property values           |
| autoprefixer                   |                 | Add or remove Vendor prefixes             |
| postcss-csso                   |                 | Minify CSS                                |
| postcss-calc                   | postcss-cssnext | Resolves calculations                     |
| postcss-color-function         | postcss-cssnext | W3C color methods                         |
| postcss-color-gray             | postcss-cssnext | Shades of gray                            |
| postcss-color-hex-alpha        | postcss-cssnext | `#rrggbbaa` colors                        |
| postcss-color-hwb              | postcss-cssnext | `hwb()` color function                    |
| postcss-color-rebeccapurple    | postcss-cssnext | Adds the `rebbeccapurple` color           |
| postcss-color-rgba-fallback    | postcss-cssnext | Add an RGB fallback to RGBA colors        |
| postcss-custom-media           | postcss-cssnext | W3C custom media queries                  |
| postcss-custom-properties      | postcss-cssnext | W3C custom variables                      |
| postcss-custom-selectors       | postcss-cssnext | W3C custom selectors                      |
| postcss-font-variant           | postcss-cssnext | Transformed to `font-feature-settings`    |
| postcss-initial                | postcss-cssnext | Use initial value for a property          |
| postcss-media-minmax           | postcss-cssnext | W3C < <= >= > media queries               |
| postcss-nesting                | postcss-cssnext | W3C nested selectors                      |
| postcss-pseudo-class-any-link  | postcss-cssnext | Allows you to use :any-link pseudo class. |
| postcss-pseudoelements         | postcss-cssnext | Adjust `::` to `:`                        |
| postcss-replace-overflow-wrap  | postcss-cssnext | Converts `overflow-wrap` to `word-wrap`   |
| postcss-selector-matches       | postcss-cssnext | W3C multiple matches pseudo-classes       |
| postcss-selector-not           | postcss-cssnext | W3C multiple not pseudo-classes           |

## Organisation

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

With `@import`, you can import your css files to create a single CSS output file.
All relative links are rebased when imported.

```css

/* Before */

/** foo.scss **/

body { background: #eee; }

/** media/bar.scss **/

.button {
    background: url("../../images/buttons/background.png");
}

/** style.scss **/

@import "foo.scss";
@import "media/bar.scss" (min-width: 25em);

/* After */

body { background: #eee; }

@media (min-width: 25em) {
    .button {
        background: url("../images/buttons/background.png"); /* the path has been rebased */
    }
}

```

### Mixins (`postcss-mixins`)

`@define-mixin` allows to create Sass style mixins.

```css
/* Before */

@define-mixin icon $name {
    padding-left: 16px;

    &::after {
        content: "";
        background: url(/icons/$(name).png);
    }
}

.search {
    @mixin icon search;
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

1. Sass style variables : `$variable`
1. Css properties (Official specification): `--variable`

Sass style variables are provided as a compatibility layer.
It is recommended to use the CSS properties as they are future proof and will be natively supported in browsers in the future.

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
  background: inline('background.png'); /* use only on small files */
}

.button {
  background: resolve('foobar.jpg');
  background: resolve('icons/baz.png');
  width: width('foobar.png');
  height: height('foobar.png');
  background-size: size('foobar.png');
}

/* After */

body {
  background: url(data:image/gif;base64,...);
}

.button {
  background: url('../images/foobar.jpg?14a931c501f');
  background: url('../images/icons/baz.png?14a931c501f');
  width: 320px;
  height: 240px;
  background-size: 320px 240px;
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
    margin-bottom: 24px
}

```

### Conditionals (`postcss-advanced-variables`)

```css
/* Before */

.notice--clear {
    @if 3 < 5 {
        background: green;
    }
    @else {
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
        background: url('icons/$(icon).png');
    }
}

@for $i from 1 to 3 {
    .b-$i { width: $(i)px; }
}

/* After */

.icon-foo {
    background: url('icons/foo.png');
}

.icon-bar {
    background: url('icons/bar.png');
}

.icon-baz {
    background: url('icons/baz.png');
}

.b-1 {
    width: 1px
}
.b-2 {
    width: 2px
}
.b-3 {
    width: 3px
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
    background: transparent none repeat 0 0/auto auto padding-box border-box scroll;
    background: initial;
    white-space: normal;
}

```

### Colors (`postcss-color-function`, `postcss-color-gray`, `postcss-color-hex-alpha`, `postcss-color-hwb`, `postcss-color-rebeccapurple`, `postcss-color-rgba-fallback`)

#### Color Fallbacks

Many colors functions don't work in all browsers, these plugins will create fallbacks.

`rebeccapurple` is a whole different story, it's an homage to [Eric Meyer's daughter](https://github.com/postcss/postcss-color-rebeccapurple#why-this-plugin-).

```css
/* Before */

blockquote {
    background: rgba(153, 221, 153, 0.8);   // This will create a fallback without the alpha

    border-color: #9d9c;                    // This will be transformed to rgba

    color: rebeccapurple;                   // ... sad story, homage to eric meyer
}

/* After */

blockquote {
    background: #9d9;
    background: rgba(153,221,153,.8);

    border-color: #9d9;
    border-color: rgba(153,221,153,.8);

    color: #639;
}

```

#### Color manipulation

You can modify a color by applying modifiers.
Apart from the few presented here, there are [a lot of modifiers](https://github.com/postcss/postcss-color-function#list-of-color-adjuster) available

```css
/* Before */

a {
    color: color(red alpha(-10%));      // Change the opacity of red
}

a:hover {
    color: color(red blackness(80%));   // Darken the color
}

body {
    color: hwb(90, 0%, 0%, 0.6);        // This will be transformed to rgba
}

/* After */

a {
    color:red;
    color: rgba(255,0,0,.9);
}

a:hover {
    color: #300;
}

body {
    color:#80ff00;
    color: rgba(128,255,0,.6);
}

```

#### Levels of gray

You can also easily get levels of gray.

```css
/* Before */

p {
    color: gray(85);            // Level of gray

    background: gray(10%, 50%); // Level of gray with opacity
}


/* After */

p {
    color: #555;

    background:#1a1a1a;
    background: rgba(26,26,26,.5);
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

/* After */

.button, button {
    /* styles for your buttons */
}

.button:focus, .button:hover, button:focus, button:hover {
    /* hover/focus styles for your button */
}

p:not(:first-child):not(.special) {
    color: red;
}

p.special, p:first-child {
    color: red;
}

nav :link, nav :visited {
    background-color: #ff0;
}

```

| postcss-selector-matches       | postcss-cssnext | W3C multiple matches pseudo-classes       |
| postcss-selector-not           | postcss-cssnext | W3C multiple not pseudo-classes           |
| postcss-pseudo-class-any-link  | postcss-cssnext | Allows you to use :any-link pseudo class. |
| postcss-custom-selectors       | postcss-cssnext | W3C custom selectors                      |

### Media Queries (`postcss-custom-media`, `postcss-media-minmax`)

Normally, media queries should be written with `min-width` and `max-width` but leads to quite unclear declarations.

With custom media queries, and query ranges, it's much easier to write.

```css

/* Before */

@media (width >= 500px) and (width <= 1200px) {
    /* your styles */
}

/* or coupled with custom media queries */
@custom-media --only-medium-screen (width < 500px) or (width > 1200px);

@media (--only-medium-screen) {
    /* your styles */
}

/* After */

@media (min-width:500px) and (max-width:1200px) {
    /* your styles */
}

/* or coupled with custom media queries */
@media (max-width:499px) or (min-width:1201px) {
    /* your styles */
}

```

## Fallbacks

Browsers have the tendency to do things their way, either with vendor prefixes or by using a custom syntax no other browser supports. These plugins make it easy for you.

### Vendor Prefixes (`autoprefixer`)

Tired of having to look for what prefix to use in your css ?
You don't need this anymore!
With __Autoprefixer__ this is all done for you.
You can simply write your CSS following the W3C standards and autoprefixer will handle the rest for you

```css
/* Before */

:fullscreen a {
    display: flex
}

/* After */

:-webkit-full-screen a {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex
}
:-moz-full-screen a {
    display: flex
}
:-ms-fullscreen a {
    display: -ms-flexbox;
    display: flex
}
:fullscreen a {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}
```

### Browser support (`postcss-pseudoelements`, `postcss-replace-overflow-wrap`, `postcss-filter-gradient`, `postcss-font-variant`)

Some ways of writing CSS are compatible with modern browsers but not with older ones.
These plugins ensure some propreties include a fallback.

They are only enabled if your target browsers are concerned by these syntaxes

```css
/* Before */

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

.button:before {
    content: attr(href);
}

.foo {
    word-wrap: break-word;
}

.buy {
    background: linear-gradient(to bottom, #1e5799, #7db9e8);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff1e5799', endColorstr='#ff7db9e8', GradientType=0);
}

h2 {
    font-feature-settings: "c2sc";
    font-variant-caps: small-caps;
}

table {
    font-feature-settings: "lnum";
    font-variant-numeric: lining-nums;
}
```
