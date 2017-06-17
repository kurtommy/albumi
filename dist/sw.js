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
    "revision": "61ecb62113c51c1a3d023d4d6ac44ec4"
  },
  {
    "url": "/albumi/inline.9c63c12eaa15dd0bf387.bundle.js",
    "revision": "66138b9861dbc16466ddcb6033b5b07d"
  },
  {
    "url": "/albumi/main.56884db0bfc7932c2662.bundle.js",
    "revision": "d504886cfc2a6632f98442e38e47337a"
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
    "url": "/albumi/vendor.7a5ebf68c96efe95af37.bundle.js",
    "revision": "906a37e1fb76a9945addff1cd7fe18ae"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
