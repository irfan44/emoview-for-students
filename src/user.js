import axios from 'axios'
import { BE_ENDPOINT } from './constants'

const state = () => ({
  user: {},
  isStart: false,
  isMeetingCode: false,
  meetingCode: ''
})

const getters = {
  user: (state) => {
    return state.user
  },
  username: (state) => {
    return state.user.name
  },
  isStart: (state) => {
    return state.isStart
  },
  isMeetingCode: (state) => {
    return state.isMeetingCode
  },
  meetingCode: (state) => {
    return state.meetingCode
  }
}

const mutations = {
  SET_USER(state, param) {
    state.user = param
  },
  SET_IS_START(state, param) {
    state.isStart = param
  },
  SET_IS_MEETING_CODE(state, param) {
    state.isMeetingCode = param
  },
  SET_MEETING_CODE(state, param) {
    state.meetingCode = param
  }
}

const actions = {
  toggleSetMeetingCode({commit}, {meetingCode}) {
    const isMeetingCode = !state.isMeetingCode
    commit('SET_IS_MEETING_CODE', isMeetingCode)
    commit('SET_MEETING_CODE', meetingCode)
    chrome.storage.sync.set({meetingCode}).then(() => {
      chrome.storage.sync.get().then((result) => {
        console.log(result)
      })
    })
  },
  updateUser({commit}, param) {
    const {token, nickname, name, id, sub, email, picture, role} = param

    const body = {
      name: nickname,
      fullname: name,
      authId: sub,
      email: email,
      picture: picture,
      userId: id,
      role: role[0],
    }

    return axios
      .post(`${BE_ENDPOINT}/user`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({data}) => {
        const user = {
          ...data.data,
          token: `Bearer ${token}`,
        }
        commit('SET_USER', user)
        chrome.storage.sync.set({user}).then(() => {
          chrome.storage.sync.get().then((result) => {
            console.log(result)
          })
        })
      })
      .catch((error) => {
        console.log('ini error dari axios', error)
      })
  },
  toggleIsStart({state, commit}) {
    const isStart = !state.isStart
    commit('SET_IS_START', isStart)
    chrome.storage.sync.set({isStart}).then(() => {
      chrome.storage.sync.get().then((result) => {
        console.log(result)
      })
    })
  },
  updateName({commit, state}, {name}) {
    return axios
      .put(
        'https://api-fer-rest.fly.dev/user',
        {name},
        {headers: {Authorization: state.user.token}},
      )
      .then(({data}) => {
        const user = {
          ...state.user,
          ...data.data,
        }
        commit('SET_USER', user)
        chrome.storage.sync.set({user}).then(() => {
          chrome.storage.sync.get().then((result) => {
            console.log(result)
          })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
