**PostCSS** is a CSS Parser that supports plugins.
We made a selection of plugins useful for Swissquote, and here are some features made possible by them.

[TOC]

# CSS Cascading and Inheritance Level 3

## `all` Property

A property for defining the reset of all properties of an element.

```css
/* Before */
a {
  all: initial;
}


/* After */
a {
  -webkit-backface-visibility: visible;
  backface-visibility: visible;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: none;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  caption-side: top;
  clear: none;
  clip: auto;
  color: #000;
  columns: auto;
  column-count: auto;
  column-fill: balance;
  column-rule: medium none currentColor;
  column-span: 1;
  column-width: auto;
  content: normal;
  counter-increment: none;
  counter-reset: none;
  cursor: auto;
  direction: ltr;
  empty-cells: show;
  float: none;
  font-variant: normal;
  height: auto;
  -ms-hyphens: none;
  hyphens: none;
  letter-spacing: normal;
  max-height: none;
  max-width: none;
  min-height: 0;
  min-width: 0;
  opacity: 1;
  orphans: 2;
  outline: medium none invert;
  page-break-after: auto;
  page-break-before: auto;
  page-break-inside: auto;
  -webkit-perspective: none;
  perspective: none;
  -webkit-perspective-origin: 50%;
  perspective-origin: 50%;
  -moz-tab-size: 8;
  tab-size: 8;
  table-layout: auto;
  text-align: left;
  text-align-last: auto;
  text-indent: 0;
  text-shadow: none;
  text-transform: none;
  transform-origin: 50% 50% 0;
  -webkit-transform-style: flat;
  transform-style: flat;
  unicode-bidi: normal;
  vertical-align: baseline;
  visibility: visible;
  white-space: normal;
  widows: 2;
  width: auto;
  word-spacing: normal;
  z-index: auto;
  all: initial;
  background: none;
  -webkit-border-image: ;
  -moz-border-image: ;
  border-image: ;
  -webkit-border-radius: 0;
  border-radius: 0;
  border: none;
  column-gap: normal;
  margin: 0;
  padding: 0;
  font-family: serif;
  font-size: medium;
  font-style: normal;
  font-weight: normal;
  font-stretch: normal;
  line-height: normal;
  text-decoration: none;
  list-style: disc;
  -webkit-transition: none;
  -moz-transition: none;
  transition: none;
  -webkit-animation: none;
  animation: none;
  display: inline;
  position: static;
  top: auto;
  bottom: auto;
  left: auto;
  right: auto;
  overflow: visible;
  -webkit-transform: none;
  -moz-transform: none;
  transform: none;
}

```

## `initial` Value

Reset a property to its initial value.

```css
/* Before */
a {
  background: initial;
  white-space: initial;
  animation: initial;
}


/* After */
a {
  background: none;
  background: initial;
  white-space: normal;
  white-space: initial;
  -webkit-animation: initial;
  animation: initial;
}

```

# CSS Color Module Level 4

## Hexadecimal Alpha Notation

A 4 & 8 character hex color notation for specifying the opacity level

```css
/* Before */
blockquote {
  border-color: #9d9c;
}

/* After */
blockquote {
  border-color: rgba(153, 221, 153, .8);
}

```

## hsl() Function

A function for specifying colors by hue, saturation and lightness to mix into it

```css
/* Before */
.Quote--clear {
  color: hsl(200grad 100% 50% / 20%);
  background-color: hsla(200grad, 100%, 50%, 0.2);
}


/* After */
.Quote--clear {
  color: rgba(0, 255, 255, .2);
  background-color: rgba(0, 255, 255, .2);
}

```

## HWB Color

A function for specifying colors by hue and then a degree of whiteness and blackness to mix into it

```css
/* Before */
p {
  /* Colors Level 4 syntax */
  color: hwb(120 44% 50%);
  /* Legacy syntax */
  border-color: hwb(90, 0%, 0%, 0.5);
}


/* After */
p {
  color: #708070;
  border-color: rgba(128, 255, 0, .5);
}

```

## Color Functional Notation

A space and slash separated notation for specifying colors

```css
/* Before */
.Quote--clear {
  background: rgb(250.5 255 255);
}


/* After */
.Quote--clear {
  background: #fbffff;
}

```

## rebeccapurple Color

A particularly lovely shade of purple in memory of Rebecca Alison Meyer

```css
/* Before */
html {
  color: rebeccapurple;
}


/* After */
html {
  color: #639;
}

```

# CSS Custom Properties for Cascading Variables Module Level 1

## Custom Properties

A syntax for defining custom values accepted by all CSS properties

```css
/* Before */
:root {
  --color: #f00;
}

.menu_link {
  color: var(--color);
}


/* After */
.menu_link {
  color: red;
}

```

# CSS Extensions

## Custom Selectors

An at-rule for defining aliases that represent selectors

```css
/* Before */
@custom-selector :--button button, .button;
@custom-selector :--enter :hover, :focus;

:--button {
    color: blue;
}
:--button:--enter {
    color: red;
}


/* After */
button, .button {
  color: #00f;
}

button:hover, button:focus, .button:hover, .button:focus {
  color: red;
}

```

# CSS Fonts Module Level 3

## font-variant Property

A property for defining the usage of alternate glyphs in a font

```css
/* Before */
h2 {
  font-variant-caps: small-caps;
}

table {
  font-variant-numeric: lining-nums;
}


/* After */
h2 {
  font-feature-settings: "smcp";
  font-variant-caps: small-caps;
}

table {
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
}

```

# CSS Fonts Module Level 4

## system-ui value for font-family

A generic font used to match the user’s interface

```css
/* Before */
body {
  font-family: system-ui;
}


/* After */
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue;
}

```

# CSS Image Values and Replaced Content Module Level 4

## image-set() Function

A function for specifying image sources based on the user’s resolution

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

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .BigImage {
    background-image: url(img/test-2x.png);
  }
}

@media (-webkit-min-device-pixel-ratio: 6.25), (min-resolution: 600dpi) {
  .BigImage {
    background-image: url(my-img-print.png);
  }
}

```

# CSS Logical Properties and Values Level 1

## Logical Properties and Values

Flow-relative (left-to-right or right-to-left) properties and values

```css
/* Before */
.Banner {
  float: inline-start;
  padding-inline: 20px 40px;
}


/* After */
.Banner {
  float: inline-start;
  padding-left: var(--ltr, 20px) var(--rtl, 40px);
  padding-right: var(--ltr, 40px) var(--rtl, 20px);
}

[dir="ltr"] {
  --ltr: initial;
  --rtl: ;
}

[dir="rtl"] {
  --ltr: ;
  --rtl: initial;
}

```

# CSS Text Module Level 3

## `overflow-wrap` Property

A property for defining whether to insert line breaks within words to prevent overflowing

```css
/* Before */
.foo {
  overflow-wrap: break-word;
}


/* After */
.foo {
  word-wrap: break-word;
}

```

# Media Queries Level 4

## Media Query Ranges

A syntax for defining media query ranges using ordinary comparison operators

```css
/* Before */
@media (width >= 500px) and (width <= 1200px) {
  .foo {}
}


/* After */
@media (min-width: 500px) and (max-width: 1200px) {
  .foo {
  }
}

```

# Media Queries Level 5

## Custom Media Queries

An at-rule for defining aliases that represent media queries

```css
/* Before */
@custom-media --medium-screen (width < 500px) or (width > 1200px);

@media (--medium-screen) {
  .foo {
  }
}


/* After */
@media (max-width: 499.999px) or (min-width: 1200px) {
  .foo {
  }
}

```

# Misc

## Automatic Vendor Prefixes

Depending on the list of target browsers, automatically adds (and removes) vendor prefixes.

```css
/* Before */
:fullscreen a {
  display: flex;
}

.foo {
  flex-direction: row;
}


/* After */
:fullscreen a {
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.foo {
  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  -webkit-box-direction: normal;
  -moz-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
}

```

## Assets

Get image sizes and inlines files

```css
/* Before */
body {
  background: inline(
    "./images/icons/clock.png"
  ); /* Be careful to not use this on big files */
}

.button {
  /*
   * relative paths or non-absolute paths are
   * resolved relative to the current files
   * and relative to the "images" directory
   */
  width: width("./images/some/button.png");
  height: height("./images/some/button.png");
  background-image: resolve("./images/icons/comment.png");
  background-size: size("./images/some/button.png");
}


/* After */
body {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMESURBVDjLXZNrSFNxGMYPgQQRfYv6EgR9kCgKohtFgRAVQUHQh24GQReqhViWlVYbZJlZmZmombfVpJXTdHa3reM8uszmWpqnmQuX5drmLsdjenR7ev9DR3Xgd3h43+d5/pw/HA4AN9zITSPUhJ14R0xn87+h2ZzJvZVInJpzAQOXQOQMt+/5rvhMCLXv9Vjrt1rSXitmwj+Jua1+Ox+2HfGNdGf6yW8l5sUKPNVcRsiaPDA22Ahv6/7Ae/0aKdviQ0G7B/c6f8Zg+gbfh079Mjno0MhS58lflOsgEjh3BXc+bM/0DzbvDwj314znt/bjof0HdPw3FBq6kP+oCxVNfdDZvqPsrQmf6zdFRtyPJgbrFoqUTeS+FnPrekpmiC2lS+QcUx+qrf0wmFzodYfgC0nwhoYh9oegfdmLsmYXHj7JhV23erS7ZNYHyibGLiLtXsO19BoHSiwu6Ok09gwFg/gy8BO/STOkKFBk7EWh2YkLeh5Hy4Ws2B2w157iDvOpxw4UPRPRTSfL41FIsow7ZeXwUFF4dBQ1L96A/xLEFf1HMC/LxAt25PH+VN0HXH1gh2dEwdBoBGO0OKvW4L7hCdIvavBSsMIRVHCi0ArmZZl4wbYrz/yHSq1Ql9vQLylUEoE7GMal3OuxMG/7CO848N6n4HheK5iXZeIFmy88Nu+8aYJG24G3ziB+0Ee7wwqemlvQ5w9hcAJwyUDtpwBOFLeBeVkmXpB0qlK9RV2HlLsCsvUivHRhQwoQjhCkA1TgJX1OK0JVzIN5WSZesPZ44XKia+P5BqSS4aq+BzZXABLdhyQrsJPOqv4MVcEbMA/zsky8gLHyYO7hI9laecOZWuzLfYXU2zzSblmQerMZqjwTknOeY9dlIw5kVcrMG/8XpoQgCEkOhwNNJn5i7bFSrFDpsCrFEIPpLacr0WxpibYIQpS86/8pMBqNswnJ6XSivqHBv3R3pmbxzgwz4Z+EaTXtwqIogrzjxIJ4QVVV1UyihxgjFv3/K09Bu/lEkBgg5rLZH+fT5dvfn7iFAAAAAElFTkSuQmCC);
}

.button {
  width: 68px;
  height: 34px;
  background-image: url(images/icons/comment.png?17f6b2eee3b);
  background-size: 68px 34px;
}

```

## Imports

With `@import`, you can import your CSS files to create a single CSS output file. All relative links are updated when they are imported.

```css
/* Before */
@import "foo.css";
@import "media/bar.css" (min-width: 25em);

/* After */
body {
  background: #eee;
}

@media (min-width: 25em) {
  .button {
    background: url(../images/buttons/background.png);
  }
}

```

## Property lookup

Reference property values without a variable.

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

# Scss

## @at-root Rule

The @at-root causes one or more rules to be emitted at the root of the document, rather than being nested beneath their parent selectors

```css
/* Before */
.parent {
  .before {
    color: #333;
  }

  @at-root {
    .child {
      background: black;
    }
  }
}


/* After */
.child {
  background: #000;
}

.parent .before {
  color: #333;
}

```

## Nesting Rules

A syntax for nesting relative rules within rules. This is NOT the official CSS syntax as `&` is implicit in this syntax.

```css
/* Before */
.parent {
  background: white;

  .before {
    color: #333;
  }

  .after {
    color: #eee;
  }
}


/* After */
.parent {
  background: #fff;
}

.parent .before {
  color: #333;
}

.parent .after {
  color: #eee;
}

```

## Mixins

Create reusable mixins

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

.search:after {
  content: "";
  background: url(/icons/search.png);
}

```

## Variables

Prefer using Custom Properties, kept only for backwards compatibilty

```css
/* Before */
$blue: #056ef0;
$column: 200px;

.menu {
  width: calc(4 * $column);
}

.menu_link {
  background: $blue;
  width: $column;
}


/* After */
.menu {
  width: 800px;
}

.menu_link {
  width: 200px;
  background: #056ef0;
}

```

## Loops

Iterate on variables

```css
/* Before */
@each $icon in (foo, bar, baz) {
  .icon-$(icon) {
    background: url("icons/$(icon).png");
  }
}

@for $i from 1 to 3 {
  .b-$i {
    width: #{$i}px;
  }
}


/* After */
.icon-foo {
  background: url(icons/foo.png);
}

.icon-bar {
  background: url(icons/bar.png);
}

.icon-baz {
  background: url(icons/baz.png);
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

## Conditionals

Conditions to use with your

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

## Single line comments

A shorter syntax for comments

```css
/* Before */
// single line comment
.button {
  color: orange;
}


/* After */
.button {
  color: orange;
}

```

# Selectors Level 4

## :any-link Hyperlink Pseudo-Class

A pseudo-class for matching anchor elements independent of whether they have been visited

```css
/* Before */
nav :any-link {
  background-color: yellow;
}


/* After */
nav :link, nav :visited {
  background-color: #ff0;
}

nav :-moz-any-link {
  background-color: #ff0;
}

nav :any-link {
  background-color: #ff0;
}

```

## Case-Insensitive Attributes

An attribute selector matching attribute values case-insensitively

```css
/* Before */
[frame="hsides" i] {
  border-style: solid none;
}


/* After */
[frame="hsides"], [frame="Hsides"], [frame="hSides"], [frame="HSides"], [frame="hsIdes"], [frame="HsIdes"], [frame="hSIdes"], [frame="HSIdes"], [frame="hsiDes"], [frame="HsiDes"], [frame="hSiDes"], [frame="HSiDes"], [frame="hsIDes"], [frame="HsIDes"], [frame="hSIDes"], [frame="HSIDes"], [frame="hsidEs"], [frame="HsidEs"], [frame="hSidEs"], [frame="HSidEs"], [frame="hsIdEs"], [frame="HsIdEs"], [frame="hSIdEs"], [frame="HSIdEs"], [frame="hsiDEs"], [frame="HsiDEs"], [frame="hSiDEs"], [frame="HSiDEs"], [frame="hsIDEs"], [frame="HsIDEs"], [frame="hSIDEs"], [frame="HSIDEs"], [frame="hsideS"], [frame="HsideS"], [frame="hSideS"], [frame="HSideS"], [frame="hsIdeS"], [frame="HsIdeS"], [frame="hSIdeS"], [frame="HSIdeS"], [frame="hsiDeS"], [frame="HsiDeS"], [frame="hSiDeS"], [frame="HSiDeS"], [frame="hsIDeS"], [frame="HsIDeS"], [frame="hSIDeS"], [frame="HSIDeS"], [frame="hsidES"], [frame="HsidES"], [frame="hSidES"], [frame="HSidES"], [frame="hsIdES"], [frame="HsIdES"], [frame="hSIdES"], [frame="HSIdES"], [frame="hsiDES"], [frame="HsiDES"], [frame="hSiDES"], [frame="HSiDES"], [frame="hsIDES"], [frame="HsIDES"], [frame="hSIDES"], [frame="HSIDES"] {
  border-style: solid none;
}

```

## `:not()` Negation List Pseudo-Class

A pseudo-class for ignoring elements in a selector list

```css
/* Before */
p:not(:first-child, .special) {
    color: red;
  }

/* After */
p:not(:first-child):not(.special) {
  color: red;
}

```

## :dir Directionality Pseudo-Class

A pseudo-class for matching elements based on their directionality

```css
/* Before */
blockquote:dir(rtl) {
  margin-right: 10px;
}

blockquote:dir(ltr) {
  margin-left: 10px;
}


/* After */
[dir="rtl"] blockquote {
  margin-right: 10px;
}

[dir="ltr"] blockquote {
  margin-left: 10px;
}

```

# Superseded specifications


Examples in this categories are Syntaxes for specifications that were abandoned
## `:matches()` Matches-Any Pseudo-Class

A pseudo-class for matching elements in a selector list. Syntax is now `:is()`

```css
/* Before */
p:matches(:first-child, .special) {
  color: red;
}


/* After */
p:first-child, p.special {
  color: red;
}

```

## color() and color-mod() Color manipulation

Modify colors using the `color-mod()` function in CSS. Might come back as `color-mix()` in the future

```css
/* Before */
a {
  color: color(red alpha(-10%));
}

a:hover {
  color: color-mod(red blackness(80%));
}


/* After */
a {
  color: rgba(255, 0, 0, .9);
}

a:hover {
  color: #300;
}

```

## gray() Color function

Create shades of gray

```css
/* Before */
body {
  background-color: gray(100);
  color: gray(0 / 90%);
}


/* After */
body {
  color: rgba(0, 0, 0, .9);
  background-color: #fff;
}

```

