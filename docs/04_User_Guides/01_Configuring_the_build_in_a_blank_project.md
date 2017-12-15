[TOC]

## `package.json`

in `package.json` add:

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "run": "crafty run",
    "watch": "crafty watch"
  }
}
```

## `.gitignore`

add this to your `.gitignore`

```ignore
node_modules/**
```

> This applies to Mercurial as well, but the file name would be `.hgignore`

## Next

The next step is to
[add your presets and bundles](Create_a_configuration_file.md)
