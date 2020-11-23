<template>
    <div id='popup_signin_wrap' class='popup_alert_wrap'>
        <div class='popup_content'>
            <div class='popup_inner'>
                <div class='popup_form_wrap'>
                    <div class='popup_form_close_div'>
                        <img class='popup_form_close_img' src='/images/btn_close.png' @click='closeLoginPopup' alt='회원가입 닫기' />
                    </div>
                    <div>
                        <p class="popup_form_title">닉네임 변경</p>
                        <input type='text' placeholder='변경할 닉네임' v-model="params.nickname" @keypress.enter="changeNickname" />
                        <div id='popup_form_signin_btn' class='popup_form_btn' @click.stop.prevent="changeNickname">변경하기</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NicknamePopup',
        data: function () {
            return {
                params: {
                    id: '',
                    nickname: '',
                }
            }
        },
        computed: {
            user () {
                return this.$store.getters.user;
            },
            nickname () {
                return this.$store.getters.nickname;
            }
        },
        mounted () {
            this.params.id = this.user;
            this.params.nickname = this.nickname;
        },
        methods: {
            closeLoginPopup: function () {
                this.$emit('close');
            },
            changeNickname: function () {
                if (this.nickname === '') {
                    this.$showAlert('변경할 닉네임을 입력하세요');
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/profile/change_nickname', this.params).then((response) => {
                    if (response.data.code === '0000') {
                        this.$store.dispatch('setNickname', this.params.nickname);
                        this.$emit('close');
                    } else {
                        this.$showAlert(response.data.message);
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #popup_signin_wrap {
        .popup_inner { max-width: 400px; }
        .popup_form_wrap { position: relative; padding: 20px 45px 45px; text-align: center; background: #FFFFFF; box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24); z-index: 1; }
        .popup_form_close_div { width: 100%; margin-bottom: 20px; text-align: right; }
        .popup_form_close_img { width: 20px; margin-right: -25px; cursor: pointer; }

        .popup_form_title { margin: 0 0 20px; font-size: 20px; font-weight: 400; color: #F361A6; }
        .popup_form_wrap input { width: 100%; padding: 15px; margin: 0 0 8px; font-size: 16px; letter-spacing: 0.5px; background: #f2f2f2; outline: 0; border: 0; box-sizing: border-box; }
        .popup_form_wrap input:last-of-type { margin-bottom: 15px; }
        .popup_form_btn { width: 100%; padding: 13px 0 15px; font-size: 16px; font-weight: 400; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.4px; background: #F361A6; outline: 0; border: 0; cursor: pointer; }
        .popup_form_wrap .message { margin: 15px 0 0; font-size: 16px; font-weight: 400; color: #b3b3b3; letter-spacing: 0.5px; }
        .popup_form_wrap .message span { color: #F361A6; text-decoration: none; cursor: pointer; }
    }
</style>


