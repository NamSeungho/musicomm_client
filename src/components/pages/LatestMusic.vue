<template>
    <div id="latest_music_template" ref="latestMusicTemplate">
        <section id="latest_music_container">
            <div class="container">
                <p id="latest_music_title">최신 음악</p>
                <p id="latest_music_subtitle">가장 최근에 발매된 뮤직비디오 목록입니다.</p>

                <div id="music_item_wrap">
                    <MusicItem v-for="(music, index) in exposedLatestMusic" :key="index" :music="music" @play="playLatestMusic" @favorite="favoriteMusic" />
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
    import MusicItem from "../MusicItem";
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
            MusicItem,
            Adsense
        },
        data: function () {
            return {
                latestMusic: [],
                currentPage: 1
            }
        },
        computed: {
            resolution () {
                return this.$store.getters.resolution;
            },
            exposedLatestMusic () {
                if (this.resolution === 'MEDIUM') {
                    return this.latestMusic.slice((this.currentPage - 1) * 15, this.currentPage * 15);
                } else {
                    return this.latestMusic.slice((this.currentPage - 1) * 20, this.currentPage * 20);
                }
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
                let playedLatestMusic;
                if (this.resolution === 'MEDIUM') {
                    playedLatestMusic = this.latestMusic.slice(0, 75);
                } else {
                    playedLatestMusic = this.latestMusic;
                }

                const playlist = playedLatestMusic.map(music => {
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

            .paging_button_wrap { margin: 0 auto; text-align: center; }
            .paging_button { width: 14px; line-height:28px; margin-left: 20px; display: inline-block; font-size: 28px; cursor: pointer; }
            .paging_button:nth-child(1) { margin-left: 0; }
            .paging_button.active, .paging_button:hover { border-bottom: 2px solid #FFFFFF; }
        }
    }
</style>
