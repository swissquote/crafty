# Snapshot report for `__tests__/crafty-preset-postcss-gulp.js`

The actual snapshot is saved in `crafty-preset-postcss-gulp.js.snap`.

Generated by [AVA](https://avajs.dev).

## Doesn't compile without a task, but lints

> Snapshot 1

    {
      status: 1,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/no-bundle/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__]␊
      ␊
      css/imported.scss␊
       1:1  ✖  Types are allowed only inside a scope  swissquote/no-type-outside-scope␊
      ␊
      css/style.scss␊
        4:1   ✖  Types are allowed only inside a scope                                                                                                                                                                                          swissquote/no-type-outside-scope␊
        6:14  ✖  Unexpected unit                                                                                                                                                                                                                length-zero-no-unit␊
       10:1   ✖  Expected class selector ".notAComponent" to match pattern "/^(_)?(?:(?:u|t|(?:i|ha)?s)+-[a-z$]+[a-zA-Z0-9$()]*|(?:[a-z$][a-zA-Z0-9$()]+-)?[A-Z$][a-zA-Z0-9$()]*(__[a-z0-9$][a-zA-Z0-9$()]*)*(--[a-z0-9$][a-zA-Z0-9$()]*)*)$/"  selector-class-pattern␊
       15:1   ✖  A state must be linked to a component                                                                                                                                                                                          swissquote/no-state-without-component␊
       20:1   ✖  Expected "#no-id" to have no more than 0 ID selectors                                                                                                                                                                          selector-max-id␊
       28:13  ✖  Expected nesting depth to be no more than 2                                                                                                                                                                                    max-nesting-depth␊
       31:6   ✖  Insert "⏎"                                                                                                                                                                                                                     prettier/prettier␊
      ␊
      [__:__:__] 'css__lint' errored after ____ ms␊
      [__:__:__] Failed with 8 errors␊
      [__:__:__] 'default' errored after ____ ms␊
      `,
    }

## Doesn't compile without a task, but lints (doesn't throw in development)

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/no-bundle-dev/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__]␊
      ␊
      css/imported.scss␊
       1:1  ✖  Types are allowed only inside a scope  swissquote/no-type-outside-scope␊
      ␊
      css/style.scss␊
        4:1   ✖  Types are allowed only inside a scope                                                                                                                                                                                          swissquote/no-type-outside-scope␊
        6:14  ⚠  Unexpected unit                                                                                                                                                                                                                length-zero-no-unit␊
       10:1   ✖  Expected class selector ".notAComponent" to match pattern "/^(_)?(?:(?:u|t|(?:i|ha)?s)+-[a-z$]+[a-zA-Z0-9$()]*|(?:[a-z$][a-zA-Z0-9$()]+-)?[A-Z$][a-zA-Z0-9$()]*(__[a-z0-9$][a-zA-Z0-9$()]*)*(--[a-z0-9$][a-zA-Z0-9$()]*)*)$/"  selector-class-pattern␊
       15:1   ✖  A state must be linked to a component                                                                                                                                                                                          swissquote/no-state-without-component␊
       20:1   ✖  Expected "#no-id" to have no more than 0 ID selectors                                                                                                                                                                          selector-max-id␊
       28:13  ✖  Expected nesting depth to be no more than 2                                                                                                                                                                                    max-nesting-depth␊
       31:6   ⚠  Insert "⏎"                                                                                                                                                                                                                     prettier/prettier␊
      ␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

## Fails gracefully on broken markup

> Snapshot 1

    {
      status: 1,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/fails/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/fails/css/style.scss:3:5: Unknown word␊
      ␊
        1 |␊
        2 | .BodyComponent␊
      > 3 |     margin: 0;␊
          |     ^␊
        4 | }␊
        5 |␊
      ␊
      [__:__:__] 'css_myBundle' errored after ____ ms␊
      [__:__:__] 'css' errored after ____ ms␊
      [__:__:__] 'default' errored after ____ ms␊
      `,
    }

## Experiment with all CSS

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/experiment/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] Finished 'css_myBundle' after ____ ms␊
      [__:__:__] Finished 'css' after ____ ms␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

> Snapshot 2

    `.Body {␊
      background: #eee;␊
    }␊
    ␊
    :root {␊
      --Component-margin: 5px;␊
    }␊
    ␊
    .Component {␊
      margin: var(--Component-margin) calc(var(--Component-margin)  * -1);␊
    }␊
    ␊
    @media (min-width: 25em) {␊
      .Button {␊
        background: url(../images/buttons/background.png);␊
      }␊
    }␊
    ␊
    .Child {␊
      background: #000;␊
    }␊
    ␊
    .Parent {␊
      background: #fff;␊
    }␊
    ␊
    .Parent--before {␊
      color: #333;␊
    }␊
    ␊
    .Parent--after {␊
      color: #eee;␊
    }␊
    ␊
    .Card {␊
      background: url(../images/background.jpg?CACHEBUST);␊
    }␊
    ␊
    .Button {␊
      width: 68px;␊
      height: 34px;␊
      background: url(data:image/png;base64,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) 0 0 / 68px 34px;␊
    }␊
    ␊
    :root {␊
      --main-font-size: 16px;␊
    }␊
    ␊
    .Header {␊
      font-size: var(--main-font-size);␊
      font-size: calc(var(--main-font-size)  * 2);␊
      height: calc(100px - 2em);␊
      margin-top: calc(var(--main-font-size)  * 1.5);␊
    }␊
    ␊
    :fullscreen .Link {␊
      display: flex;␊
    }␊
    /*# sourceMappingURL=myBundle.min.css.map */␊
    `

## Experiment with all CSS, old browsers

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/experiment_old_browsers/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] Finished 'css_myBundle' after ____ ms␊
      [__:__:__] Finished 'css' after ____ ms␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__]␊
      ␊
      css/style.scss␊
       58:5  ⚠  Unexpected browser feature "flexbox" is only partially supported by IE 11  plugin/no-unsupported-browser-features␊
      ␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

> Snapshot 2

    `.Body {␊
      background: #eee;␊
    }␊
    ␊
    .Component {␊
      margin: 5px -5px;␊
    }␊
    ␊
    @media (min-width: 25em) {␊
      .Button {␊
        background: url(../images/buttons/background.png);␊
      }␊
    }␊
    ␊
    .Child {␊
      background: #000;␊
    }␊
    ␊
    .Parent {␊
      background: #fff;␊
    }␊
    ␊
    .Parent--before {␊
      color: #333;␊
    }␊
    ␊
    .Parent--after {␊
      color: #eee;␊
    }␊
    ␊
    .Card {␊
      background: url(../images/background.jpg?CACHEBUST);␊
    }␊
    ␊
    .Button {␊
      width: 68px;␊
      height: 34px;␊
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAiCAYAAADmvn/1AAAKnmlDQ1BJQ0MgUHJvZmlsZQAASImVlgdUU9kWhs+96Y0AAaQTehOkCASQXkPvTVRCAiSUEAKh2ZVBBcaCiggqgkgRBUelyFixYGFQUMA+IIOCOg4WsKDyLvAI7731Zr31dtbO+dZe+/zZ9+SetX4AyF0sgSAZlgQghZ8hDPJwpkdERtFxQwACGIAHEkCKxU4XOAUE+IC/jcl+pBuJe0YzWn/f919DihOXzgYACkA4lpPOTkH4zEyyBcIMAFBcpK6ZlSGY4SKEZYTIgAgfnuGEOT4zw7FzfGO2JyTIBeEnAODJLJYwAQDSKFKnZ7ITEB0yHmETPofHR5iBsD2by+IgnI3w4pSU1BmuRlgv9l90Ev5NM1asyWIliHnuWWYD78pLFySzcv7P4/jfkZIsmv8NDSTJXKFn0MyKnFldUqq3mPmxfv7zzOPM9s8yV+QZOs/sdJeoeeawXL3nWZQU6jTPLOHCXl4GM2SehalBYv24dLdgsX4c00c8Q7KfmON57sx5zuWGhM9zJi/Mb57Tk4K9F3pcxHWhKEg8c7zQXfyMKekLs7FZCzNkcEM8F2aLEM/AiXN1E9f5oeJ+QYazWFOQHCDuj0v2ENfTM4PFezOQF2yeE1leAQs6AeLzAYHADFgAK+QTnhGXnTEzqEuqIEfIS+Bm0J2QmxJHZ/LZxovpZiamVgDM3Lu5v/XDg9n7BMnhF2qpdwGwqkegdqHGigGgDTkBWc2FmvZRAKh/AHCezRYJM+dq6JkvDCACKpABCkAVaAI9YIRMZwlsgSNwA17AH4SASLASsAEXpAAhyAJrwEaQDwrBTrAXlIEKcATUgRPgFGgF58BlcB3cBndBH3gMBsEIeA3GwSSYgiAIB1EgGqQAqUHakCFkBjEge8gN8oGCoEgoBkqA+JAIWgNthgqhYqgMqoTqoV+gs9Bl6CbUAz2EhqAx6D30FUbBZFgGVoF14CUwA3aCveEQeAWcAKfBuXAevB0uhavg43ALfBm+DffBg/BreAIFUCSUHEodZYRioFxQ/qgoVDxKiFqHKkCVoKpQjah2VCfqHmoQ9Qb1BY1F09B0tBHaFu2JDkWz0WnodegidBm6Dt2Cvoq+hx5Cj6N/YCgYZYwhxgbDxERgEjBZmHxMCaYG04y5hunDjGAmsVisHFYXa4X1xEZiE7GrsUXYg9gm7CVsD3YYO4HD4RRwhjg7nD+OhcvA5eP2447jLuJ6cSO4z3gSXg1vhnfHR+H5+E34Evwx/AV8L/4lfoogSdAm2BD8CRxCDmEHoZrQTrhDGCFMEaWIukQ7YggxkbiRWEpsJF4jPiF+IJFIGiRrUiCJR9pAKiWdJN0gDZG+kKXJBmQXcjRZRN5OriVfIj8kf6BQKDoUR0oUJYOynVJPuUJ5RvksQZMwlmBKcCTWS5RLtEj0SrylEqjaVCfqSmoutYR6mnqH+kaSIKkj6SLJklwnWS55VnJAckKKJmUq5S+VIlUkdUzqptSoNE5aR9pNmiOdJ31E+or0MA1F06S50Ni0zbRq2jXaiAxWRleGKZMoUyhzQqZbZlxWWnapbJhstmy57HnZQTmUnI4cUy5ZbofcKbl+ua+LVBY5LYpbtG1R46LeRZ/kleQd5ePkC+Sb5PvkvyrQFdwUkhR2KbQqPFVEKxooBipmKR5SvKb4RklGyVaJrVSgdErpkTKsbKAcpLxa+Yhyl/KEiqqKh4pAZb/KFZU3qnKqjqqJqntUL6iOqdHU7NV4anvULqq9osvSnejJ9FL6Vfq4urK6p7pIvVK9W31KQ1cjVGOTRpPGU02iJkMzXnOPZofmuJaalq/WGq0GrUfaBG2GNld7n3an9icdXZ1wnS06rTqjuvK6TN1c3QbdJ3oUPQe9NL0qvfv6WH2GfpL+Qf27BrCBhQHXoNzgjiFsaGnIMzxo2LMYs9h6MX9x1eIBI7KRk1GmUYPRkLGcsY/xJuNW47dLtJZELdm1pHPJDxMLk2STapPHptKmXqabTNtN35sZmLHNys3um1PM3c3Xm7eZv1tquDRu6aGlDyxoFr4WWyw6LL5bWlkKLRstx6y0rGKsDlgNMGQYAYwixg1rjLWz9Xrrc9ZfbCxtMmxO2fxla2SbZHvMdnSZ7rK4ZdXLhu007Fh2lXaD9nT7GPvD9oMO6g4shyqH546ajhzHGseXTvpOiU7Hnd46mzgLnZudP7nYuKx1ueSKcvVwLXDtdpN2C3Urc3vmruGe4N7gPu5h4bHa45InxtPbc5fnAFOFyWbWM8e9rLzWel31JnsHe5d5P/cx8BH6tPvCvl6+u32f+Gn78f1a/YE/03+3/9MA3YC0gF8DsYEBgeWBL4JMg9YEdQbTglcFHwueDHEO2RHyOFQvVBTaEUYNiw6rD/sU7hpeHD4YsSRibcTtSMVIXmRbFC4qLKomamK52/K9y0eiLaLzo/tX6K7IXnFzpeLK5JXnV1FXsVadjsHEhMcci/nG8mdVsSZimbEHYsfZLux97NccR84ezlicXVxx3Mt4u/ji+NEEu4TdCWNcB24J9w3PhVfGe5fomViR+CnJP6k2aTo5PLkpBZ8Sk3KWL81P4l9NVU3NTu0RGAryBYNpNml708aF3sKadCh9RXpbhgxicLpEeqKfREOZ9pnlmZ+zwrJOZ0tl87O7cgxytuW8zHXPPboavZq9umON+pqNa4bWOq2tXAeti13XsV5zfd76kQ0eG+o2Ejcmbfxtk8mm4k0fN4dvbs9TyduQN/yTx08N+RL5wvyBLbZbKrait/K2dm8z37Z/248CTsGtQpPCksJvReyiWz+b/lz68/T2+O3dOyx3HNqJ3cnf2b/LYVddsVRxbvHwbt/dLXvoewr2fNy7au/NkqUlFfuI+0T7Bkt9Stv2a+3fuf9bGbesr9y5vOmA8oFtBz4d5BzsPeR4qLFCpaKw4uth3uEHlR6VLVU6VSVHsEcyj7yoDqvuPMo4Wl+jWFNY872WXztYF1R3td6qvv6Y8rEdDXCDqGHsePTxuydcT7Q1GjVWNsk1FZ4EJ0UnX/0S80v/Ke9THacZpxvPaJ850ExrLmiBWnJaxlu5rYNtkW09Z73OdrTbtjf/avxr7Tn1c+XnZc/vuEC8kHdh+mLuxYlLgktvLidcHu5Y1fH4SsSV+1cDr3Zf875247r79SudTp0Xb9jdOHfT5ubZW4xbrbctb7d0WXQ1/2bxW3O3ZXfLHas7bXet77b3LOu50OvQe/me673r95n3b/f59fX0h/Y/GIgeGHzAeTD6MPnhu0eZj6Yeb3iCeVLwVPJpyTPlZ1W/6//eNGg5eH7IdajrefDzx8Ps4dd/pP/xbSTvBeVFyUu1l/WjZqPnxtzH7r5a/mrkteD11Jv8P6X+PPBW7+2Zvxz/6hqPGB95J3w3/b7og8KH2o9LP3ZMBEw8m0yZnPpU8Fnhc90XxpfOr+FfX05lfcN9K/2u/739h/ePJ9Mp09MClpA1awVQSMLx8QC8rwWAEgkADfEVRIk5Xzwb0JyXnyXwdzznnWfDEoB6RwBm7Jkvsh5EVh1kpSIZgGSII4DNzcX5z0iPNzeb0yK1ItakZHr6A+IHcfoAfB+Ynp5qnZ7+XoMM+wiAS5NzfnzWwgwj/iYL2bS1l7cF/Gf8A2HI/7E8U31UAAABm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42ODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zNDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrhE98lAAAEr0lEQVRoBe1aMUzjWBB9hBWREJaQHCFdJCRXQUJJFZrcNUsTroAt9mgwBaHZNBsKNg1cQSjINcgNNEsDOWlJc1AcOYmkWbaANKTaCCkWRSSkIFBcWQI5EsfNt2MSnF3IOas7reJR7D9/Zjye/zx/bMe/556oVqvh4uICNzc3YHw3UV9fH/r7+zE8PAzG92iadn92dgav14vBwUFd2E2AsASoVqu4vr7G6Ogoes7Pz+85jsPQ0FA34dAy1kqlgtvbW7hUVQXP8y0G3SbweDx6yXDd3d2ht7e328bfMl5WP9j0cbVoulzgAGJJAAcQBxALApaukyEOIBYELN0Xln57XbWCz/Il6LG2YU88x/EQvJ6G7DvkbAGiVXKYj25+ebihRRxuiGgHlnI2ieV8ENuJCbjJm1bOkt88Vv5MYIQJ/geyWUOMzJh7f4jT42Mcs+3jIdbnQkBeQrqktjcUpQg5rzzYuqFAVmTo6DxI/1vGJiBGkPwAR8G76Ucb58HLmUldQVIiDdlkBGIiS5xJGk5Iljgoo7C7jKhEg1dSmBcjSP/1O8SoRIYyVkURSbLRSS1jNxHDxNgYxmiLLG/AxJtlVERMolA4QqyunxATOKk0zmg4aX/fESDlyzJUtaq/LVYrJexIKTqzHwHegEQpUgbICpr/UCh/KiKvqNBqA/D5jEAFXwADfwNCXdAn+CDwLAsrSI5PQ8rkEZxbxNLbSRRzKcyOL6PMxqwpKMr7iEbjwMwS1lbmwMsZLMT3mi6CcY5297ZqiOl8Pz6LfbNjtvwi/B6j42ZjIjSMCVY3oPdIniQ/Rpbh5WRMb4WxkhD1WTIVeIHcdAZLSaohZF45Suj+2dSMBQ2n4aAP4/MStnJvsFIHNLT4ARsiOwIIUIa9Ws0TYKKtOtQRIK/XthEJcPRSRBdLU1HMbOG3tIT5nQB2I/Vo9TAbO3eDpWOac4f5qCtZS4aqUibmNX6pg8G0XCBMEglFxTQGQkGBqXTifSFqM4+ysq5qq+kIEIFS2+ttDHFkZB1a4SdIuQJUAqQRshmLirJMfNjsP90anjkYE9C05WhqAZ/MLrU1ffiNOJiqr0n/b9iOakjriWpQFBYNpwfEe5lFU6CqjBxTM/FT9HAIgyKFo+YiWc0jRaD+8KyTp07wdV1HgGT29nB0lEU2y7YDJCPTSBEgk5EQweCG4PfTTWMLeyclVEoFJKYX6MbaRDXilQzS2ROU9Ts1E8hI7xzgMwmEyTdUooHVV1EcFEooFbKI/RwnHz7EpkaaHLWyzJMdsjdl3OzKUej7EuKPqqoPMyvrePfSq+tHpt4hnJqHtDBLsx7wTc4gnE9D5Y0UEMJv4d9cwOavC1C3PyLmC2POn0ZqcxV5VUA2FsD7P9YRp7vIanRW90kVA2sfkghSCBo9GX+ZWNm2Rz2np6f3wWDQ3tFtHkV/ZOuW7HnFLn0LH8+du1AowF6GPOfZou8ECNPVt/Bh+nqq7aiGPOX4e9U5gFiunAOIA4gFAUvXyRAHEAsClq6LfbVjX++6ndhXO/b1zsU+dF9dXXU7Hvp/OmxZhIuti2BLAS4vL7tubQjLApYZbOwMA4ZFj7Ng5vGCmX8AN5Wg6khTJSoAAAAASUVORK5CYII=) 0 0 / 68px 34px;␊
    }␊
    ␊
    .Header {␊
      height: calc(100px - 2em);␊
      margin-top: 24px;␊
      font-size: 32px;␊
    }␊
    ␊
    :fullscreen .Link {␊
      display: flex;␊
    }␊
    /*# sourceMappingURL=myBundle.min.css.map */␊
    `

## Compiles CSS

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/compiles/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] Finished 'css_myBundle' after ____ ms␊
      [__:__:__] Finished 'css' after ____ ms␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

## Compiles CSS, configuration has overrides

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/compiles-with-overrides/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] Finished 'css_myBundle' after ____ ms␊
      [__:__:__] Finished 'css' after ____ ms␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

## Compiles CSS, configuration preserve

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/compiles-preserve/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] Finished 'css_myBundle' after ____ ms␊
      [__:__:__] Finished 'css' after ____ ms␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

## Compiles CSS, compiles color-function

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-postcss-gulp/compiles-color-function/dist/css␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'css' ...␊
      [__:__:__] Starting 'css_myBundle' ...␊
      [__:__:__] Finished 'css_myBundle' after ____ ms␊
      [__:__:__] Finished 'css' after ____ ms␊
      [__:__:__] Starting 'css__lint' ...␊
      [__:__:__] Finished 'css__lint' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }