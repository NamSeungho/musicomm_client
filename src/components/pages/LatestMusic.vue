<template>
    <div id="latest_music_template" ref="latestMusicTemplate">
        <section id="latest_music_container">
            <div class="container">
                <p id="latest_music_title">최신 음악</p>
                <p id="latest_music_subtitle">가장 최근에 발매된 뮤직비디오 목록입니다.</p>

                <div id="music_item_wrap">
                    <div class="music_item" v-for="(music, index) in computedLatestMusic" v-bind:key="index">
                        <div class="music_item_info_wrap">
                            <div>
                                <div class="music_item_thumbnail_cover" v-bind:class="{ active: music.isActive }" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" @mousemove="music.isActive = true" @click="playLatestMusic(music.video)">
                                    <img class="music_item_thumbnail_cover_img" src="/images/icon_play_round.png" alt="" />
                                </div>
                                <img class="music_item_thumbnail" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" :src="'https://i.ytimg.com/vi/' + music.video + '/mqdefault.jpg'" :alt="music.title" />
                            </div>
                            <div class="music_item_info">
                                <router-link :to="'/music/' + music.video" class="music_item_title">{{ music.title }}</router-link>
                                <router-link :to="'/artist/' + music.artistId" class="music_item_artist">{{ music.artist }}</router-link>
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
                                <img v-if="music.isFavorite >= 0" class="music_item_fav on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(music.video, false)" />
                                <img v-else class="music_item_fav" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="favoriteMusic(music.video, true)" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="paging_button_wrap">
                    <span class="paging_button" :class="{ active: currentPage === page }" v-for="page in 5" :key="page" @click="doPaging(page)">{{ page }}</span>
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
    import Adsense from "../Adsense";

    export default {
        metaInfo: {
            title: '뮤지컴 - 무료 음악감상 사이트 | 최신음악',
            titleTemplate: '뮤지컴 - 무료 음악감상 사이트 | 최신음악',
            meta: [
                { vmid: 'description', name: 'description', content: '뮤지컴에서 신곡을 무료로 감상하세요.' }
            ]
        },
        name: 'LatestMusic',
        components: {
            Adsense
        },
        data: function () {
            return {
                latestMusic: [],
                currentPage: 1
            }
        },
        computed: {
            computedLatestMusic () {
                return this.latestMusic.slice((this.currentPage - 1) * 20, this.currentPage * 20);
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getLatestMusic();
        },
        methods: {
            getLatestMusic: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/music/latest_music', {
                    limitCount: 100
                }).then((response) => {
                    this.latestMusic = response.data.result.map(music => {
                        music.isActive = false;
                        music.isArrow = false;

                        music.artist += (music.artist_en === '' ? '' : ' (' + music.artist_en + ')');
                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });
                        return music;
                    });

                    this.$store.dispatch('setLoading', false);
                }).catch((error) => {
                    console.log(error);

                    this.$store.dispatch('setLoading', false);
                });
            },
            playLatestMusic: function (videoId) {
                const playlist = this.latestMusic.map(music => {
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
                    this.latestMusic.forEach(music => {
                        if (music.video === videoId) {
                            music.isFavorite = isFavorite ? 1 : -1;
                        }
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            doPaging: function (page) {
                this.currentPage = page;

                this.$refs.latestMusicTemplate.scrollTop = 0;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #latest_music_template {
        & { min-height: 100%; height: 100%; overflow-y: auto; }

        #latest_music_container {
            & { position: relative; width: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            .container { width: 100%; padding: 30px 50px 20px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

            #latest_music_title { font-size: 34px; margin: 0 0 8px 0; display: block; padding-left: 10px; }
            #latest_music_subtitle { font-size: 24px; margin: 0 0 12px 0; display: inline-block; vertical-align: top; padding-left: 10px; }

            .music_item {
                & { width: 25%; padding: 0 7px 30px; display: inline-block; vertical-align: top; }

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

            .paging_button_wrap { margin: 0 auto; text-align: center; }
            .paging_button { width: 14px; line-height:28px; margin-left: 20px; display: inline-block; font-size: 28px; cursor: pointer; }
            .paging_button:nth-child(1) { margin-left: 0; }
            .paging_button.active, .paging_button:hover { border-bottom: 2px solid #FFFFFF; }
        }
    }
</style>
