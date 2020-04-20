<template>
    <div class="application">
        <Header />
        <Aside />

        <div class="frame_container">
            <router-view />

            <div class="popup_alert_wrap" v-if="loading">
                <div class="loading_wrap">
                    <dot-loader />
                </div>
            </div>
        </div>

        <login-popup />
    </div>
</template>

<script>
    import Header from './Header.vue'
    import Aside from './Aside.vue'
    import LoginPopup from './LoginPopup.vue'
    import DotLoader from 'vue-spinner/src/DotLoader.vue'

    export default {
        name: 'MainFrame',
        components: {
            Header,
            Aside,
            LoginPopup,
            DotLoader
        },
        data: function () {
            return {
                //
            }
        },
        computed: {
            loading () {
                return this.$store.getters.loading;
            }
        },
        mounted () {
            //
        },
        methods: {
            //
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .frame_container { padding: 55px 0 0; width: calc(100% - 450px); height: 100%; min-height: 100%; }
</style>
