import Store from '../../lib/flux/index.js'

import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'

export default new Store({
  state,
  mutations,
  actions,
})
