import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: '',
        nickname: '',
        email: '',
        loading: false,
        playlist: [],
        videoId: '',
        playType: '',
        signInPopupType: '',
        signInPopupStatus: '',
        serverUrl: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:2000/'
    },
    getters: {
        user (state) {
            return state.user
        },
        nickname (state) {
            return state.nickname
        },
        email (state) {
            return state.email
        },
        loading (state) {
            return state.loading
        },
        playlist (state) {
            return state.playlist
        },
        videoId (state) {
            return state.videoId
        },
        playType (state) {
            return state.playType
        },
        signInPopupType (state) {
            return state.signInPopupType
        },
        signInPopupStatus (state) {
            return state.signInPopupStatus
        },
        serverUrl (state) {
            return state.serverUrl
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload.user
        },
        setNickname(state, payload) {
            state.nickname = payload.nickname
        },
        setEmail(state, payload) {
            state.email = payload.email
        },
        setPlaylist(state, payload) {
            state.playlist = payload.playlist
        },
        setLoading(state, payload) {
            state.loading = payload.loading
        },
        setVideoId(state, payload) {
            state.videoId = payload.videoId
        },
        setPlayType(state, payload) {
            state.playType = payload.playType
        },
        setSignInPopupType(state, payload) {
            state.signInPopupType = payload.signInPopupType
        },
        setSignInPopupStatus(state, payload) {
            state.signInPopupStatus = payload.signInPopupStatus
        }
    },
    actions: {
        setUser({
            commit
        }, user) {
            commit('setUser', {
                user
            })
        },
        setNickname({
            commit
        }, nickname) {
            commit('setNickname', {
                nickname
            })
        },
        setEmail({
            commit
        }, email) {
            commit('setEmail', {
                email
            })
        },
        setLoading({
            commit
        }, loading) {
            commit('setLoading', {
                loading
            })
        },
        setPlaylist({
            commit
        }, playlist) {
            commit('setPlaylist', {
                playlist
            })
        },
        setVideoId({
            commit
        }, videoId) {
            commit('setVideoId', {
                videoId
            })
        },
        setPlayType({
            commit
        }, playType) {
            commit('setPlayType', {
                playType
            })
        },
        setSignInPopupType({
            commit
        }, signInPopupType) {
            commit('setSignInPopupType', {
                signInPopupType
            })
        },
        setSignInPopupStatus({
            commit
        }, signInPopupStatus) {
            commit('setSignInPopupStatus', {
                signInPopupStatus
            })
        }
    }
});