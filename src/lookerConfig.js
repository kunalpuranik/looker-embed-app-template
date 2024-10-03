export const lookerConfig = {
  // Embed configuration
  host: process.env.REACT_APP_LOOKER_HOST || 'example.looker.com',
  dashboardId: process.env.REACT_APP_LOOKER_DASHBOARD_1,
  exploreId: process.env.REACT_APP_LOOKER_EXPLORE,
  tab1DashboardId: process.env.REACT_APP_LOOKER_DASHBOARD_TAB_1,
  tab2DashboardId: process.env.REACT_APP_LOOKER_DASHBOARD_TAB_2,
  tab1LookId: process.env.REACT_APP_LOOKER_LOOKS_TAB_1,
  tab2LookId: process.env.REACT_APP_LOOKER_LOOKS_TAB_2,
  tab3LookId: process.env.REACT_APP_LOOKER_LOOKS_TAB_3,
  singleCards: process.env.REACT_APP_SINGLE_CARDS,
  timeSeries: process.env.REACT_APP_TIMESERIES,

  // SDK configuration
  baseUrl:
    process.env.REACT_APP_LOOKER_API_URL ||
    'https://self-signed.looker.com:19999',
  proxyUrl: process.env.REACT_APP_LOOKER_PROXY_URL,

  // GSI configuration
  gsiClientId:
    process.env.REACT_APP_GSI_CLIENT_ID ||
    '985813134634-uccocgcth9e8k66tnjs9lafpgjer473p.apps.googleusercontent.com'
}
