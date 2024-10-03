import dashboard from 'assets/dashboard.svg'
import explore from 'assets/explore.svg'
import api from 'assets/api.svg'
import reports from 'assets/reports.svg'

const routes = [
  { path: `/`, name: 'Metrics Dashboard', img: dashboard },
  { path: `/reports`, name: 'Embed Flavors', img: reports },
  { path: `/custom`, name: 'API-Driven Dashboard', img: api },
  { path: `/explore`, name: 'Self Service', img: explore },
]

export default routes
