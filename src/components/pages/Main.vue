<template>
    <div class="main_template">
        <section id="latest_music_container">
            <div class="container">
                <p id="latest_music_title">최신 음악</p>
                <p id="latest_music_subtitle">가장 최근에 발매된 뮤직비디오 목록입니다.</p>
                <router-link to="/latest_music" id="latest_music_more_a"><span id="latest_music_more_span">더보기</span> <span>></span></router-link>

                <div id="music_video_list_wrap">
                    <MusicItem v-for="(music, index) in exposedLatestMusic" :key="index" :music="music" @play="playLatestMusic" @favorite="favoriteMusic" />
                </div>
            </div>
        </section>

        <section id="ranked_music_container">
            <div class="container">
                <p id="ranked_music_title">실시간 순위</p>
                <p id="ranked_music_subtitle">순위는 실시간 조회수를 기준으로 집계됩니다.</p>

                <div>
                    <div class="music_list_wrap">
                        <div class="music_list_header_div">
                            <div class="music_list_item_music_name_div">
                                <span class="music_list_item_rank">순위</span><span class="music_list_item_music_name">곡</span>
                            </div>
                            <div class="music_list_item_artist_div">
                                <span>가수</span>
                            </div>
                            <div class="music_list_item_play_div">
                                <span>재생</span>
                            </div>
                            <div class="music_list_item_fav_div">
                                <span>즐겨찾기</span>
                            </div>
                        </div>

                        <div class="music_list_item" v-bind:class="{ on: music.isActive }" v-for="(music, index) in rankedMusic" :key="index" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false">
                            <div class="music_list_item_music_name_div">
                                <div class="music_list_item_rank_div">
                                    <span class="music_list_item_rank">{{ index+1 }}</span>
                                    <router-link :to="'/music/' + music.video" class="music_list_item_thumbnail_a">
                                        <img class="music_list_item_thumbnail" :src="'https://i.ytimg.com/vi/' + music.video + '/mqdefault.jpg'" :alt="music.title" />
                                    </router-link>
                                </div>
                                <span class="music_list_item_music_name">
                                    <router-link :to="'/music/' + music.video">{{ music.title }}</router-link>
                                </span>
                            </div>
                            <div class="music_list_item_artist_div">
                                <span class="music_list_item_artist">
                                    <router-link :to="'/artist/' + music.artistId">{{ music.artist }}</router-link>
                                </span>
                            </div>
                            <div class="music_list_item_play_div" @click="playRankedMusic(music.video)">
                                <img class="music_list_item_play" src="/images/icon_play_not_filled.png" alt="재생" />
                            </div>
                            <div class="music_list_item_fav_div">
                                <img class="music_list_item_fav on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(music.video, false)" v-if="music.isFavorite" />
                                <img class="music_list_item_fav" src="/images/icon_fav_not_on.png" alt="즐겨찾기 취소" @click="favoriteMusic(music.video, true)" v-else />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="guide_container">
            <div class="fh5co-team">
                <div class="container">
                    <p id="service_introduction_title">서비스 소개</p>
                    <p id="service_introduction_subtitle">뮤지컴(Musicomm) 서비스에 대해서 소개합니다</p>
                    <div>
                        <div class="service_introduction_item left">
                            <img class="service_introduction_item_img" src="/images/guide01.jpg" alt="뮤지컴 서비스 소개 이미지01" />
                            <div class="service_introduction_item_text_wrap">
                                <span class="service_introduction_item_text">01. 원하는 아티스트를 선택하세요.</span>
                                <span class="service_introduction_item_subtext"><br/>K-POP 아티스트 중에서 원하는 그룹 및 솔로를 선택하세요!<br/>오른쪽 하트모양을 누르시면 내가 좋아하는 아티스트를 상단으로 끌어올릴 수 있습니다!</span>
                            </div>
                        </div>
                        <div class="service_introduction_item right">
                            <div class="service_introduction_item_text_wrap">
                                <span class="service_introduction_item_text">02. 듣고싶은 음악을 선택하세요.</span>
                                <span class="service_introduction_item_subtext"><br/>각 아티스트의 데뷔곡부터 최신 발매된 뮤직비디오까지 원하는 음악을 감상하세요!<br/>즐겨찾기를 통해 개인 플레이리스트에 모아서 원하는 음악을 한번에 들을 수 있습니다!<br/><br/>듣고싶은 음악이 없다면 하단의 피드백을 남겨주세요.<br/>아티스트와 음악은 매주 업데이트 됩니다.</span>
                            </div>
                            <img class="service_introduction_item_img" src="/images/guide02.jpg" alt="뮤지컴 서비스 소개 이미지02" />
                        </div>
                        <div class="service_introduction_item left">
                            <img class="service_introduction_item_img" src="/images/guide03.jpg" alt="뮤지컴 서비스 소개 이미지03" />
                            <div class="service_introduction_item_text_wrap">
                                <span class="service_introduction_item_text">03. 뮤직플레이어를 통해 음악을 감상하세요.</span>
                                <span class="service_introduction_item_subtext"><br/>음악을 재생하면 자동으로 플레이리스트가 구성됩니다.<br/><br/>한곡 반복, 재생목록 섞기(셔플) 기능을 이용해 매번 다른 패턴의 음악을 즐기세요!<br/>전체화면 기능을 이용해 넓은 화면에서 뮤직비디오를 감상하세요!</span>
                            </div>
                        </div>
                        <div class="service_introduction_item right">
                            <div class="service_introduction_item_text_wrap">
                                <span class="service_introduction_item_text">04. 매일매일 변하는 주간 순위를 지켜보세요.</span>
                                <span class="service_introduction_item_subtext"><br/>주간 순위는 2주 동안의 조회수를 기준으로 집계됩니다.<br/>2주간 많이 재생된 음악과 아티스트를 차트에서 볼 수 있습니다.<br/><br/>여러분이 좋아하는 아티스트의 순위를 올려주세요!</span>
                            </div>
                            <img class="service_introduction_item_img" src="/images/guide04.jpg" alt="뮤지컴 서비스 소개 이미지04" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="footer_container">
            <div class="container">
                <div class="left_container">
                    <h3 class="footer_title">About Us</h3>
                    <ul class="footer_info">
                        <li><img src="/images/icon_man.png" />개발자 남승호</li>
                        <li><img src="/images/icon_mail.png" />skatmdgh1221@nate.com</li>
                        <li><img src="/images/icon_global.png" />https://www.musicomm.co.kr</li>
                    </ul>
                    <p class="footer_copyright">&copy; 2018 Musicomm. All Rights Reserved.</p>
                </div>
                <div class="right_container">
                    <h3 class="footer_title">피드백 보내기</h3>
                    <p class="footer_subtitle">Musicomm 이용 시 문제가 발생하거나 개선할 점을 보내주시면 빠르게 반영하도록 하겠습니다.</p>
                    <div class="footer_input_wrap">
                        <input type="email" id="email" placeholder="이메일" v-model="reportEmail">
                    </div>
                    <div class="footer_input_wrap">
                        <textarea id="message" rows="7" placeholder="피드백 내용" v-model="reportMessage" />
                    </div>
                    <div class="footer_input_wrap">
                        <div id="send_report_btn" class="footer_send_button" @click="sendReport">보내기</div>
                    </div>
                </div>
            </div>

            <div>
                <div class="container" style=" position: relative; width: 100%; height: auto; text-align: center; padding: 0;">
                    <div style="width: 50%; height: 100%; display: inline-block; text-align: right; padding-right: 7px;">
                        <!-- 데스크탑 하단 배너 01 -->
                        <Adsense :styles="'display:inline-block;width:468px;height:60px'" :clientNo="'ca-pub-7268044498226837'" :slotNo="'4528767521'" />
                    </div>
                    <div style="width: 50%; height: 100%; display: inline-block; text-align: left; padding-left: 7px;">
                        <!-- 데스크탑 하단 배너 02 -->
                        <Adsense :styles="'display:inline-block;width:468px;height:60px'" :clientNo="'ca-pub-7268044498226837'" :slotNo="'1371803915'" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import MusicItem from "../MusicItem";
    import Adsense from "../Adsense";

    export default {
        metaInfo: {
            title: '뮤지컴 - 무료 음악감상 사이트',
            titleTemplate: '뮤지컴- 무료 음악감상 사이트',
            meta: [
                { vmid: 'description', name: 'description', content: '무료 음악감상 사이트 뮤지컴입니다. 가사와 사용자별 플레이리스트를 제공합니다.' }
            ]
        },
        name: 'Main',
        components: {
            MusicItem,
            Adsense
        },
        data: function () {
            return {
                latestMusic: [],
                rankedMusic: [],
                axiosCount: 0,
                reportEmail: '',
                reportMessage: ''
            }
        },
        computed: {
            resolution () {
                return this.$store.getters.resolution;
            },
            exposedLatestMusic () {
                if (this.resolution === 'MEDIUM') {
                    return this.latestMusic.slice(0, 6);
                } else {
                    return this.latestMusic;
                }
            }
        },
        watch: {
            axiosCount (axiosCount) {
                if (axiosCount === 2) {
                    this.$store.dispatch('setLoading', false);
                }
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getLatestMusic();
            this.getRankedMusic();
        },
        methods: {
            getLatestMusic: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/music/latest_music', {}).then((response) => {
                    this.axiosCount++;

                    this.latestMusic = response.data.result.map(music => {
                        music.isActive = false;
                        music.isArrow = false;
                        music.isFavorite = music.isFavorite !== -1;
                        music.artist += (music.artist_en === '' ? '' : ' (' + music.artist_en + ')');
                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });
                        return music;
                    });
                }).catch((error) => {
                    this.axiosCount++;

                    console.log(error);
                });
            },
            getRankedMusic: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/music/ranked_music', {}).then((response) => {
                    this.axiosCount++;

                    this.rankedMusic = response.data.result.map(music => {
                        music.isActive = false;
                        music.isFavorite = music.isFavorite !== -1;
                        music.artist += (music.artist_en === '' ? '' : ' (' + music.artist_en + ')');
                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });
                        return music;
                    });
                }).catch((error) => {
                    this.axiosCount++;

                    console.log(error);
                });
            },
            playLatestMusic: function (videoId) {
                const playlist = this.exposedLatestMusic.map(music => {
                    return {
                        video   : music.video,
                        artist  : music.artistId,
                        title   : music.title,
                        singer  : music.singer
                    }
                });

                this.$store.dispatch('setPlaylist', playlist);
                this.$store.dispatch('setVideoId', videoId);
            },
            playRankedMusic: function (videoId) {
                const playlist = this.rankedMusic.map(music => {
                    return {
                        video   : music.video,
                        artist  : music.artistId,
                        title   : music.title,
                        singer  : music.singer
                    }
                });

                this.$store.dispatch('setPlaylist', playlist);
                this.$store.dispatch('setVideoId', videoId);
            },
            favoriteMusic: function (videoId, isFavorite) {
                if (this.$store.getters.user === '') {
                    this.$showAlert('로그인이 필요합니다', '확인', () => {
                        this.$store.dispatch('setSignInPopupType', 'LOGIN');
                        this.$store.dispatch('setSignInPopupStatus', 'SHOW');
                    });
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/music/favorite', {
                    videoId: videoId,
                    userId: this.$store.getters.user,
                    type: (isFavorite ? 1 : 2)
                }).then(() => {
                    this.rankedMusic.forEach(music => {
                        if (music.video === videoId) {
                            music.isFavorite = isFavorite;
                        }
                    });
                    this.latestMusic.forEach(music => {
                        if (music.video === videoId) {
                            music.isFavorite = isFavorite;
                        }
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            sendReport: function() {
                if (this.reportEmail === '') {
                    this.$showAlert('이메일을 입력하세요');
                    return;
                }
                if (this.reportMessage === '') {
                    this.$showAlert('내용을 입력하세요');
                    return;
                }
                if (!this.validationEmail(this.reportEmail)) {
                    this.$showAlert('유효한 이메일이 아닙니다');
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/report', {
                    email: this.reportEmail,
                    message: this.reportMessage
                }).then((response) => {
                    if (response.data.code === '0000') {
                        this.$showAlert('피드백을 남겨주셔서 감사합니다<br/>검토 후 서비스에 반영토록 하겠습니다', '확인', () => {
                            this.reportEmail = '';
                            this.reportMessage = '';
                        });
                    } else {
                        //
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            validationEmail: function (email) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .main_template {
        & { min-height: 100%; }

        #latest_music_container {
            & { position: relative; width: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            .container { width: 100%; padding: 30px 50px 20px; margin: 0 auto; }

            #latest_music_title { font-size: 26px; margin: 0 0 8px 0; display: block; padding-left: 10px; }
            #latest_music_subtitle { font-size: 18px; margin: 0 0 12px 0; display: inline-block; vertical-align: top; padding-left: 10px; }
            #latest_music_more_a {
                & { display: inline-block; color: white; float: right; margin-top: 6px; padding-right: 10px; font-weight: 400; text-decoration: none; cursor: pointer; line-height: 1; }
                span { font-size: 18px; vertical-align: top; }
                /*#latest_music_more_span { font-size: 16pt; margin-top: 0; }*/
                &:hover #latest_music_more_span { text-decoration: underline; }
            }
        }

        #ranked_music_container {
            & { position: relative; background: #FFFFFF; }
            .container { padding: 2.2em 50px; }

            #ranked_music_title { font-size: 26px; margin: 0 0 8px 0; padding-left: 10px; display: block; color: #6f787f; }
            #ranked_music_subtitle { font-size: 18px; margin: 0 0 12px 0; padding-left: 10px; display: inline-block; color: #6f787f; }
            .music_list_wrap {
                & { padding-top: 0; }
                span, a { color: #6f787f; line-height: 48px; font-size: 15px; font-weight: 400; display: inline-block; vertical-align: top; }

                .music_list_header_div { border-top: 2px solid #AAAAAA; border-bottom: 1px solid #AAAAAA; }
                .music_list_header_div > div { vertical-align: top; }
                .music_list_header_div > div > .music_list_item_rank { width: 160px; text-align: center; margin-left: 10px; }
                .music_list_header_div > div > .music_list_item_music_name { margin-left: 14px; }

                .music_list_item_music_name_div { width: 52%; display: inline-block; margin: 0; }
                .music_list_item_artist_div { width: 32%; display: inline-block; text-align: left; }
                .music_list_item_play_div { width: 8%; display: inline-block; text-align: center; }
                .music_list_item_fav_div { width: 8%; display: inline-block; text-align: center; }
                .music_list_item_rank_div { width: 160px; display: inline-block; text-align: center; margin-left: 10px; }

                .music_list_item {
                    & { height: 49px; border-top: 1px solid #AAAAAA; overflow: hidden; -webkit-transition: height .4s; transition: height .4s; }
                    span { -webkit-transition: line-height .4s; transition: line-height .4s; }
                    img { -webkit-transition: margin-top .4s; transition: margin-top .4s; }

                    .music_list_item_thumbnail_a { cursor: default; margin-top: 10px; }
                    .music_list_item_thumbnail { display: none; cursor: pointer; }
                    .music_list_item_music_name { width: calc(100% - 194px); margin-left: 14px; }
                    .music_list_item_music_name a { max-width: 100%; margin-top: 0; display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; cursor: pointer; transition: margin-top .4s; }
                    .music_list_item_music_name a:hover { text-decoration: underline; }
                    .music_list_item_artist { width: 100%; }
                    .music_list_item_artist a { max-width: 100%; margin-top: 0; display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; cursor: pointer; transition: margin-top .4s; }
                    .music_list_item_artist a:hover { text-decoration: underline; }
                    .music_list_item_fav { width: 45px; padding: 11px; margin-top: 2.5px; vertical-align: top; cursor: pointer; }
                    .music_list_item_play { width: 45px; padding: 13px; margin-top: 2.5px; vertical-align: top; cursor: pointer; }
                }

                .music_list_item.on {
                    & { height: 109px; }
                    span { line-height: 110px; }

                    .music_list_item_thumbnail { width: 160px; height: 90px; display: block; }
                    .music_list_item_rank { display: none; }
                    .music_list_item_music_name a { margin-top: 31px; }
                    .music_list_item_artist a { margin-top: 31px; }
                    .music_list_item_fav { margin-top: 32.5px; }
                    .music_list_item_play { margin-top: 32.5px; }
                }
            }
        }

        #guide_container {
            & { background: #f1faff; padding: 2.2em 50px; }

            #service_introduction_title { font-size: 26px; margin: 0 0 8px 0; padding-left: 10px; display: block; color: #6f787f; }
            #service_introduction_subtitle { font-size: 18px; margin: 0 0 12px 0; padding-left: 10px; display: inline-block; color: #6f787f; }
            .service_introduction_item { display: block; margin-top: 25px; }
            .service_introduction_item:first-child { margin-top: 0; }
            .service_introduction_item.left { text-align: left; }
            .service_introduction_item.right { text-align: right; }
            .service_introduction_item_img { width: 400px; }
            .service_introduction_item .service_introduction_item_text_wrap { width: calc(100% - 420px); display: inline-block; vertical-align: top; line-height: 1.3; }
            .service_introduction_item.left .service_introduction_item_text_wrap { margin-left: 15px; }
            .service_introduction_item.right .service_introduction_item_text_wrap { margin-right: 15px; }
            .service_introduction_item_text { font-size: 22px; font-weight: 400; color: #6f787f; padding-top: 5px; display: block; }
            .service_introduction_item_subtext { font-size: 15px; font-weight: 400; color: #6f787f; display: block; }
        }

        #footer_container {
            & { background: #3f5267; font-weight: 400; letter-spacing: 0;
                color: #74889e;
            }

            .container {
                & { padding: 2.2em 50px; letter-spacing: 1px; }
                & > div { width: 41.666%; padding: 0 15px; display: inline-block; vertical-align: top; }

                .left_container { margin-left: 8.333%; }
                .footer_title { position: relative; margin-bottom: 20px; padding-bottom: 12px; font-size: 22px; font-weight: 400; color: #fff; line-height: 1.5; }
                .footer_title:after { position: absolute; content: ''; width: 35px; height: 2px; bottom: 0; left: 0; display: block; background: #1fb5f6; }
                .footer_subtitle { font-size: 15px; margin-bottom: 20px; color: #fff; line-height: 1.5; }
                .footer_info { margin-bottom: 60px; }
                .footer_info li { position: relative; margin-bottom: 12px; line-height: 22px; font-size: 15px; color: #fff; list-style: none; }
                .footer_info img { height: 22px; margin: 1px 12px 0 0; vertical-align: top; }
                .footer_copyright { position: relative; padding-top: 20px; font-size: 15px; color: #fff; }
                .footer_copyright:after { position: absolute; content: ''; width: 35px; height: 2px; top: 0; left: 0; display: block; background: #1fb5f6; }
                .footer_send_button { width: 150px; padding: 9px 0 11px; font-size: 16px; color: #fff; text-align: center; vertical-align: middle; line-height: 1.42857; background: #F361A6; border-radius: 4px; float: right; cursor: pointer; }

                .footer_input_wrap {
                    & { margin-bottom: 15px; }
                    & input, & textarea { width: 100%; height: 42px; padding: 10px 15px; line-height: 1.5; display: block; font-size: 15px; color: #fff; letter-spacing: 1px; background: #485b71; border-radius: 4px; border: none; box-shadow: none; }
                    & textarea { height: initial; resize: none; }
                    & input::placeholder, & textarea::placeholder,
                    & input::-webkit-input-placeholder, & textarea::-webkit-input-placeholder,
                    & input::-moz-placeholder, & textarea::-moz-placeholder,
                    & input:-moz-placeholder, & textarea:-moz-placeholder,
                    & input:-ms-input-placeholder,& textarea:-ms-input-placeholder { color: rgba(255, 255, 255, 0.5); }
                }
            }
        }
    }

    @media only screen and (max-width: 1440px) {
        .main_template {
            /* */
        }
    }
</style>
