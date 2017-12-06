[TOC]

### Update your project's `pom.xml`

Add the version variable `sq-web-assets.version`

In the `<build><plugins>` section, add the following configuration:

```xml
<!-- Gulp Frontend -->
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>1.6</version>

    <configuration>
        <workingDirectory>src/main/frontend</workingDirectory>
        <environmentVariables>
            <!-- Avoid certificates issues, needed behind a corporate proxy -->
            <NODE_TLS_REJECT_UNAUTHORIZED>0</NODE_TLS_REJECT_UNAUTHORIZED>
        </environmentVariables>
    </configuration>

    <executions>
        <execution>
            <id>install node and yarn</id>
            <goals>
                <goal>install-node-and-yarn</goal>
            </goals>
            <configuration>
                <nodeVersion>v6.11.4</nodeVersion>
                <yarnVersion>v1.1.0</yarnVersion>
            </configuration>
        </execution>

        <execution>
            <id>yarn install</id>
            <goals>
                <goal>yarn</goal>
            </goals>
            <configuration>
                <arguments>install --dist-url="${maven-frontend.nodeDownloadRoot}"</arguments>
            </configuration>
        </execution>

        <execution>
            <id>yarn build</id>
            <goals>
                <goal>yarn</goal>
            </goals>
            <configuration>
                <arguments>run build</arguments>
            </configuration>
        </execution>
    </executions>
</plugin>
<!-- End Gulp Frontend -->
```

> As you can see, we prefer to use **Yarn** in this configuration as it's faster
> than NPM. Both are are interchangeable in that matter, you can choose the one
> you prefer.

## `package.json`

in `src/main/frontend/package.json` add:

```json
{
  "name": "maven-frontend",
  "version": "1.0.0",
  "scripts": {
    "run": "crafty run",
    "watch": "crafty watch"
  }
}
```

## `.hgignore`

add this to your `.hgignore`

```ignore
# Frontend plugins
src/main/frontend/node/**
src/main/frontend/node_modules/**
```

> This applies to Git as well, but the file name would be `.gitignore`

## Next

The next step is to
[add your presets and bundles](Create_a_configuration_file.md)
