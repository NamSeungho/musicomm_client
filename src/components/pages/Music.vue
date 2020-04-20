<template>
    <div id="music_template" ref="musicTemplate">
        <div id="music_container">
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
                        <span v-if="line === ''"> </span>
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
                <div id="artist_music_list_header">
                    <span class="artist_music_list_title">{{ musicArtistName }}의 다른 음악</span>

                    <div id="artist_music_list_paging_wrap">
                        <span class="left" v-if="musicListPage === 0"><img src="/images/left_arrow_off.png" alt="" /></span>
                        <span class="left" v-else @click="musicListPage -= 1"><img src="/images/left_arrow_on.png" alt="" /></span>
                        <span class="right" v-if="musicList.length <= (musicListPage+1) * 4"><img src="/images/right_arrow_off.png" alt="" /></span>
                        <span class="right" v-else @click="musicListPage += 1"><img src="/images/right_arrow_on.png" alt="" /></span>
                    </div>
                </div>
                <div id="music_video_list_wrap">
                    <div class="music_item" v-for="(music, index) in computedMusicList" v-bind:key="index">
                        <div class="music_item_info_wrap">
                            <div>
                                <router-link :to="'/music/' + music.video" tag="div" class="music_item_thumbnail_cover" v-bind:class="{ active: music.isActive }" @mouseenter.native="music.isActive = true" @mouseleave.native="music.isActive = false" @mousemove.native="music.isActive = true">
                                    <img class="music_item_thumbnail_cover_img" src="/images/icon_play_round.png" alt="" />
                                </router-link>
                                <img class="music_item_thumbnail" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" :src="'https://i.ytimg.com/vi/' + music.video + '/mqdefault.jpg'" :alt="music.title" />
                            </div>
                            <div class="music_item_info">
                                <router-link :to="'/music/' + music.video" class="music_item_title">{{ music.title }}</router-link>
                                <router-link :to="'/artist/' + musicArtistId" class="music_item_artist">{{ musicArtistName }}</router-link>
                                <div class="music_item_arrow_div" v-if="music.singer.length > 1">
                                    <img class="music_item_arrow arrow_up" src="/images/up_arrow.png" alt="" @click="music.isArrow = false" v-if="music.isArrow" />
                                    <img class="music_item_arrow" src="/images/down_arrow.png" alt="" @click="music.isArrow = true" v-else />
                                    <div class="music_item_singer_div" v-if="music.isArrow">
                                        <div v-for="(singer, index) in music.singer" :key="index">
                                            <router-link :to="'/artist/' + singer._id" tag="p" class="music_item_singer_item">{{ singer.name }}</router-link>
                                        </div>
                                    </div>
                                </div>
                                <span class="music_item_release">{{ music.release.substr(0,4) }}.{{ music.release.substr(4,2) }}.{{ music.release.substr(6,2) }}</span>
                            </div>
                            <div class="music_item_fav_div">
                                <img v-if="music.isFavorite" class="music_item_fav on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(music.video, false)" />
                                <img v-else class="music_item_fav" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="favoriteMusic(music.video, true)" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
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
            </section>
        </div>
    </div>
</template>

<script>
    import Adsense from "../Adsense";

    export default {
        metaInfo() {
            const musicTitle = this.musicTitle;
            const musicArtistTitle = this.musicArtistTitle;
            return {
                title: musicArtistTitle + ' - ' + musicTitle + ' | 무료 음악감상 사이트 뮤지컴',
                titleTemplate: musicArtistTitle + ' - ' + musicTitle + ' | 무료 음악감상 사이트 뮤지컴',
                meta: [
                    { vmid: 'description', name: 'description', content: '음악 감상과 함께 가사와 관련된 음악을 제공합니다.' }
                ]
            }
        },
        name: 'Music',
        components: {
            Adsense
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
                musicListPage: 0
            }
        },
        computed: {
            computedMusicList () {
                return this.musicList.filter((music, index) => {
                    if (this.musicListPage * 4 <= index && index < (this.musicListPage+1) * 4) {
                        return music;
                    }
                })
            }
        },
        watch: {
            videoId () {
                this.$refs.musicTemplate.scrollTop = 0;

                this.$store.dispatch('setLoading', true);

                this.getMusicInfo();
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

                    console.log(musicInfo);

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
                                music.isFavorite = !music.isFavorite;
                            }
                        });
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
    #music_template {
        & { min-height: 100%; height: 100%; overflow-y: auto; }

        #music_container {
            & { position: relative; width: 100%; padding: 30px 50px 20px; margin: 0 auto; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            #music_title { font-size: 34px; margin-bottom: 15px; padding-left: 10px; display: block; }

            #music_info_section {
                & { padding: 0 10px 40px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                #music_info_player_wrap { position: relative; width: 100%; min-height: 410px; }
                #music_info_wrap {
                    & { margin-top: 20px; }

                    span { font-size: 22px; color: #FFFFFF; line-height: 30px; }
                    .music_info_title { width: 110px; display: inline-block; color: #DDDDDD; }
                    .music_info_artist { cursor: pointer; color: #FFFFFF; transition: initial; }
                    .music_info_artist:hover { text-decoration: underline; }
                    .music_info_fav { width: 30px; padding: 5px; margin: -2px 0 0 -5px; vertical-align: top; cursor: pointer; }
                    .music_info_fav_count { padding-left: 5px; }
                }
            }
            
            #music_lyrics_section {
                & { padding: 0 10px 40px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                .music_lyrics_title { font-size: 34px; line-height: 30px; margin-bottom: 12px; color: #FFFFFF; }
                .music_lyrics_contents { max-height: 250px; overflow: hidden; -webkit-transition: max-height 1.0s ease-out; transition: max-height 1.0s ease-out; }
                .music_lyrics_contents.on { max-height: initial; }
                .music_lyrics_contents > p { margin: 0; line-height: 32px; font-size: 24px; font-weight: 400; color: #EEEEEE; }

                .music_lyrics_more_button_wrap { height: 40px; text-align: center; }
                .music_lyrics_more_button { display: inline-block; cursor: pointer; }
                .music_lyrics_more_button > span { height: 40px; line-height: 40px; vertical-align: top; font-size: 22px; font-weight: 400; color: #FFFFFF; }
                .music_lyrics_more_button > img { width: 12px; line-height: 40px; vertical-align: top; margin: 13px 0 0 5px; }
                .music_lyrics_more_button:hover > span { text-decoration: underline; }
            }


            #artist_music_list_section {
                & { min-height: 300px; padding: 0 10px 40px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                #artist_music_list_header {
                    & { margin-bottom: 20px; margin-left: 5px; height: 30px; }

                    .artist_music_list_title { font-size: 25pt; font-weight: 400; color: #FFF; height: 30px; line-height: 30px; }
                    #artist_music_list_paging_wrap {
                        & { margin-right: 5px; margin-top: 1px; display: inline-block; float: right; vertical-align: top; }
                        span { line-height: 28px; padding: 0 7px; display: inline-block; border: 1px solid #CCCCCC; cursor: pointer; background-color: #FFFFFF; vertical-align: top; }
                        img { width: 15px; margin-top: 7px; vertical-align: top; }
                        .left { border-bottom-left-radius: 6px; border-top-left-radius: 6px; }
                        .right { border-bottom-right-radius: 6px; border-top-right-radius: 6px; }
                    }
                }

                .music_item {
                    & { width: 25%; padding: 0 7px 0; display: inline-block; vertical-align: top; }

                    .music_item_info_wrap {
                        & { position: relative; font-size: 12pt; border-bottom: none; display: block; text-align: left; border-radius: 6px; background-color: rgba(0, 0, 0, 0.25); outline: 0;
                            -moz-transition: all 0.2s ease;
                            -webkit-transition: all 0.2s ease;
                            -ms-transition: all 0.2s ease;
                            transition: all 0.2s ease;
                        }
                        &:hover { background-color: rgba(0, 0, 0, 0.15); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), 0 0 0.5em 0 #AAAAAA; }
                        & > div { position: relative; display: flex; }
                        .music_item_thumbnail { width: 100%; cursor: pointer; }
                        .music_item_thumbnail_cover { background:rgba(0,0,0,0.4); position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-top-left-radius: 6px; border-top-right-radius: 6px; opacity: 0; cursor: pointer;
                            -moz-transition: opacity 0.3s ease;
                            -webkit-transition: opacity 0.3s ease;
                            -ms-transition: opacity 0.3s ease;
                            transition: opacity 0.3s ease;
                        }
                        .music_item_thumbnail_cover.active { opacity: 1; }
                        .music_item_thumbnail_cover_img { width: 40px; position: absolute; bottom: 12px; right: 12px; }

                        .music_item_info { width: calc(100% - 44px); position: relative; display: inline-block; padding: 5px 15px 7px; letter-spacing: 0.4px; line-height: 1; }
                        .music_item_info > span { display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 100%; }
                        .music_item_title { display: block; font-weight: 400; font-size: 23px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; cursor: pointer; line-height: 1.4; max-width: 100%; color: #FFFFFF !important; }
                        .music_item_title:hover { text-decoration: underline; }
                        .music_item_artist { display: inline-block; font-weight: 400; font-size: 20px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 1; cursor: pointer; max-width: 100%; color: #FFFFFF !important; }
                        .music_item_artist:hover { text-decoration: underline; }
                        .music_item_release { display: block; font-size: 20px; line-height: 1; }
                        .music_item_fav_div { display: inline-block; padding: 7px 10px 7px 0; letter-spacing: 0.4px; vertical-align: top; float: right; line-height: 4; }
                        .music_item_fav { width: 32px; padding: 4px; margin-top: -4px; vertical-align: middle; cursor: pointer; }
                        .music_item_arrow_div { display: inline-block; vertical-align: top; }
                        .music_item_arrow { width: 12px; margin: 3px 0 0 5px; vertical-align: top; cursor: pointer; }

                        .music_item_singer_div { position: absolute; width: 160px; margin: 3px 0 0 -70px; padding: 2px 15px; border: 1px solid #FFF; background: #444; z-index: 1; }
                        .music_item_singer_item { position: relative; display: inline-block; margin: 0; padding: 0; cursor: pointer; line-height: 25px; vertical-align: top; font-size: 20px; color: #FFFFFF !important; transition: initial; }
                        .music_item_singer_item:hover { text-decoration: underline; }
                    }
                }
            }
        }
    }
</style>
