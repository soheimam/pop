/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-ac81b9be'], (function (workbox) { 'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "/_next/app-build-manifest.json",
    "revision": "2e3b0d757f96d7ffa4dbc9e6acadafe4"
  }, {
    "url": "/_next/build-manifest.json",
    "revision": "9cb6afb2be56767e85f623122637a919"
  }, {
    "url": "/_next/react-loadable-manifest.json",
    "revision": "99914b932bd37a50b983c5e7c90ae93b"
  }, {
    "url": "/_next/server/app/_not-found_client-reference-manifest.js",
    "revision": "d7b184b3551e77e809e6d7f635eb7388"
  }, {
    "url": "/_next/server/app/not-found_client-reference-manifest.js",
    "revision": "7433113752a629f1353be31e8e8689e3"
  }, {
    "url": "/_next/server/app/page_client-reference-manifest.js",
    "revision": "0df800cb4b098789a95d31efb2368324"
  }, {
    "url": "/_next/server/middleware-build-manifest.js",
    "revision": "9b8da685af90831dd78ddc8d2fc836a0"
  }, {
    "url": "/_next/server/middleware-react-loadable-manifest.js",
    "revision": "537157e425123611736ddcf544160221"
  }, {
    "url": "/_next/server/next-font-manifest.js",
    "revision": "d4b1b4bdca47f55a65c57ea1278a15ec"
  }, {
    "url": "/_next/server/next-font-manifest.json",
    "revision": "11291e297bdd99a5a64c681aff63f85e"
  }, {
    "url": "/_next/static/chunks/app-pages-internals.js",
    "revision": "32bb8b81e44143443946597e972b2d69"
  }, {
    "url": "/_next/static/chunks/app/layout.js",
    "revision": "8eb6b3c2398ce248a1ee6b0f7afa1737"
  }, {
    "url": "/_next/static/chunks/app/not-found.js",
    "revision": "2b616843074671070a32d911f38fec8f"
  }, {
    "url": "/_next/static/chunks/polyfills.js",
    "revision": "837c0df77fd5009c9e46d446188ecfd0"
  }, {
    "url": "/_next/static/chunks/webpack.js",
    "revision": "6373b644b5ecf0b157e1655ba9dfa303"
  }, {
    "url": "/_next/static/css/app/layout.css",
    "revision": "871112fc511fff2d0d2539d8e4ea999a"
  }, {
    "url": "/_next/static/development/_buildManifest.js",
    "revision": "ffa3aabb229020bfdacb6f27acadcf31"
  }, {
    "url": "/_next/static/development/_ssgManifest.js",
    "revision": "abee47769bf307639ace4945f9cfd4ff"
  }, {
    "url": "/_next/static/media/05a31a2ca4975f99-s.woff2",
    "revision": "f1b44860c66554b91f3b1c81556f73ca"
  }, {
    "url": "/_next/static/media/513657b02c5c193f-s.woff2",
    "revision": "c4eb7f37bc4206c901ab08601f21f0f2"
  }, {
    "url": "/_next/static/media/51ed15f9841b9f9d-s.woff2",
    "revision": "bb9d99fb9bbc695be80777ca2c1c2bee"
  }, {
    "url": "/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",
    "revision": "74c3556b9dad12fb76f84af53ba69410"
  }, {
    "url": "/_next/static/media/d6b16ce4a6175f26-s.woff2",
    "revision": "dd930bafc6297347be3213f22cc53d3e"
  }, {
    "url": "/_next/static/media/ec159349637c90ad-s.woff2",
    "revision": "0e89df9522084290e01e4127495fae99"
  }, {
    "url": "/_next/static/media/fd4db3eb5472fc27-s.woff2",
    "revision": "71f3fcaf22131c3368d9ec28ef839831"
  }, {
    "url": "/_next/static/webpack/adeadfae86534cb9.webpack.hot-update.json",
    "revision": "development"
  }, {
    "url": "/_next/static/webpack/webpack.adeadfae86534cb9.hot-update.js",
    "revision": "development"
  }], {
    "ignoreURLParametersMatching": [/ts/]
  });
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }
        return response;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map
