<template>
    <div id="theme_template">
        <div id="theme_container" v-if="isLoaded">
            <section id="theme_year_section">
                <p class="theme_year_title">연도 별 테마</p>
                <p class="theme_year_subtitle">각 연도 별 발매된 음악을 임의로 재생합니다.</p>

                <div class="theme_item_wrap">
                    <div class="theme_item" v-for="year in [2020, 2019, 2018, 2017, 2016]" :key="year" >
                        <div class="theme_item_contents">
                            <div class="theme_item_thumbnail_wrap">
                                <div class="theme_item_thumbnail_cover" @click="playMusicByYear(year)">
                                    <img class="theme_item_thumbnail_cover_img" src="/images/icon_play_round.png" />
                                </div>
                                <img class="theme_item_thumbnail" :src="'https://i.ytimg.com/vi/' + musicListByYear[year][0].video + '/mqdefault.jpg'" :alt="musicListByYear[year][0].title" />
                            </div>
                            <div class="theme_item_info">
                                <p class="theme_item_info_title" @click="playMusicByYear(year)">{{ year }}년 발매곡 랜덤 플레이</p>
                                <p class="first">
                                    <router-link :to="'/music/' + musicListByYear[year][0].video">{{ musicListByYear[year][0].title }}</router-link> -
                                    <router-link :to="'/artist/' + musicListByYear[year][0].artistId">{{ musicListByYear[year][0].artist }}</router-link>
                                </p>
                                <p>
                                    <router-link :to="'/music/' + musicListByYear[year][1].video">{{ musicListByYear[year][1].title }}</router-link> -
                                    <router-link :to="'/artist/' + musicListByYear[year][1].artistId">{{ musicListByYear[year][1].artist }}</router-link>
                                </p>
                                <p>
                                    <router-link :to="'/music/' + musicListByYear[year][2].video">{{ musicListByYear[year][2].title }}</router-link> -
                                    <router-link :to="'/artist/' + musicListByYear[year][2].artistId">{{ musicListByYear[year][2].artist }}</router-link> 외
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="theme_artist_section">
                <p class="theme_artist_title">아티스트 유형 별 테마</p>
                <p class="theme_artist_subtitle">아티스트 유형 별 음악을 임의로 재생합니다.</p>

                <div class="theme_item_wrap">
                    <div class="theme_item" v-for="type in [1, 2, 3, 4, 5]" :key="type" >
                        <div class="theme_item_contents">
                            <div class="theme_item_thumbnail_wrap">
                                <div class="theme_item_thumbnail_cover" @click="playMusicByArtistType(type)">
                                    <img class="theme_item_thumbnail_cover_img" src="/images/icon_play_round.png" />
                                </div>
                                <img class="theme_item_thumbnail" :src="'https://i.ytimg.com/vi/' + musicListByArtistType[type][0].video + '/mqdefault.jpg'" :alt="musicListByArtistType[type][1].title" />
                            </div>
                            <div class="theme_item_info">
                                <p class="theme_item_info_title" @click="playMusicByArtistType(type)">
                                    <span v-if="type === 1">여성그룹 랜덤 플레이</span>
                                    <span v-if="type === 2">남성그룹 랜덤 플레이</span>
                                    <span v-if="type === 3">혼성그룹 랜덤 플레이</span>
                                    <span v-if="type === 4">여성솔로 랜덤 플레이</span>
                                    <span v-if="type === 5">남성솔로 랜덤 플레이</span>
                                </p>
                                <p class="first">
                                    <router-link :to="'/music/' + musicListByArtistType[type][0].video">{{ musicListByArtistType[type][0].title }}</router-link> -
                                    <router-link :to="'/artist/' + musicListByArtistType[type][0].artistId">{{ musicListByArtistType[type][0].artist }}</router-link>
                                </p>
                                <p>
                                    <router-link :to="'/music/' + musicListByArtistType[type][1].video">{{ musicListByArtistType[type][1].title }}</router-link> -
                                    <router-link :to="'/artist/' + musicListByArtistType[type][1].artistId">{{ musicListByArtistType[type][1].artist }}</router-link>
                                </p>
                                <p>
                                    <router-link :to="'/music/' + musicListByArtistType[type][2].video">{{ musicListByArtistType[type][2].title }}</router-link> -
                                    <router-link :to="'/artist/' + musicListByArtistType[type][2].artistId">{{ musicListByArtistType[type][2].artist }}</router-link> 외
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
        </div>
    </div>
</template>

<script>
    import Adsense from "../Adsense";

    export default {
        metaInfo: {
            title: '뮤지컴 - 무료 음악감상 사이트 | 테마',
            titleTemplate: '뮤지컴 - 무료 음악감상 사이트 | 테마',
            meta: [
                { vmid: 'description', name: 'description', content: '연도별, 그룹별 음악을 감상하세요.' }
            ]
        },
        name: 'Theme',
        components: {
            Adsense
        },
        data: function () {
            return {
                isLoaded: false,
                musicListByYear: [],
                musicListByArtistType: []
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getTheme();
        },
        methods: {
            getTheme: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/music/theme', {}).then((response) => {
                    for (let year = 2016; year <= 2020; year++) {
                        response.data.result.musicListByYear[year].forEach(music => {
                            music.singer.forEach(singer => {
                                singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                            });
                        });
                    }

                    for (let type = 1; type <= 5; type++) {
                        response.data.result.musicListByArtistType[type].forEach(music => {
                            music.singer.forEach(singer => {
                                singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                            });
                        });
                    }

                    this.musicListByYear = response.data.result.musicListByYear;
                    this.musicListByArtistType = response.data.result.musicListByArtistType;

                    this.isLoaded = true;

                    this.$store.dispatch('setLoading', false);
                }).catch((error) => {
                    console.log(error);

                    this.$store.dispatch('setLoading', false);
                });
            },
            playMusicByYear: function (year) {
                const playlist = this.musicListByYear[year].map(music => {
                    return {
                        video   : music.video,
                        artist  : music.artistId,
                        title   : music.title,
                        singer  : music.singer
                    }
                });

                this.$store.dispatch('setPlaylist', playlist);
                this.$store.dispatch('setVideoId', playlist[0].video);
            },
            playMusicByArtistType: function (artistType) {
                const playlist = this.musicListByArtistType[artistType].map(music => {
                    return {
                        video   : music.video,
                        artist  : music.artistId,
                        title   : music.title,
                        singer  : music.singer
                    }
                });

                this.$store.dispatch('setPlaylist', playlist);
                this.$store.dispatch('setVideoId', playlist[0].video);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #theme_template {
        & { min-height: 100%; }

        #theme_container {
            & { min-height: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }

            #theme_year_section {
                & { position: relative; width: 100%; padding: 30px 50px 20px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                .theme_year_title { font-size: 24px; margin: 0 0 8px 0; display: block; padding-left: 10px; }
                .theme_year_subtitle { font-size: 18px; margin: 0 0 12px 0; display: inline-block; vertical-align: top; padding-left: 10px; }
            }

            #theme_artist_section {
                & { position: relative; width: 100%; padding: 0 50px 20px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                .theme_artist_title { font-size: 24px; margin: 0 0 8px 0; display: block; padding-left: 10px; }
                .theme_artist_subtitle { font-size: 18px; margin: 0 0 12px 0; display: inline-block; vertical-align: top; padding-left: 10px; }
            }

            .theme_item_wrap {
                & { display: block; padding: 0 3px; }

                .theme_item { padding: 0 7px 10px; width: 100%; }
                .theme_item_contents { height: 135px; background-color: rgba(0, 0, 0, 0.25); border-radius: 6px;
                    -moz-transition: all 0.2s ease;
                    -webkit-transition: all 0.2s ease;
                    -ms-transition: all 0.2s ease;
                    transition: all 0.2s ease;
                }
                .theme_item_contents:hover { background-color: rgba(0, 0, 0, 0.15); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), 0 0 0.5em 0 #AAAAAA; }
                .theme_item_thumbnail_wrap { position: relative; width: 240px; height: 135px; display: inline-block; white-space: nowrap; overflow: hidden;}
                .theme_item_thumbnail_cover { background:rgba(0, 0, 0, 0.15); position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 1; cursor: pointer; z-index: 1; }
                .theme_item_thumbnail_cover_img { width: 35px; position: absolute; bottom: 12px; right: 12px; }
                .theme_item_thumbnail { width: 100%; display: inline-block; }

                .theme_item_info {
                    & { display: inline-block; padding-left: 15px; vertical-align: top; }
                    p { font-size: 15px; }
                    p > a { color: #FFFFFF; }
                    p > a:hover { text-decoration: underline; }

                    .theme_item_info_title { font-size: 18px; margin: 14px 0 0; cursor: pointer; }
                    .theme_item_info_title:hover { text-decoration: underline; }
                    .first { padding: 8px 0 0; }
                }
            }
        }
    }
</style>
