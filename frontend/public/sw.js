if (!self.define) {
  let e,
    s = {};
  const a = (a, t) => (
    (a = new URL(a + ".js", t).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (t, n) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let c = {};
    const d = (e) => a(e, i),
      r = { module: { uri: i }, exports: c, require: d };
    s[i] = Promise.all(t.map((e) => r[e] || d(e))).then((e) => (n(...e), c));
  };
}
define(["./workbox-2cda8f95"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/Footer.png", revision: "1a2a1b49f508c836f5629c23e0fd63e8" },
        {
          url: "/OtakuRealm_Logo.png",
          revision: "b465ea28bf8128697321efc0bf5ef316",
        },
        {
          url: "/_next/app-build-manifest.json",
          revision: "df5af7f3dcb40ec7218c2296ecfcacbc",
        },
        {
          url: "/_next/static/chunks/341.2903e54d3da731c1.js",
          revision: "2903e54d3da731c1",
        },
        {
          url: "/_next/static/chunks/464-6722026e12b1855c.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/472.a3826d29d6854395.js",
          revision: "a3826d29d6854395",
        },
        {
          url: "/_next/static/chunks/489-7cbdf4a90045eecc.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/4bd1b696-9b1f5c13042abaa8.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/684-5a7879a490d40b9f.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/695-98b3552b3950ded0.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/766-d4cea2c877fff284.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/870fdd6f-2c5858785eeee72b.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/874-d3e497b69ff7f167.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/894-82cc97513ffea660.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/(readPage)/read/%5B...slug%5D/page-8dd8e3d553f58ade.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/(videoPage)/watch/%5Bslug%5D/%5Bepisode%5D/page-4986670970966f15.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-b689f1b77d9f1b9f.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/animedetailpage/%5Bslug%5D/page-30a87c2be2f150c7.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/api/proxy-image/route-d1183e8c11e10a28.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/filter/page-32778d3b628016b4.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/layout-1cb1f4974253cb67.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/login/page-8a667dc0235fb3b9.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/mangadetailpage/%5Bslug%5D/page-1e594cdd96e0832f.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/mangahome/page-efc32289c22038d0.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/page-7fa995be2790883a.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/read_history/page-31bda4fc064495fc.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/app/watch_history/page-0f8f9530808a7fa3.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/framework-acf8fb4df35d6caf.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/main-9944152b77b5b34a.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/main-app-b497b604f39880a9.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/pages/_app-24669db6003a03c6.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/pages/_error-eb9435c446d4684d.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-25a7af5e4087a1cb.js",
          revision: "zdQsxBUOT-tLODdTNvReC",
        },
        {
          url: "/_next/static/css/50f772240a44cdb6.css",
          revision: "50f772240a44cdb6",
        },
        {
          url: "/_next/static/css/c01173353bdab0a6.css",
          revision: "c01173353bdab0a6",
        },
        {
          url: "/_next/static/media/569ce4b8f30dc480-s.p.woff2",
          revision: "ef6cefb32024deac234e82f932a95cbd",
        },
        {
          url: "/_next/static/media/747892c23ea88013-s.woff2",
          revision: "a0761690ccf4441ace5cec893b82d4ab",
        },
        {
          url: "/_next/static/media/8d697b304b401681-s.woff2",
          revision: "cc728f6c0adb04da0dfcb0fc436a8ae5",
        },
        {
          url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
          revision: "da83d5f06d825c5ae65b7cca706cb312",
        },
        {
          url: "/_next/static/media/9610d9e46709d722-s.woff2",
          revision: "7b7c0ef93df188a852344fc272fc096b",
        },
        {
          url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
          revision: "8ea4f719af3312a055caf09f34c89a77",
        },
        {
          url: "/_next/static/zdQsxBUOT-tLODdTNvReC/_buildManifest.js",
          revision: "99ec9d1ad4a464688db6e5f31e7b8d51",
        },
        {
          url: "/_next/static/zdQsxBUOT-tLODdTNvReC/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/footer_bg.png", revision: "a4995a5796c1947da9ec47472d92a453" },
        {
          url: "/footer_main.png",
          revision: "f65ad202b87f866bdd619c4faf52dc93",
        },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: t,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
