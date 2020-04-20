<template>
    <div id='popup_signin_wrap' class='popup_alert_wrap' v-show="signInPopupStatus === 'SHOW'">
        <div class='popup_content'>
            <div class='popup_inner'>
                <div class='popup_form_wrap'>
                    <div class='popup_form_close_div'>
                        <img class='popup_form_close_img' src='/images/btn_close.png' @click='closeLoginPopup' alt='회원가입 닫기' />
                    </div>
                    <div class="popup_form_half">
                        <form class='popup_form_register' v-if="signInPopupType === 'SIGNUP'">
                            <p class="popup_form_title">Sign up with Musicomm</p>
                            <input type='email' placeholder='email address' v-model="signupParams.email" @keypress.enter="signup" />
                            <input type='password' placeholder='password' v-model="signupParams.password" @keypress.enter="signup" />
                            <input type='password' placeholder='re-password' v-model="signupParams.repassword" @keypress.enter="signup" />
                            <input type='text' placeholder='nickname' v-model="signupParams.nickname" @keypress.enter="signup" />
                            <div id='popup_form_signup_btn' class='popup_form_btn' @click.stop.prevent="signup">create</div>
                            <p class='message'>Already registered? <span @click="showLoginPopup('LOGIN')">Sign In</span></p>
                        </form>
                        <form class='popup_form_login' v-if="signInPopupType === 'LOGIN'">
                            <p class="popup_form_title">Sign in with Musicomm</p>
                            <input type='email' placeholder='email address' v-model="loginParams.email" @keypress.enter="login" />
                            <input type='password' placeholder='password' v-model="loginParams.password" @keypress.enter="login" />
                            <div id='popup_form_signin_btn' class='popup_form_btn' @click.stop.prevent="login">login</div>
                            <p class='message'>Not registered? <span @click="showLoginPopup('SIGNUP')">Create an account</span></p>
                        </form>
                    </div>
                    <div class="popup_form_half">
                        <p class="popup_form_title">Sign in with SNS</p>
                        <div id='naver_id_login'></div>
                        <div id='facebook_login_button' @click="loginByFacebook">
                            <div id='facebook_login_logo_div'>
                                <img id='facebook_login_logo_img' src="/images/img_facebook_logo.png" alt='페이스북 로그인' />
                            </div>
                            <div id='facebook_login_border'></div>
                            <span id='facebook_login_text'>페이스북으로 로그인</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoginPopup',
        data: function () {
            return {
                naver_id_login: null,
                loginParams: {
                    email: '',
                    password: ''
                },
                signupParams: {
                    email: '',
                    nickname: '',
                    password: '',
                    repassword: ''
                }
            }
        },
        computed: {
            signInPopupStatus () {
                return this.$store.getters.signInPopupStatus;
            },
            signInPopupType () {
                return this.$store.getters.signInPopupType;
            }
        },
        mounted () {
            window.callbackNaverLogin = this.callbackNaverLogin;

            this.initializeNaverLogin();
            this.initializeFacebookLogin();
        },
        methods: {
            closeLoginPopup: function () {
                this.$store.dispatch('setSignInPopupStatus', 'HIDE');
                this.clearLoginInput();
            },
            showLoginPopup: function (type) {
                this.$store.dispatch('setSignInPopupType', type);
                this.clearLoginInput();
            },
            login: function () {
                if (this.loginParams.email === '') {
                    this.$showAlert('이메일을 입력하세요');
                    return;
                }
                if (this.loginParams.password === '') {
                    this.$showAlert('비밀번호를 입력하세요');
                    return;
                }
                if (!this.validationEmail(this.loginParams.email)) {
                    this.$showAlert('유효한 이메일이 아닙니다');
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/main/login', this.loginParams).then((response) => {
                    console.log(response);

                    if (response.data.code === '0000') {
                        location.reload();
                    } else {
                        this.$showAlert(response.data.message);
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            signup: function () {
                if (this.signupParams.email === '') {
                    this.$showAlert('이메일을 입력하세요');
                    return;
                }
                if (this.signupParams.password === '') {
                    this.$showAlert('비밀번호를 입력하세요');
                    return;
                }
                if (this.signupParams.repassword === '') {
                    this.$showAlert('비밀번호를 한번 더 입력하세요');
                    return;
                }
                if (this.signupParams.nickname === '') {
                    this.$showAlert('닉네임을 입력하세요');
                    return;
                }
                if (!this.validationEmail(this.signupParams.email)) {
                    this.$showAlert('유효한 이메일이 아닙니다');
                    return;
                }
                if (this.signupParams.password !== this.signupParams.repassword) {
                    this.$showAlert('비밀번호가 일치하기 않습니다');
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/main/signup', this.signupParams).then((response) => {
                    console.log(response);

                    if (response.data.code === '0000') {
                        this.$showAlert('Musicomm에 가입해주셔서 감사합니다.', '확인', () => {
                            this.showLoginPopup('LOGIN');
                        });
                    } else {
                        this.$showAlert(response.data.message);
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            clearLoginInput: function () {
                this.loginParams.email = '';
                this.loginParams.password = '';
                this.signupParams.email = '';
                this.signupParams.password = '';
                this.signupParams.repassword = '';
                this.signupParams.nickname = '';
            },
            validationEmail: function (email) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            initializeFacebookLogin: function () {
                // Facebook Login
                window.fbAsyncInit = function() {
                    window.FB.init({
                        appId      : '2250201205082472',
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v6.0'
                    });
                };

                (function(d, s, id){
                    let js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            },
            loginByFacebook: function () {
                window.FB.login(function(response) {
                    if (response.status === 'connected') {
                        this.FB.api('/me?fields=id,name,email', function(response) {
                            if (!response || response.error) {
                                this.$showAlert('Facebook API 오류', '확인');
                            }
                            else {
                                console.log(response);
                                // httpSend("/api/account/sns", {
                                //     id          : response.id,
                                //     email       : response.email,
                                //     nickname    : response.name,
                                //     type        : "facebook"
                                // }, "POST", function(result) {
                                //     if(result.type == 1) {
                                //         this.$showAlert('Musicomm에 가입해주셔서 감사합니다.', '확인', () => {
                                //             window.location.replace(location.href.split("#")[0]);
                                //         });
                                //     }
                                //     else {
                                //         location.replace(location.href.split("#")[0]);
                                //     }
                                // }, function(errorCode, errorMessage) {
                                //     showAlert(errorMessage);
                                // });
                            }
                        });
                    } else {
                        console.log(response);
                    }
                }, {scope: 'public_profile,email'});
            },
            initializeNaverLogin: function () {
                if (typeof window.naver_id_login === "function") {
                    this.naver_id_login = new window.naver_id_login("LEET27RZKtX8sTY45vn8", location.href);
                    this.naver_id_login.setButton("green", 3, 53);
                    this.naver_id_login.setDomain("http://localhost:8080");
                    this.naver_id_login.setState(this.naver_id_login.getUniqState());
                    this.naver_id_login.init_naver_id_login();

                    // 네이버 사용자 프로필 조회
                    if(this.naver_id_login.is_callback) {
                        this.naver_id_login.get_naver_userprofile("callbackNaverLogin()");
                    }
                } else {
                    setTimeout (() => {
                        this.initializeNaverLogin();
                    }, 500);
                }
            },
            callbackNaverLogin: function () {
                console.log(this.naver_id_login.getProfileData('id'));
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #popup_signin_wrap {
        .popup_inner { max-width: 800px; }
        .popup_form_wrap { position: relative; padding: 20px 45px 45px; text-align: center; background: #FFFFFF; box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24); z-index: 1; }
        .popup_form_close_div { width: 100%; margin-bottom: 20px; text-align: right; }
        .popup_form_close_img { width: 20px; margin-right: -25px; cursor: pointer; }
        .popup_form_half { width: 50%; vertical-align: top; display: inline-block; }
        .popup_form_title { margin: 0 0 20px; font-size: 20pt; font-weight: 400; color: #F361A6; }
        .popup_form_wrap input { width: 100%; padding: 15px; margin: 0 0 8px; font-size: 16pt; letter-spacing: 0.5px; background: #f2f2f2; outline: 0; border: 0; box-sizing: border-box; }
        .popup_form_wrap input:last-of-type { margin-bottom: 15px; }
        .popup_form_btn { width: 100%; padding: 15px; font-size: 16pt; font-weight: 400; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.4px; background: #F361A6; outline: 0; border: 0; cursor: pointer; }
        .popup_form_wrap .message { margin: 15px 0 0; font-size: 15pt; font-weight: 400; color: #b3b3b3; letter-spacing: 0.5px; }
        .popup_form_wrap .message span { color: #F361A6; text-decoration: none; cursor: pointer; }

        #naver_id_login { margin-top: 15px; }
        #facebook_login_button { width: 245px; height: 53px; margin: 8px auto 0; font-size: 16px; color: #FFFFFF; background-color: #4267b2; border-radius: 5px; cursor: pointer; }
        #facebook_login_logo_div { width: 52px; height: 53px; display: inline-block; vertical-align: top; }
        #facebook_login_logo_img { width: 38px; margin: 5px 0 0 -8px; }
        #facebook_login_border { width: 2px; height: 53px; display: inline-block;
            background: #888888;
            background: -webkit-linear-gradient(left,#4267b2,#888,#4267b2);
            background: -o-linear-gradient(left,#4267b2,#888,#4267b2);
            background: -moz-linear-gradient(left,#4267b2,#888,#4267b2);
            background: linear-gradient(to right,#4267b2,#888,#4267b2);
        }
        #facebook_login_text { font-family: 'Roboto', sans-serif; width: 191px; padding: 16px 0 13px; letter-spacing: .25px; display: inline-block; font-weight: bold; text-align: center; text-overflow: clip; vertical-align: top; white-space: nowrap; overflow: hidden; border: none; }
    }
</style>


