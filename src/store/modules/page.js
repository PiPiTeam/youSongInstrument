const state = {
  dashboard_page: 1,
  task_list_page: 1
}

const mutations = {
  CHANGE_PAGE: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changePage({ commit }, data) {
    commit('CHANGE_PAGE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
