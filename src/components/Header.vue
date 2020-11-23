<template>
    <div class="header">
        <router-link class="header_logo" to="/">MUSI<span>C</span>OMM</router-link>

        <ul class="header_menu_container">
            <router-link to="/" tag="li" :class="{ active: path === '/' }"><span>메인</span></router-link>
            <router-link to="/latest_music" tag="li" :class="{ active: path === '/latest_music' }"><span>최신음악</span></router-link>
            <router-link to="/artist_list" tag="li" :class="{ active: path === '/artist_list' }"><span>가수목록</span></router-link>
            <router-link to="/theme" tag="li" :class="{ active: path === '/theme' }"><span>테마</span></router-link>

            <li class="sign" v-if="user === ''" @click="showLoginPopup('LOGIN')"><span>로그인</span></li>
            <li class="sign sign_up" v-if="user === ''" @click="showLoginPopup('SIGNUP')"><span>무료 회원가입</span></li>

            <router-link :to="'/profile/' + user" tag="li" class="header_nickname_li" v-if="user !== ''"><span>{{ nickname }}</span></router-link>
            <li class="sign" v-if="user !== ''" @click="signout"><span>로그아웃</span></li>
        </ul>

        <div id="navbar_search_wrap">
            <div id="frame_search_input_wrap">
                <input id='frame_search_input' type="text" placeholder="듣고싶은 음악을 찾아보세요." v-model="searchKeyword" @keydown="searchKeyDown" @keyup="searchKeyUp" @focus="searchFocus = true" @blur="blurSearchInput()" />
                <img src='/images/search_on.png' />
            </div>
            <div id="frame_search_result_wrap" v-if="(searchArtist.id !== '' || searchMusic.length > 0) && searchFocus">
                <div id="frame_search_result_artist_wrap" v-if="searchArtist.id !== ''">
                    <router-link :to="'/artist/' + searchArtist.id" id="frame_search_result_artist_item" v-bind:class="{ active: searchArtist.isActive, border_bottom: searchMusic.length > 0 }">
                        <img id='frame_search_result_artist_image' :src="'/images/artist/' + searchArtist.id + '.jpg'" /><div id='frame_search_result_artist_contents'>
                            <p id='frame_search_result_artist_title'>{{ searchArtist.title }}</p>
                            <p id='frame_search_result_artist_description'><span>{{ searchArtist.type }}</span> <span>{{ searchArtist.debut.substr(0, 4) }}.{{ searchArtist.debut.substr(4, 2) }}.{{ searchArtist.debut.substr(6, 2) }} 데뷔</span></p>
                        </div>
                    </router-link>
                </div>
                <div id="frame_search_result_music_wrap" style="padding-left: 1px;" v-if="searchMusic.length > 0">
                    <router-link :to="'/music/' + music.id" class="frame_search_result_music_item" :class="{ active: music.isActive }" v-for="music in searchMusic" v-bind:key="music.id">{{ music.title }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        data: function () {
            return {
                path: '',
                searchKeyword: '',
                searchArtist: {
                    id: '',
                    title: '',
                    type: '',
                    debut: '',
                    isActive: false
                },
                searchMusic: [],
                searchFocus: false,
                searchTimeStamp: 0,     // 쿼리 속도에 따라 실시간 검색결과 순서가 다를수 있으므로 조정하기 위함
                keyDownTimeStamp: 0     // Vue keydown 이벤트가 한글에서 2번 호출되는것을 조정하기 위함
            }
        },
        computed: {
            user () {
                return this.$store.getters.user;
            },
            nickname () {
                return this.$store.getters.nickname;
            },
            search () {
                return this.debounce(this.requestSearchData, 200);
            }
        },
        watch: {
            $route (to){
                this.path = to.path;
            }
        },
        mounted () {
            this.path = this.$router.currentRoute.path;
        },
        methods: {
            signout: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/main/logout', this.loginParams).then((response) => {
                    if (response.data.code === '0000') {
                        location.reload();
                    } else {
                        this.$showAlert(response.data.message);
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            searchKeyDown: function (event) {
                if( event.key === 'Enter' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    if ((new Date()).getTime() - this.keyDownTimeStamp < 100) {
                        return;
                    }

                    this.keyDownTimeStamp = (new Date()).getTime();

                    if (event.key === 'Enter') {
                        if (this.searchArtist.isActive) {
                            this.$router.push({ path: '/artist/' + this.searchArtist.id });
                            this.searchKeyword = '';
                            event.target.blur();

                        } else {
                            for (let i = 0; i < this.searchMusic.length; i++) {
                                if (this.searchMusic[i].isActive) {
                                    this.$router.push({ path: '/music/' + this.searchMusic[i].id });
                                    this.searchKeyword = '';
                                    event.target.blur();

                                    break;
                                }
                            }
                        }
                    } else if (event.key === 'ArrowUp') {
                        this.searchUpArrow();
                    } else if (event.key === 'ArrowDown') {
                        this.searchDownArrow();
                    }

                    event.preventDefault();
                }
            },
            searchKeyUp: function (event) {
                if( event.key === 'Enter' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    return;
                }

                this.search(event.target.value);
            },
            searchUpArrow: function () {
                if (this.searchArtist.id === '') {
                    let isMusicActive = false;
                    for (let i = 0; i < this.searchMusic.length; i++) {
                        if (this.searchMusic[i].isActive) {
                            isMusicActive = true;
                            this.searchMusic[i].isActive = false;
                            if (i === 0) {
                                this.searchMusic[this.searchMusic.length-1].isActive = true;
                            } else {
                                this.searchMusic[i-1].isActive = true;
                            }
                            break;
                        }
                    }
                    if (!isMusicActive) {
                        this.searchMusic[this.searchMusic.length-1].isActive = true;
                    }
                } else {
                    if (this.searchMusic.length === 0) {
                        this.searchArtist.isActive = !this.searchArtist.isActive;
                    } else {
                        if (this.searchArtist.isActive) {
                            this.searchArtist.isActive = false;
                            this.searchMusic[this.searchMusic.length-1].isActive = true;
                        } else {
                            let isMusicActive = false;
                            for (let i = 0; i < this.searchMusic.length; i++) {
                                if (this.searchMusic[i].isActive) {
                                    isMusicActive = true;
                                    this.searchMusic[i].isActive = false;
                                    if (i === 0) {
                                        this.searchArtist.isActive = true;
                                    } else {
                                        this.searchMusic[i-1].isActive = true;
                                    }
                                    break;
                                }
                            }
                            if (!isMusicActive) {
                                this.searchMusic[this.searchMusic.length-1].isActive = true;
                            }
                        }
                    }
                }
            },
            searchDownArrow: function () {
                if (this.searchArtist.id === '') {
                    let isMusicActive = false;
                    for (let i = 0; i < this.searchMusic.length; i++) {
                        if (this.searchMusic[i].isActive) {
                            isMusicActive = true;
                            this.searchMusic[i].isActive = false;
                            if (i === this.searchMusic.length - 1) {
                                this.searchMusic[0].isActive = true;
                            } else {
                                this.searchMusic[i+1].isActive = true;
                            }
                            break;
                        }
                    }
                    if (!isMusicActive) {
                        this.searchMusic[0].isActive = true;
                    }
                } else {
                    if (this.searchMusic.length === 0) {
                        this.searchArtist.isActive = !this.searchArtist.isActive;
                    } else {
                        if (this.searchArtist.isActive) {
                            this.searchArtist.isActive = false;
                            this.searchMusic[0].isActive = true;
                        } else {
                            let isMusicActive = false;
                            for (let i = 0; i < this.searchMusic.length; i++) {
                                if (this.searchMusic[i].isActive) {
                                    isMusicActive = true;
                                    this.searchMusic[i].isActive = false;
                                    if (i === this.searchMusic.length - 1) {
                                        this.searchArtist.isActive = true;
                                    } else {
                                        this.searchMusic[i+1].isActive = true;
                                    }
                                    break;
                                }
                            }
                            if (!isMusicActive) {
                                this.searchArtist.isActive = true;
                            }
                        }
                    }
                }
            },
            requestSearchData: function (keyword) {
                if (keyword === '') {
                    this.clearSearchResult();

                    return;
                }

                this.searchTimeStamp = (new Date()).getTime();
                this.axios.post(this.$store.getters.serverUrl + 'api/search', {
                    q: keyword,
                    clienttime: this.searchTimeStamp
                }).then((response) => {
                    if (response.data.clienttime < this.searchTimeStamp) {
                        return;
                    }

                    if (keyword === '' || (response.data.artistList.length === 0 && response.data.musicList.length === 0)) {
                        this.clearSearchResult();

                        return;
                    }

                    const tempSearchArtist = {};
                    const tempSearchMusic = [];

                    if (response.data.artistList.length > 0) {
                        tempSearchArtist.id = response.data.artistList[0]._id;
                        tempSearchArtist.title = response.data.artistList[0].title + (response.data.artistList[0].title_en === '' ? '' : ' (' + response.data.artistList[0].title_en + ')');
                        if (response.data.artistList[0].type === 1) {
                            tempSearchArtist.type = '여성 그룹';
                        } else if (response.data.artistList[0].type === 2) {
                            tempSearchArtist.type = '남성 그룹';
                        } else if (response.data.artistList[0].type === 3) {
                            tempSearchArtist.type = '혼성 그룹';
                        } else if (response.data.artistList[0].type === 4) {
                            tempSearchArtist.type = '여성 솔로';
                        } else if (response.data.artistList[0].type === 5) {
                            tempSearchArtist.type = '남성 솔로';
                        }
                        tempSearchArtist.debut = response.data.artistList[0].debut;
                        tempSearchArtist.isActive = false;
                    }

                    response.data.musicList.forEach(music => {
                        tempSearchMusic.push({
                            id: music.video,
                            title: music.title,
                            isActive: false
                        })
                    });

                    this.searchArtist = tempSearchArtist;
                    this.searchMusic = tempSearchMusic;
                }).catch((error) => {
                    console.log(error);
                });
            },
            clearSearchResult: function () {
                this.searchArtist = {
                    id: '',
                    title: '',
                    type: '',
                    debut: '',
                    isActive: false
                };
                this.searchMusic = [];
            },
            showLoginPopup: function (type) {
                this.$store.dispatch('setSignInPopupType', type);
                this.$store.dispatch('setSignInPopupStatus', 'SHOW');
            },
            blurSearchInput: function () {
                setTimeout(() => {
                    this.searchFocus = false;
                }, 200);
            },
            debounce: function (func, wait) {
                let timeout;

                return function executedFunction (...args) {
                    const later = () => {
                        timeout = null;

                        func(...args);
                    };

                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .header {
        & { position: fixed; width: 100%; top: 0; left: 0; z-index: 99; padding-left: 50px; padding-right: 50px; background-color: white; }
        /** { height: 55px; line-height: 55px; }*/

        .header_logo {
            & { float: left; display: block; font-size: 26px; font-weight: 700; color: #535659; letter-spacing: 0; line-height: 55px; }
            span { color: #F361A6; letter-spacing: 0; }
        }

        .header_menu_container {
            & { float: right; list-style: none; line-height: 55px; }
            li {
                & { float: left; padding: 0 15px; cursor: pointer; }

                &:hover span { color: #000000; }
                span { position: relative; position: relative; font-size: 16px; font-weight: 400; color: rgba(0, 0, 0, 0.5);
                    -webkit-transition: all 0.3s ease-in-out 0s;
                    -moz-transition: all 0.3s ease-in-out 0s;
                    -o-transition: all 0.3s ease-in-out 0s;
                    transition: all 0.3s ease-in-out 0s; }
                &.active span:before { content: ''; position: absolute; width: calc(100% + 10px); height: 2px; bottom: -4px; left: -5px; background-color: #F361A6; visibility: visible;
                    -webkit-transform: scaleX(1);
                    -moz-transform: scaleX(1);
                    -o-transform: scaleX(1);
                    transform: scaleX(1);
                    -webkit-transition: all 0.3s ease-in-out 0s;
                    -moz-transition: all 0.3s ease-in-out 0s;
                    -o-transition: all 0.3s ease-in-out 0s;
                    transition: all 0.3s ease-in-out 0s; }

                &.sign { display: block; min-width: 115px; height: 35px; line-height: 34px; margin: 10px 0 0 40px; border: 2px solid #F361A6; text-align: center; background-color: #FFFFFF;
                    -webkit-border-radius: 30px;
                    -moz-border-radius: 30px;
                    border-radius: 30px;
                    -webkit-transition: all 0.3s ease-in-out 0s;
                    -moz-transition: all 0.3s ease-in-out 0s;
                    -o-transition: all 0.3s ease-in-out 0s;
                    transition: all 0.3s ease-in-out 0s; }
                &.sign span { display: block; height: 31px; line-height: 31px; color: #F361A6; }
                &.sign:hover { background-color: #F361A6; }
                &.sign:hover span { color: #FFFFFF; }
                &.sign_up { margin-left: 20px; background-color: #F361A6; }
                &.sign_up span { color: #FFFFFF; }
                &.sign_up:hover { background-color: #FFFFFF; }
                &.sign_up:hover span { color: #F361A6; }
            }

            .header_nickname_li { margin-left: 30px; }
        }

        #navbar_search_wrap { position: relative; width: 350px; height: 55px; margin-right: 50px; padding: 7.5px 0; float: right; text-align: left; }
        #frame_search_input_wrap { border: 2px solid #F361A6; height: 40px; border-radius: 3px; }
        #frame_search_input_wrap > img { width: 36px; height: 36px; padding: 8px; vertical-align: top; cursor: pointer; }
        #frame_search_input { width: 308px; height: 36px; margin-left: 1px; padding-left: 7px; border: none; vertical-align: top; font-size: 15px; font-weight: 400; }

        /* header search bar */
        #frame_search_result_wrap { position: absolute; width: calc(100% - 2px); top: 48px; margin-left: 1px; background-color: #ffffff; border: 1px solid rgba(0,0,0,0.2); border-radius: 3px; }

        #frame_search_result_artist_item { cursor: pointer; vertical-align: top; display: block; }
        #frame_search_result_artist_item:hover {  background-color: #ededed;}
        #frame_search_result_artist_item.border_bottom { border-bottom: 1px solid rgba(0,0,0,0.2); }
        #frame_search_result_artist_image { width: 90px; height: 60px; vertical-align: top; }
        #frame_search_result_artist_contents { width: calc(100% - 90px); display: inline-block; vertical-align: top; }
        #frame_search_result_artist_title { padding: 11px 0 7px 10px; margin: 0; font-size: 16px; font-weight: 400; color: #000000; transition: 0.5s; line-height: 1; }
        #frame_search_result_artist_item:hover #frame_search_result_artist_title { color: #F361A6; }
        #frame_search_result_artist_description { padding: 0 0 0 10px; margin: 0; font-size: 13px; font-weight: 400; color: rgba(0, 0, 0, 0.5); line-height: 1; }

        .frame_search_result_music_item { padding: 7px 0 7px 9px; margin: 0; font-size: 14px; font-weight: 400; cursor: pointer; color: rgba(0, 0, 0, 0.5); display: block; line-height: 1; }
        .frame_search_result_music_item:hover { background-color: #ededed; text-decoration: none; }
        .frame_search_result_music_item.active { background-color: #ededed; color: #F361A6; outline: none; text-decoration: none; }
        #frame_search_result_artist_item.active { background-color: #ededed; text-decoration: none; }
        #frame_search_result_artist_item.active #frame_search_result_artist_title { color: #F361A6; text-decoration: none; }
    }

    @media only screen and (max-width: 1440px) {
        .header {
            .header_logo {
                & { font-size: 25px; }
            }

            .header_menu_container {
                li {
                    span { font-size: 15px; }
                }
            }
        }

    }
</style>


