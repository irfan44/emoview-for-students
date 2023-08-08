import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'EmoSync for Student',
  description: 'An extension to recognize emotions on Google Meet using REST API',
  version: '1.0',
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: ['https://meet.google.com/*-*-*'],
      js: ['src/content/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['storage'],
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqkSwpVEsNGNOkTcuAHSixqXUp+y6/CSXy+2fSSOK2M+Np4G0L66SuD09My6nX4mEFgBRA4r2IZc6LKAS3f5MG/h147QI4ckQw+m86v4o1Yk7zFF9f7G4k0WH41lW1Z1KOzKndTqcKsPBwuRybd/FncJOA3MrjFPPSywhsSPsNeXCJeaBOhEOLEKBe+e/qPiBW8Wgt7AGo7PCl4EsmEK7QWGbHBpJ7LwyCMnbgImhYsDK0+0oe24m4+TpDOaigzqKFyK9n8HwtYtvrIP+vYXu+UKMONS9aAVxBsEvONqIdUgsOpii9GgTs4zHA5V0DaJgio/xufU/7D9FRczXKK7FMwIDAQAB',
})
