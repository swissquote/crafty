const postcss = require("postcss");
const { isSupported } = require("caniuse-api");

const libraryFeatures = require("./features");
const featuresActivationMap = require("./features-activation-map");

const plugin = postcss.plugin("postcss-cssnext", (options) => {
  options = {
    console: console,
    features: {},
    // options.browsers is deliberately undefined by default to inherit
    // browserslist default behavior
    ...options,
  }

  const features = options.features

  // propagate browsers option to plugins that supports it
  const pluginsToPropagateBrowserOption = [ "rem" ]
  pluginsToPropagateBrowserOption.forEach((name) => {
    const feature = features[name]

    if (feature !== false) {
      features[name] = {
        browsers: (
          feature && feature.browsers
          ? feature.browsers
          : options.browsers
        ),
        ...(feature || {}),
      }
    }
  })

  const processor = postcss()

  // features
  Object.keys(libraryFeatures).forEach(key => {
    // feature is auto enabled if: not disable && (enabled || no data yet ||
    // !supported yet)
    if (
      // feature is not disabled
      features[key] !== false &&
      (
        // feature is enabled
        features[key] === true ||

        // feature don't have any browsers data (yet)
        featuresActivationMap[key] === undefined ||

        // feature is not yet supported by the browsers scope
        (
          featuresActivationMap[key] &&
          featuresActivationMap[key][0] &&
          !isSupported(featuresActivationMap[key][0], options.browsers)
        )
      )
    ) {
      const plugin = libraryFeatures[key](
        typeof features[key] === "object"
          ? { ...features[key] }
          : undefined
        )
      processor.use(plugin)
    }
  })

  return processor
})

// es5/6 support
plugin.features = libraryFeatures

module.exports = plugin
