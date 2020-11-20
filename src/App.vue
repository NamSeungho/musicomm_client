<template>
    <div id="app">
        <MainFrame v-if="$route.path !== '/admin'" />
        <router-view v-else />
    </div>
</template>

<script>
    import MainFrame from './components/Frame.vue'

    export default {
        name: 'app',
        components: {
            MainFrame
        },
        mounted () {
            this.axios.post(this.$store.getters.serverUrl + 'api/main/get_info', this.loginParams).then((response) => {
                if (response.data.result !== undefined) {
                    this.$store.dispatch('setUser', response.data.result.user);
                    this.$store.dispatch('setNickname', response.data.result.nickname);
                    this.$store.dispatch('setEmail', response.data.result.email);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
</script>



<!-- Common CSS -->
<style lang="scss">
    @font-face {
        font-family: 'Nanum Pen Script';
        font-style: normal;
        font-weight: 300;
        src: url('./fonts/nanum-pen-script/nanum-pen-script-v15-latin_korean-regular.eot'); /* IE9 Compat Modes */
        src: local('Nanum Pen'), local('NanumPen'),
        url('./fonts/nanum-pen-script/nanum-pen-script-v15-latin_korean-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('./fonts/nanum-pen-script/nanum-pen-script-v15-latin_korean-regular.woff2') format('woff2'), /* Super Modern Browsers */
        url('./fonts/nanum-pen-script/nanum-pen-script-v15-latin_korean-regular.woff') format('woff'), /* Modern Browsers */
        url('./fonts/nanum-pen-script/nanum-pen-script-v15-latin_korean-regular.ttf') format('truetype'), /* Safari, Android, iOS */
        url('./fonts/nanum-pen-script/nanum-pen-script-v15-latin_korean-regular.svg#NanumPenScript') format('svg'); /* Legacy iOS */
    }

    /*@font-face {*/
    /*    font-family: 'tmoney';*/
    /*    font-style: normal;*/
    /*    font-weight: 400;*/
    /*    src: url('./fonts/tmoney/TmoneyRoundWindRegular.otf') format('opentype'),*/
    /*    url('./fonts/tmoney/TmoneyRoundWindRegular.ttf') format('truetype')*/
    /*}*/

    /*@font-face {*/
    /*    font-family: 'tmoney';*/
    /*    font-style: normal;*/
    /*    font-weight: 600;*/
    /*    src: url('./fonts/tmoney/TmoneyRoundWindExtraBold.otf') format('opentype'),*/
    /*    url('./fonts/tmoney/TmoneyRoundWindExtraBold.ttf') format('truetype')*/
    /*}*/

    * { margin: 0; padding: 0; border: none; box-sizing: border-box; letter-spacing: 1px; }
    html {
        font-family: 'tmoney', 'Nanum Pen Script', 'Roboto', sans-serif;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
    }
    html, body, #app, .application, .frame_container { height: 100%; }
    input, textarea { font-family: 'Nanum Pen Script', 'Roboto', sans-serif; }
    input:focus, textarea:focus, button:focus, a:focus { outline: none; }

    a { text-decoration: none; }

    .popup_alert_wrap { position: fixed; width: 100%; height: 100%; top: 0; left: 0; line-height: 1.5; font-size: 0; text-align: center; letter-spacing: initial; background-color: rgba(0,0,0,0.6); z-index: 10000; word-break: break-all; overflow: auto; }
    .popup_alert_wrap:before { width: 0; height: 100%; position: relative; vertical-align: middle; display: inline-block; overflow: hidden; content: ""; font-size: 0; }
    .popup_content { width: 100%; display: inline-block; vertical-align: middle; }
    .popup_inner { width: 80%; max-width: 420px; margin: 0 auto; }
    .popup_inner_wrap { position: relative; padding: 45px 45px; font-size: 16px; font-weight: 400; text-align: center; background: #FFFFFF; box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24); z-index: 1; }
    .popup_top { width: 100%; padding-bottom: 30px; }
    .popup_top_txt { width: 86%; margin: 0 auto; font-size: 23px; color: rgba(0, 0, 0, 0.5); }
    .popup_btn_bottom { width: 100%; padding: 9px 0; font-size: 20px; color: #fff; background-color: #F361A6; cursor: pointer; }

    .loading_wrap { width: 100%; display: inline-block; vertical-align: middle; }
    .v-dot1 { display: inline-block; }
    .v-dot2, .v-dot3 { background-color: #F361A6 !important; }
</style>
