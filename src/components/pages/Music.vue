<template>
    <div id="music_template" ref="musicTemplate">
        <div id="music_container">
            <div class="container">
                <p id="music_title">음악 정보</p>

                <section id="music_info_section" v-if="isLoaded">
                    <div id="music_info_player_wrap" ref="playerContainer">
                        <div id="music_info_player"></div>
                    </div>

                    <div id="music_info_wrap">
                        <div>
                            <span class="music_info_title">곡 명</span>
                            <span class="music_info_contents">{{ musicTitle }}</span>
                        </div>
                        <div>
                            <span class="music_info_title">아티스트</span>
                            <span class="music_info_contents">
                                <span v-for="(singer, index) in musicSinger" :key="index">
                                    <span v-if="index !== 0">, </span>
                                    <span class="music_info_artist" v-if="singer._id === ''">{{ singer.name }}</span>
                                    <router-link :to="'/artist/' + singer._id" class="music_info_artist" v-else>{{ singer.name }}</router-link>
                                </span>
                            </span>
                        </div>
                        <div>
                            <span class="music_info_title">조회수</span>
                            <span class="music_info_contents">{{ musicPlayCount }} 회</span>
                        </div>
                        <div>
                            <span class="music_info_title">발매일</span>
                            <span class="music_info_contents">{{ musicRelease.substr(0, 4) }}. {{ musicRelease.substr(4, 2) }}. {{ musicRelease.substr(6, 2) }} 발매</span>
                        </div>
                        <div>
                            <span class="music_info_title">즐겨찾기</span>
                            <img class="music_info_fav" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(videoId, false)" v-if="isMusicFavorite" />
                            <img class="music_info_fav" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="favoriteMusic(videoId, true)" v-else />

                            <span class="music_info_fav_count">{{ musicFavoriteCount }} Likes</span>
                        </div>
                    </div>
                </section>

                <section id="music_lyrics_section">
                    <p class="music_lyrics_title">가사</p>
                    <div class="music_lyrics_contents" :class="{on: isExpandLyrics}">
                        <p v-for="(line, index) in lyrics" :key="index">
                            <span v-if="line === ''" class="empty"></span>
                            <span v-else-if="index > 0">{{ line }}</span>
                        </p>
                    </div>

                    <div class="music_lyrics_more_button_wrap">
                        <div class="music_lyrics_more_button" @click="isExpandLyrics = !isExpandLyrics">
                            <span v-if="isExpandLyrics">접기</span>
                            <span v-else>펼치기</span>
                            <img v-if="isExpandLyrics" src="/images/up_arrow.png" />
                            <img v-else src="/images/down_arrow.png" />
                        </div>
                    </div>
                </section>

                <section id="artist_music_list_section">
                    <span class="artist_music_list_title">{{ musicArtistName }}의 다른 음악</span>

                    <div style="position: relative;">
                        <div class="music_video_list_pagination_btn" @click="handleClickPrev">
                            <img v-if="musicListPage === 1" class="left" src="/images/left_arrow_off.png" alt="" />
                            <img v-else class="left" src="/images/left_arrow_on.png" alt="" />
                        </div><div id="music_video_list_wrap">
                            <MusicItem v-for="(music, index) in exposedLatestMusic" :key="index" :music="music" @play="playMusic" @favorite="favoriteMusic" />
                        </div><div class="music_video_list_pagination_btn right" @click="handleClickNext">
                            <img v-if="musicList.length <= musicListPage * musicCountPerPage" class="right" src="/images/right_arrow_off.png" alt="" />
                            <img v-else class="right" src="/images/right_arrow_on.png" alt="" />
                        </div>
                    </div>
                </section>
            </div>
            <div>
                <div class="ad_container">
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
        </div>
    </div>
</template>

<script>
    import MusicItem from "../MusicItem"
    import Adsense from "../Adsense";

    export default {
        metaInfo() {
            const videoId = this.videoId;
            const musicTitle = this.musicTitle;
            const musicArtistTitle = this.musicArtistTitle;
            return {
                title: musicArtistTitle + ' - ' + musicTitle + ' | 무료 음악감상 사이트 뮤지컴',
                titleTemplate: musicArtistTitle + ' - ' + musicTitle + ' | 무료 음악감상 사이트 뮤지컴',
                meta: [
                    { vmid: 'description', name: 'description', content: '음악 감상과 함께 가사와 관련된 음악을 제공합니다.' },
                    { vmid: 'og:type', property: 'og:type', content: 'website' },
                    { vmid: 'og:title', property: 'og:title', content: musicArtistTitle + ' - ' + musicTitle + ' | 무료 음악감상 사이트 뮤지컴' },
                    { vmid: 'og:description', property: 'og:description', content: '음악 감상과 함께 가사와 관련된 음악을 제공합니다.' },
                    { vmid: 'og:image', property: 'og:image', content: 'https://i.ytimg.com/vi/' + videoId + '/mqdefault.jpg' },
                    { vmid: 'og:url', property: 'og:url', content: 'https://www.musicomm.co.kr/music/' + videoId }
                ]
            }
        },
        name: 'Music',
        components: {
            MusicItem,
            Adsense,
        },
        props: {
            videoId: String
        },
        data: function () {
            return {
                isLoaded: false,
                YT: null,
                player: null,
                playerInterval: null,
                playCount: 0,
                musicTitle: '',
                musicArtistId: '',
                musicArtistName: '',
                musicArtistTitle: '',
                musicSinger: [],
                musicPlayCount: 0,
                musicRelease: '20000101',
                isMusicFavorite: false,
                musicFavoriteCount: 0,
                lyrics: [],
                isExpandLyrics: false,
                musicList: [],
                musicListPage: 1
            }
        },
        computed: {
            resolution () {
                return this.$store.getters.resolution;
            },
            musicCountPerPage () {
                if (this.resolution === 'MEDIUM') {
                    return 3;
                } else {
                    return 4;
                }
            },
            exposedLatestMusic () {
                return this.musicList.slice((this.musicListPage - 1) * this.musicCountPerPage, this.musicListPage * this.musicCountPerPage);
            }
        },
        watch: {
            videoId () {
                this.musicList = [];
                this.musicListPage = 1;
                this.$refs.musicTemplate.scrollTop = 0;

                this.$store.dispatch('setLoading', true);

                this.getMusicInfo();
            },
            musicCountPerPage: {
                handler (value) {
                    if (this.musicListPage * value > this.musicList.length) {
                        const musicListPage = Math.ceil(this.musicList.length / value);
                        this.musicListPage = (musicListPage === 0 ? 1 : musicListPage);
                    }
                }
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getMusicInfo();
        },
        methods: {
            onPlayerReady: function () {
                // event.target.playVideo();
            },
            onPlayerStateChange: function (event) {
                if(event.data === this.YT.PlayerState.ENDED) {
                    if( this.playerInterval != null ) {
                        clearInterval(this.playerInterval);
                        this.playerInterval = null;
                    }

                    this.player.seekTo(0);
                } else if(event.data === this.YT.PlayerState.PLAYING) {
                    if (this.playerInterval == null) {
                        this.playerInterval = setInterval(() => {
                            this.playCount++;

                            if(this.playCount === 300) {
                                this.axios.post(this.$store.getters.serverUrl + 'api/music/play', {
                                    video: this.videoId,
                                    artist: this.musicArtistId
                                }).then(() => {
                                    //
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        }, 200);
                    }
                } else if(event.data === this.YT.PlayerState.PAUSED || event.data === this.YT.PlayerState.UNSTARTED || event.data === this.YT.PlayerState.BUFFERING) {
                    if( this.playerInterval != null ) {
                        clearInterval(this.playerInterval);
                        this.playerInterval = null;
                    }
                }
            },
            start: function () {
                this.playCount = 0;

                if (this.player === null) {
                    try {
                        this.player = new this.YT.Player('music_info_player', {
                            width: this.$refs.playerContainer.clientWidth,
                            height: this.$refs.playerContainer.clientWidth / 16 * 9,
                            playerVars: {
                                'autoplay': 0,
                                'controls': 1,
                                'cc_load_policy': 0,
                                'disablekb': 1,
                                'iv_load_policy': 3,
                                'loop': 1,
                                'modestbranding': 1,
                                'rel': 0,
                                'showinfo': 0,
                                'playsinline': 0
                            },
                            videoId: this.videoId,
                            events: {
                                'onReady': this.onPlayerReady,
                                'onStateChange': this.onPlayerStateChange
                            }
                        });
                    } catch (e) {
                        console.log(e);
                        setTimeout(() => {
                            this.start();
                        }, 500);
                    }
                } else {
                    try {
                        this.player.cueVideoById(this.videoId, 0, 'hd1080');
                    } catch (e) {
                        console.log('아직 음악을 재생할 준비가 되지 않았습니다<br/>다시 한번 시도해주세요');
                    }
                }
            },
            getMusicInfo: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/music/detail', {
                    no: this.videoId
                }).then((response) => {
                    response = response.data.result;

                    const musicInfo = response.musicInfo;

                    this.musicTitle = musicInfo.title;
                    this.musicPlayCount = musicInfo.playCount;
                    this.musicRelease = musicInfo.release;
                    this.isMusicFavorite = musicInfo.isFavorite !== -1;
                    this.musicFavoriteCount = musicInfo.favCount;
                    this.musicSinger = musicInfo.singer.map(singer => {
                        singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        return singer;
                    });
                    this.musicArtistId = musicInfo.singer[0]._id;
                    this.musicArtistName = musicInfo.singer[0].name;
                    this.musicArtistTitle = musicInfo.singer[0].title + (musicInfo.singer[0].title_en === '' ? '' : '(' + musicInfo.singer[0].title_en + ')');

                    this.lyrics = response.lyrics.split('\n');
                    this.musicList = response.musicList.map(music => {
                        music.isActive = false;
                        music.isArrow = false;
                        music.isFavorite = music.isFavorite !== -1;
                        music.artistId = this.musicArtistId;
                        music.artist = this.musicArtistTitle;
                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });

                        return music;
                    });

                    this.isLoaded = true;

                    this.$store.dispatch('setLoading', false);

                    if (this.YT !== null) {
                        this.start();
                    } else {
                        let youtubePlayerInterval = setInterval(() => {
                            if (window.YT !== undefined) {
                                clearInterval(youtubePlayerInterval);
                                youtubePlayerInterval = null;

                                this.YT = window.YT;

                                this.start();
                            }
                        }, 200);
                    }
                }).catch((error) => {
                    console.log(error);

                    this.$store.dispatch('setLoading', false);
                });
            },
            playMusic: function (videoId) {
                this.$router.push({ path: '/music/' + videoId });
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
                    if (this.videoId === videoId) {
                        if (isFavorite) {
                            this.isMusicFavorite = true;
                            this.musicFavoriteCount += 1;
                        } else {
                            this.isMusicFavorite = false;
                            this.musicFavoriteCount -= 1;
                        }
                    } else {
                        this.musicList.forEach(music => {
                            if (music.video === videoId) {
                                music.isFavorite = isFavorite;
                            }
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            handleClickPrev: function () {
                if (this.musicListPage === 1) {
                    return;
                }

                this.musicListPage--;
            },
            handleClickNext: function () {
                if (this.musicList.length <= this.musicListPage * this.musicCountPerPage) {
                    return;
                }

                this.musicListPage++;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #music_template {
        & { min-height: 100%; height: 100%; overflow-y: auto; }

        #music_container {
            & { position: relative; width: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            .container { width: 100%; padding: 30px 50px 0; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }
            .ad_container { width: 100%; height: auto; text-align: center; padding: 10px 0 3px 0; }

            #music_title { font-size: 26px; margin-bottom: 15px; padding-left: 10px; display: block; }

            #music_info_section {
                & { padding: 0 10px 40px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                #music_info_player_wrap { position: relative; width: 100%; min-height: 410px; }
                #music_info_wrap {
                    & { margin-top: 20px; }

                    span { font-size: 15px; color: #FFFFFF; line-height: 30px; }
                    .music_info_title { width: 110px; display: inline-block; color: #DDDDDD; }
                    .music_info_artist { cursor: pointer; color: #FFFFFF; transition: initial; }
                    .music_info_artist:hover { text-decoration: underline; }
                    .music_info_fav { width: 30px; padding: 5px; margin: -2px 0 0 -5px; vertical-align: top; cursor: pointer; }
                    .music_info_fav_count { padding-left: 5px; }
                }
            }

            #music_lyrics_section {
                & { padding: 0 10px 40px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                .music_lyrics_title { font-size: 26px; line-height: 30px; margin-bottom: 15px; color: #FFFFFF; }
                .music_lyrics_contents { max-height: 250px; overflow: hidden; -webkit-transition: max-height 1.0s ease-out; transition: max-height 1.0s ease-out; }
                .music_lyrics_contents.on { max-height: initial; }
                .music_lyrics_contents > p { margin: 0; line-height: 27px; font-size: 15px; font-weight: 400; color: #EEEEEE; }
                .music_lyrics_contents .empty { height: 15px; display: block; }

                .music_lyrics_more_button_wrap { height: 40px; text-align: center; }
                .music_lyrics_more_button { display: inline-block; cursor: pointer; }
                .music_lyrics_more_button > span { height: 40px; line-height: 40px; vertical-align: top; font-size: 17px; font-weight: 400; color: #FFFFFF; }
                .music_lyrics_more_button > img { width: 12px; line-height: 40px; vertical-align: top; margin: 13px 0 0 5px; }
                .music_lyrics_more_button:hover > span { text-decoration: underline; }
            }


            #artist_music_list_section {
                & { min-height: 300px; padding: 0 10px 0; }

                .artist_music_list_title { height: 30px; line-height: 30px; margin: 0 0 20px 5px; display: block; font-size: 26px; color: #FFF; }

                #music_video_list_wrap {
                    & { width: calc(100% - 70px); margin: 0 auto; display: block; vertical-align: top; }
                }

                .music_video_list_pagination_btn {
                    & { position: absolute; width: 30px; height: 30px; top: 50%; margin-top: -30px; background-color: white; display: inline-block; border-radius: 50%; cursor: pointer; }
                    &.right { right: 0; }
                    .left { width: 16px; margin: 7px 0 0 6px; }
                    .right { width: 16px; margin: 7px 0 0 8px; }
                }

            }
        }
    }
</style>
