importScripts('workbox-sw.prod.v1.0.1.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "/albumi/404.html",
    "revision": "a8ac6c99ac3d78bec287b4e15c6ccd82"
  },
  {
    "url": "/albumi/assets/data/artists.json",
    "revision": "86f1de4ebf89c118cc397670d05236b3"
  },
  {
    "url": "/albumi/assets/lists/names.json",
    "revision": "55360ec457cf0d0eee4c113e6b30a44a"
  },
  {
    "url": "/albumi/favicon.ico",
    "revision": "b9aa7c338693424aae99599bec875b5f"
  },
  {
    "url": "/albumi/index.html",
    "revision": "bd7e81eba269bb1e20be350292e38fb2"
  },
  {
    "url": "/albumi/inline.b6ddc04d2e88d597043e.bundle.js",
    "revision": "00bbc10bd522904ba0d37d40ac72f819"
  },
  {
    "url": "/albumi/main.5706f986e8249a2b6bea.bundle.js",
    "revision": "2fc24950b9be4a1646b8dc3f509c2baa"
  },
  {
    "url": "/albumi/polyfills.39c939ce6d269d8796c3.bundle.js",
    "revision": "d4be978c966a239dbf98f53b360807b4"
  },
  {
    "url": "/albumi/styles.37cf96475c27c17f27ee.bundle.css",
    "revision": "404786c18573fcedf91eb684c532f265"
  },
  {
    "url": "/albumi/vendor.aa7e60881ccaf7cebea2.bundle.js",
    "revision": "2ffc11c87e58a19d65731f8de7ee63c5"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
