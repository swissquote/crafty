<table>
<tr><th>Compatible Runners</th><td>

Works with any runner

</td></tr>
<tr><th>Linters</th><td>

N/A

</td></tr>
<tr><th>Commands</th><td>

N/A

</td></tr>
</table>

[TOC]

## Description

This preset allows you to use crafty within a Maven build (with
`frontend-maven-plugin`). This will discover you `pom.xml` and get the right
folder in `target` for you.

You can use it either with **Webjars** or **Webapps**.

## Installation

```bash
npm install @swissquote/crafty-preset-maven --save
```

```javascript
module.exports = {
  presets: ["@swissquote/crafty-preset-maven"],
  mavenType: "webapp" // or "webjar"
};
```

## Usage

The destination directory is calculated using `crafty-preset-maven` and the
`mavenType` option.

You can set the destination path manually but it's recommended to change the
`mavenType` of your bundle to either `webapp` or `webjar` instead.

This is the default for each:

- `webapp`: `${project.build.directory}/${project.build.finalName}/resources`
- `webjar`: `${project.build.outputDirectory}/META-INF/resources/webjars`

This preset's role is to replace `config.destination` which is used to create
the destination for each `bundleType` (`destination_js`, `destination_css` ...)

### Example

If we take the following configuration:

```xml
module.exports = {
    presets: [
        "@swissquote/preset-maven",
        "@swissquote/crafty-preset-babel",
        "@swissquote/crafty-runner-rollup"
    ],
    mavenType: "webjar",
    js: {
        library: {
            source: 'js/index.js',
        }
    }
}
```

The path of the final file will be :

```
                                                       ↓ "js" or "css" is added depending on bundle type
<maven_root>/target/classes/META-INF/resources/webjars/js/library.min.js
             ↑ Default path for webjars                   ↑ Inferred from the bundle name
```

### Override destination with an environment variable

If your build is running from within Maven, it's pointless to re-calculate the
destination path, you can pass it using the `TARGET_BASEDIR` environment
variable.

This is how to do it in `frontend-maven-plugin`

```xml
<plugin>
   <artifactId>frontend-maven-plugin</artifactId>
   ...
   <configuration>
      ...
      <environmentVariables>
         ...
         <!-- This values is for webapps -->
         <TARGET_BASEDIR>${project.build.directory}/${project.build.finalName}</TARGET_BASEDIR>

         <!-- This value is for webjars -->
         <TARGET_BASEDIR>${project.build.outputDirectory}</TARGET_BASEDIR>
      </environmentVariables>
   </configuration>

   ...
</plugin>
```

## Options

| Option      | Type   | Optional ? | Description                                                      |
| ----------- | ------ | ---------- | ---------------------------------------------------------------- |
| `mavenType` | String | No         | Must be `"webjar"` or `"webapp"` decides where to put the files. |
