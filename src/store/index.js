import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    currentUser: {
      username: '',
      fname: '',
      lname: '',
      vehicle: '',
      login_time: null,
      logout_time: null
    },

    currentAdmin: {
      username: '',
      login_time: null,
      logout_time: null
    },

    currentOPCO: {
      username: '',
      login_time: null,
      logout_time: null
    }

  },
  mutations: {
    updateVehicle(state, payload) {
      state.currentUser.vehicle = payload.vehicle
    }
  },
  actions: {
  },
  modules: {
  }
})
