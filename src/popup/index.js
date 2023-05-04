import { createApp } from 'vue'
import { store } from '../store'
import { createAuth0 } from '@auth0/auth0-vue'
import './style.css'
import App from './Popup.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { AUTH0_APP_DOMAIN, AUTH0_AUDIENCE, AUTH0_CLIENT_ID } from '../constants'

const customTheme = {
  dark: false,
  colors: {
    primary: '#0066DA',
    'primary-darken-1': '#0066DA',
  }
}

createApp(App)
  .use(store)
  .use(
    createAuth0({
      domain: AUTH0_APP_DOMAIN,
      client_id: AUTH0_CLIENT_ID,
      redirect_uri: chrome.runtime.getURL('popup.html'),
      audience: AUTH0_AUDIENCE,
    }),
  )
  .use(
    createVuetify({
      components,
      directives,
      theme: {
        defaultTheme: 'customTheme',
        themes: {
          customTheme,
        }
      },
    }),
  )
  .mount('#app')
