<template>
    <div id="artist_template" ref="artistTemplate">
        <section id="artist_info_container">
            <div class="container">
                <p id="artist_title">아티스트 정보</p>

                <div id="artist_info_section" v-if="isLoaded">
                    <img id="artist_image" :src="'/images/artist/' + artistId + '.jpg'" :alt="artistName" />

                    <div id="artist_profile_div">
                        <h2 id="artist_name">{{ artistFullName }}</h2>

                        <div>
                            <span class="artist_profile_div_title">활동 유형</span>
                            <span class="artist_profile_div_contents">{{ artistType }}</span>
                        </div>
                        <div>
                            <span class="artist_profile_div_title">데뷔일</span>
                            <span class="artist_profile_div_contents">{{ artistDebut.substr(0, 4) }}. {{ artistDebut.substr(4, 2) }}. {{ artistDebut.substr(6, 2) }}</span>
                        </div>
                        <div>
                            <span class="artist_profile_div_title">업로드 음악</span>
                            <span class="artist_profile_div_contents">{{ musicList.length }}곡</span>
                        </div>
                        <div>
                            <span class="artist_profile_div_title">팬</span>
                            <span class="artist_profile_div_contents"><span id="artist_profile_div_contents_fan_count">{{ artistLikeCount }}</span>명</span>
                        </div>
                        <div id="artist_profile_like_div">
                            <span class="artist_profile_div_title">팬맺기</span>
                            <span class="artist_profile_div_contents">
                                <img id="artist_likes_img" v-if="artistIsLike" class="on" src="/images/icon_likes_on.png" @click="likeArtist(false)" alt="좋아요" />
                                <img id="artist_likes_img" v-else src="/images/icon_likes_off.png" @click="likeArtist(true)" alt="좋아요 취소" />
                            </span>
                        </div>
                    </div>
                </div>

                <div id="artist_music_section">
                    <p id="artist_music_title">{{ artistName }}의 음악 목록</p>

                    <div class="music_list_header_div">
                        <div class="music_list_item_music_name_div">
                            <span class="music_list_item_music_name">곡</span>
                        </div>
                        <div class="music_list_item_artist_div">
                            <span>가수</span>
                        </div>
                        <div class="music_list_item_release_div">
                            <span>발배일</span>
                        </div>
                        <div class="music_list_item_play_div">
                            <span>재생</span>
                        </div>
                        <div class="music_list_item_fav_div">
                            <span>즐겨찾기</span>
                        </div>
                    </div>

                    <div class="music_list_item" v-for="(music, index) in musicList" :key="index">
                        <div class="music_list_item_music_name_div">
                            <div class="music_list_item_thumbnail_div">
                                <div class="music_video_list_item_thumbnail_cover" v-bind:class="{ active: music.isActive }" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" @mousemove="music.isActive = true" @click="playArtistMusic(music.video)">
                                    <img class="music_video_list_item_thumbnail_cover_img" src="/images/icon_play_round.png" />
                                </div>
                                <img class="music_list_item_thumbnail" :src="'https://i.ytimg.com/vi/' + music.video + '/mqdefault.jpg'" :alt="music.title" />
                            </div>
                            <span class="music_list_item_music_name">
                                <router-link :to="'/music/' + music.video">{{ music.title }}</router-link>
                            </span>
                        </div>
                        <div class="music_list_item_artist_div">
                            <span class="music_list_item_artist">
                                <router-link :to="'/artist/' + artistId">{{ artistFullName }}</router-link>
                                <span class="music_item_arrow_div" v-if="music.singer.length > 1">
                                    <img class="music_item_arrow arrow_up" src="/images/up_arrow.png" alt="" @click="music.isArrow = false" v-if="music.isArrow" />
                                    <img class="music_item_arrow" src="/images/down_arrow.png" alt="" @click="music.isArrow = true" v-else />
                                    <div class="music_item_singer_div" v-if="music.isArrow">
                                        <div v-for="(singer, index) in music.singer" :key="index">
                                            <router-link :to="'/artist/' + singer._id" v-if="singer._id !== ''" tag="p" class="music_item_singer_item">{{ singer.name }}</router-link>
                                            <p v-else class="music_item_singer_item">{{ singer.name }}</p>
                                        </div>
                                    </div>
                                </span>
                            </span>
                        </div>
                        <div class="music_list_item_release_div">
                            <span class="music_list_item_release">
                                <span>{{ music.release.substr(0, 4) }}.{{ music.release.substr(4, 2) }}.{{ music.release.substr(6, 2) }} 발매</span>
                            </span>
                        </div>

                        <div class="music_list_item_play_div" @click="playArtistMusic(music.video)">
                            <img class="music_list_item_play" src="/images/player_play.png" alt="재생" />
                        </div>
                        <div class="music_list_item_fav_div">
                            <img class="music_list_item_fav on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(music.video, false)" v-if="music.isFavorite >= 0" />
                            <img class="music_list_item_fav" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="favoriteMusic(music.video, true)" v-else />
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
            </div>
        </section>
    </div>
</template>

<script>
    import Adsense from "../Adsense";

    export default {
        metaInfo() {
            const artistTitle = this.artistTitle;
            return {
                title: artistTitle + ' | 무료 음악감상 사이트 뮤지컴',
                titleTemplate: artistTitle + ' | 무료 음악감상 사이트 뮤지컴',
                meta: [
                    { vmid: 'description', name: 'description', content: '가수의 정보와 함께 발매곡을 무료로 감상하세요.' }
                ]
            }
        },
        name: 'Artist',
        components: {
            Adsense
        },
        props: {
            artistId: String
        },
        data: function () {
            return {
                isLoaded: false,
                artistList: [],
                artistName: '',
                artistFullName: '',
                artistTitle: '',
                artistType: '',
                artistDebut: '20000101',
                artistLikeCount: 0,
                artistIsLike: false,
                musicList: []
            }
        },
        watch: {
            artistId () {
                this.$refs.artistTemplate.scrollTop = 0;

                this.$store.dispatch('setLoading', true);

                this.getArtistInfo();
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getArtistInfo();
        },
        methods: {
            getArtistInfo: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/artist/detail', {
                    artistId: this.artistId
                }).then((response) => {
                    response = response.data.result;

                    this.artistName = response.title;
                    this.artistFullName = response.title + (response.title_en === '' ? '' : ' (' + response.title_en + ')');
                    this.artistTitle = response.title + (response.title_en === '' ? '' : '(' + response.title_en + ')');
                    this.artistDebut = response.debut;
                    this.artistLikeCount = response.likecount;
                    this.artistIsLike = (response.isLike !== -1);

                    if (response.type === '1') {
                        this.artistType = '여성그룹';
                    } else if (response.type === '2') {
                        this.artistType = '남성그룹';
                    } else if (response.type === '3') {
                        this.artistType = '혼성그룹';
                    } else if (response.type === '4') {
                        this.artistType = '여성솔로';
                    } else if (response.type === '5') {
                        this.artistType = '남성솔로';
                    }

                    this.musicList = response.musicList.map(music => {
                        music.isActive = false;
                        music.isArrow = false;

                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });
                        return music;
                    });

                    this.isLoaded = true;

                    this.$store.dispatch('setLoading', false);
                }).catch((error) => {
                    console.log(error);

                    this.$store.dispatch('setLoading', false);
                });
            },
            likeArtist: function (isLike) {
                if (this.$store.getters.user === '') {
                    this.$showAlert('로그인이 필요합니다', '확인', () => {
                        this.$store.dispatch('setSignInPopupType', 'LOGIN');
                        this.$store.dispatch('setSignInPopupStatus', 'SHOW');
                    });
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/artist/like', {
                    artistId: this.artistId,
                    userId: this.$store.getters.user,
                    type: (isLike ? 1 : 2)
                }).then(() => {
                    this.artistIsLike = isLike;
                }).catch((error) => {
                    console.log(error);
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
                    this.musicList.forEach(music => {
                        if (music.video === videoId) {
                            music.isFavorite = isFavorite ? 1 : -1;
                        }
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            playArtistMusic: function (videoId) {
                const playlist = this.musicList.map(music => {
                    return {
                        video   : music.video,
                        artist  : this.artistId,
                        title   : music.title,
                        singer  : music.singer
                    }
                });

                this.$store.dispatch('setPlaylist', playlist);
                this.$store.dispatch('setVideoId', videoId);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #artist_template {
        & { min-height: 100%; height: 100%; overflow-y: auto; }

        #artist_info_container {
            & { position: relative; width: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            .container { position: relative; width: 100%; padding: 30px 50px 20px; margin: 0 auto; }

            #artist_title { font-size: 34px; margin-bottom: 15px; padding-left: 10px; display: block; }

            #artist_info_section {
                & { padding: 0 10px 40px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }

                #artist_image { height: 270px; border-radius: 5px; vertical-align: top; }
                #artist_profile_div { margin-left: 20px; display: inline-block; text-align: left; }
                #artist_name { margin: 12px 0 20px; font-size: 34px; font-weight: 400; color: #FFFFFF; }
                .artist_profile_div_title { width: 120px; line-height: 32px; display: inline-block; font-size: 22px; font-weight: 400; color: #DDD; }
                .artist_profile_div_contents { line-height: 32px; display: inline-block; font-size: 22px; font-weight: 400; color: #FFF; }
                #artist_profile_like_div { margin-top: 15px; }
                #artist_likes_img {width: 24px; padding: 0; margin-top: 4px; vertical-align: top; cursor: pointer; }
            }

            #artist_music_section {
                & { padding: 0 10px 30px; margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }
                span, a { color: #FFFFFF; line-height: 48px; font-size: 22px; font-weight: 400; display: inline-block; vertical-align: top; }

                #artist_music_title { margin-bottom: 15px; font-size: 34px; font-weight: 400; color: #FFFFFF; }

                .music_list_header_div { border-top: 2px solid #FFFFFF; border-bottom: 1px solid #FFFFFF; }
                .music_list_header_div > div { vertical-align: top; }
                .music_list_header_div > div > .music_list_item_music_name { margin-left: 184px; }

                .music_list_item_music_name_div { width: 45%; display: inline-block; margin: 0; }
                .music_list_item_artist_div { width: 25%; display: inline-block; text-align: left; }
                .music_list_item_release_div { width: 14%; display: inline-block; text-align: center; }
                .music_list_item_play_div { width: 8%; display: inline-block; text-align: center; }
                .music_list_item_fav_div { width: 8%; display: inline-block; text-align: center; }
                .music_list_item_thumbnail_div { position: relative; width: 160px; margin: 10px 0 0 10px; display: inline-block; text-align: center; vertical-align: top; }

                .music_list_item {
                    & { height: 109px; border-top: 1px solid #FFFFFF; overflow: hidden; -webkit-transition: height .4s; transition: height .4s; }
                    &:hover { background: rgba(255, 255, 255, 0.2); }

                    span, a { line-height: 109px; }

                    .music_list_item_thumbnail_a { cursor: default; margin-top: 10px; }
                    .music_list_item_thumbnail { width: 160px; height: 90px; display: block; cursor: pointer; }

                    .music_video_list_item_thumbnail_cover { background:rgba(0,0,0,0.4); position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0; cursor: pointer;
                        -moz-transition: opacity 0.3s ease;
                        -webkit-transition: opacity 0.3s ease;
                        -ms-transition: opacity 0.3s ease;
                        transition: opacity 0.3s ease;
                    }
                    .music_video_list_item_thumbnail_cover.active { opacity: 1; }
                    .music_video_list_item_thumbnail_cover_img { width: 28px; position: absolute; bottom: 8px; right: 8px; }

                    .music_list_item_music_name { width: calc(100% - 194px); margin-left: 14px; }
                    .music_list_item_music_name a { max-width: 100%; margin-top: 44px; line-height: 1; display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; cursor: pointer; }
                    .music_list_item_music_name a:hover { text-decoration: underline; }
                    .music_list_item_artist { width: 100%; }
                    .music_list_item_artist a { max-width: 100%; margin-top: 44px; line-height: 1; display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; cursor: pointer; }
                    .music_list_item_artist a:hover { text-decoration: underline; }
                    .music_list_item_release { width: 100%; }
                    .music_list_item_release span { max-width: 100%; margin-top: 0; display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                    .music_list_item_fav { width: 45px; padding: 11px; margin-top: 32px; vertical-align: top; cursor: pointer; }
                    .music_list_item_play { width: 45px; padding: 13px; margin-top: 32px; vertical-align: top; cursor: pointer; }

                    .music_item_arrow_div { display: inline-block; vertical-align: top; line-height: 12px; margin: 48px 0 0 8px; }
                    .music_item_arrow { width: 12px; vertical-align: top; cursor: pointer; }

                    .music_item_singer_div { position: absolute; width: 160px; margin: 3px 0 0 -70px; padding: 2px 15px; border: 1px solid #FFF; background: #444; z-index: 1; }
                    .music_item_singer_item { position: relative; display: inline-block; margin: 0; padding: 0; cursor: pointer; line-height: 25px; vertical-align: top; font-size: 20px; color: #FFFFFF !important; transition: initial; }
                    .music_item_singer_item:hover { text-decoration: underline; }
                    .music_item_singer_item span { line-height: 25px; }
                }
            }
        }
    }
</style>
