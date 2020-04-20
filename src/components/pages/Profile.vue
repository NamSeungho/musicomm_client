<template>
    <div id="profile_template" ref="profileTemplate">
        <div id="profile_container">
            <section id="profile_info_section">
                <div class="container">
                    <div class="profile_info_nickname_wrap">
                        <p class="profile_info_nickname">{{ nickname }}</p>
                        <div class="profile_info_nickname_button" onclick="openChangeNicknamePopup();" v-if="id === userId">닉네임 변경</div>
                    </div>
                    <div>
                        <span class="profile_info_title">이메일</span>
                        <span>{{ email }}</span>
                    </div>
                    <div>
                        <span class="profile_info_title">음악감상 횟수</span>
                        <span>{{ playCount }}회</span>
                    </div>
                    <div>
                        <span class="profile_info_title">라이브러리</span>
                        <span>{{ favoriteMusicList.length }}곡</span>
                    </div>
                </div>
            </section>

            <section id="profile_tab_section">
                <div class="container">
                    <span @click="tabType = 'LIBRARY'">
                        <span class="profile_tab_item" :class="{active: tabType === 'LIBRARY'}">라이브러리</span>
                    </span>
                    <span @click="tabType = 'LIKE'">
                        <span class="profile_tab_item" :class="{active: tabType === 'LIKE'}">좋아하는 가수</span>
                    </span>
                    <span @click="tabType = 'RECENT'">
                        <span class="profile_tab_item" :class="{active: tabType === 'RECENT'}">최근 감상음악</span>
                    </span>
                </div>
            </section>

            <section id="favorite_music_section" v-if="tabType === 'LIBRARY'">
                <div class="container">
                    <p id="favorite_music_title">라이브러리</p>
                    <p id="favorite_music_subtitle">{{ nickname }}님이 즐겨듣는 음악입니다.</p>

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

                    <div class="music_list_item" v-for="(music, index) in favoriteMusicList" :key="index">
                        <div class="music_list_item_music_name_div">
                            <div class="music_list_item_thumbnail_div">
                                <div class="music_video_list_item_thumbnail_cover" v-bind:class="{ active: music.isActive }" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" @mousemove="music.isActive = true" @click="playFavoriteMusic(music.videoId)">
                                    <img class="music_video_list_item_thumbnail_cover_img" src="/images/icon_play_round.png" alt="" />
                                </div>
                                <img class="music_list_item_thumbnail" :src="'https://i.ytimg.com/vi/' + music.videoId + '/mqdefault.jpg'" :alt="music.title" />
                            </div>
                            <span class="music_list_item_music_name">
                                <router-link :to="'/music/' + music.videoId">{{ music.title }}</router-link>
                            </span>
                        </div>
                        <div class="music_list_item_artist_div">
                            <span class="music_list_item_artist">
                                <router-link :to="'/artist/' + music.singer[0]._id">{{ music.singer[0].name }}</router-link>
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

                        <div class="music_list_item_play_div" @click="playFavoriteMusic(music.videoId)">
                            <img class="music_list_item_play" src="/images/player_play.png" alt="재생" />
                        </div>
                        <div class="music_list_item_fav_div">
                            <img class="music_list_item_fav on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(music.videoId, false)" v-if="music.isFavorite" />
                            <img class="music_list_item_fav" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="favoriteMusic(music.videoId, true)" v-else />
                        </div>
                    </div>
                </div>
            </section>

            <section id="favorite_artist_section" v-if="tabType === 'LIKE'">
                <div class="container">
                    <p id="favorite_artist_title">좋아하는 가수</p>
                    <p id="favorite_artist_subtitle">{{ nickname }}님이 좋아하는 아티스트 입니다.</p>

                    <div id="artist_list_wrap">
                        <div class="artist_item" v-for="(artist, index) in artistList" v-bind:key="index">
                            <div class="artist_item_wrap">
                                <router-link :to="'/artist/' + artist.artistId">
                                    <img class="artist_item_img" :src="'/images/artist/' + artist.artistId + '.jpg'" :alt="artist.artistId" />
                                </router-link>
                                <div class="artist_item_title_div">
                                    <div><router-link :to="'/artist/' + artist.artistId" class="artist_title">{{ artist.name }}</router-link></div>
                                    <span class="artist_group_type">{{ artist.type }}</span>
                                    <span class="artist_songs_number">{{ artist.debut }} 데뷔</span>
                                </div>
                                <div class="artist_item_likes_div">
                                    <img v-if="artist.isLike" class="artist_item_likes_img on" src="/images/icon_likes_on.png" @click="likeArtist(artist.artistId, false)" alt="좋아요" />
                                    <img v-else class="artist_item_likes_img" src="/images/icon_likes_off.png" @click="likeArtist(artist.artistId, true)" alt="좋아요 취소" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="recent_section" v-if="tabType === 'RECENT'">
                <div class="container">
                    <p id="recent_title">최근 감상음악</p>
                    <p id="recent_subtitle">{{ nickname }}님이 최근에 들은 음악입니다.</p>

                    <div id="music_item_wrap">
                        <div class="music_item" v-for="(music, index) in recentMusicList" v-bind:key="index">
                            <div class="music_item_info_wrap">
                                <div>
                                    <div class="music_item_thumbnail_cover" v-bind:class="{ active: music.isActive }" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" @mousemove="music.isActive = true" @click="playRecentMusic(music.videoId)">
                                        <img class="music_item_thumbnail_cover_img" src="/images/icon_play_round.png" alt="" />
                                    </div>
                                    <img class="music_item_thumbnail" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" :src="'https://i.ytimg.com/vi/' + music.videoId + '/mqdefault.jpg'" :alt="music.title" />
                                </div>
                                <div class="music_item_info">
                                    <router-link :to="'/music/' + music.videoId" class="music_item_title">{{ music.title }}</router-link>
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
                                    <span class="music_item_release">{{ music.date }} 감상</span>
                                </div>
                                <div class="music_item_fav_div">
                                    <img v-if="music.isFavorite" class="music_item_fav on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="favoriteMusic(music.videoId, false)" />
                                    <img v-else class="music_item_fav" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="favoriteMusic(music.videoId, true)" />
                                </div>
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
        metaInfo: {
            title: '뮤지컴 - 무료 음악감상 사이트 | 프로필',
            titleTemplate: '뮤지컴 - 무료 음악감상 사이트 | 프로필'
        },
        name: 'Profile',
        components: {
            Adsense
        },
        props: {
            userId: String
        },
        data: function () {
            return {
                isLoaded: false,
                nickname: '',
                email: '',
                playCount: 0,
                tabType: 'LIBRARY',
                favoriteMusicList: [],
                recentMusicList: [],
                artistList: []
            }
        },
        computed: {
            id () {
                return this.$store.getters.user;
            }
        },
        watch: {
            userId () {
                this.$refs.profileTemplate.scrollTop = 0;

                this.$store.dispatch('setLoading', true);

                this.getProfileInfo();
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getProfileInfo();
        },
        methods: {
            getProfileInfo: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/profile/detail', {
                    no: this.userId
                }).then((response) => {
                    response = response.data.result;

                    console.log(response);

                    this.nickname = response.profileNickname;
                    this.email = response.profileEmail;
                    this.playCount = response.profilePlayCount;
                    this.favoriteMusicList = response.musicList.map(music => {
                        music.isFavorite = music.isFavorite !== -1;
                        music.isActive = false;
                        music.isArrow = false;
                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });

                        return music;
                    });

                    this.recentMusicList = response.recentList.map(music => {
                        music.isFavorite = music.isFavorite !== -1;
                        music.isActive = false;
                        music.isArrow = false;
                        music.artist = music.artistTitle + (music.artistTitleEn === '' ? '' : ' (' + music.artistTitleEn + ')');
                        music.date = music.date.substr(0, 4) + '.' + music.date.substr(4, 2) + '.' +music.date.substr(6, 2);
                        music.singer.forEach(singer => {
                            singer.name = singer.title + (singer.title_en === '' ? '' : ' (' + singer.title_en + ')');
                        });
                        return music;
                    });

                    this.artistList = response.artistList.map(artist => {
                        artist.name = artist.title + (artist.title_en === '' ? '' : ' (' + artist.title_en + ')');
                        artist.isLike = artist.isLike !== -1;
                        artist.debut = artist.debut.substr(0, 4) + '.' + artist.debut.substr(4, 2) + '.' + artist.debut.substr(6, 2);

                        switch (artist.type) {
                            case '1':
                                artist.type = '여성그룹';
                                break;
                            case '2':
                                artist.type = '남성그룹';
                                break;
                            case '3':
                                artist.type = '혼성그룹';
                                break;
                            case '4':
                                artist.type = '여성솔로';
                                break;
                            case '5':
                                artist.type = '남성솔로';
                                break;
                            default:
                                break;
                        }

                        return artist;
                    });

                    this.$store.dispatch('setLoading', false);
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
                    this.favoriteMusicList.forEach(music => {
                        if (music.videoId === videoId) {
                            music.isFavorite = isFavorite;
                        }
                    });

                    this.recentMusicList.forEach(music => {
                        if (music.videoId === videoId) {
                            music.isFavorite = isFavorite;
                        }
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            likeArtist: function (artistId, isLike) {
                if (this.$store.getters.user === '') {
                    this.$showAlert('로그인이 필요합니다', '확인', () => {
                        this.$store.dispatch('setSignInPopupType', 'LOGIN');
                        this.$store.dispatch('setSignInPopupStatus', 'SHOW');
                    });
                    return;
                }

                this.axios.post(this.$store.getters.serverUrl + 'api/artist/like', {
                    artistId: artistId,
                    userId: this.$store.getters.user,
                    type: (isLike ? 1 : 2)
                }).then(() => {
                    this.artistList.forEach(artist => {
                        if (artist.artistId === artistId) {
                            artist.isLike = isLike;
                        }
                    });
                }).catch((error) => {
                    console.log(error);
                });
            },
            playFavoriteMusic: function (videoId) {
                const playlist = this.favoriteMusicList.map(music => {
                    return {
                        video   : music.videoId,
                        artist  : music.artistId,
                        title   : music.title,
                        singer  : music.singer
                    }
                });

                this.$store.dispatch('setPlaylist', playlist);
                this.$store.dispatch('setVideoId', videoId);
            },
            playRecentMusic: function (videoId) {
                const playlist = this.recentMusicList.map(music => {
                    return {
                        video   : music.videoId,
                        artist  : music.artistId,
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
    #profile_template {
        & { min-height: 100%; height: 100%; overflow-y: auto; }

        #profile_container {
            & { position: relative; width: 100%; min-height: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            #music_title { font-size: 34px; margin-bottom: 15px; padding-left: 10px; display: block; }

            #profile_info_section {
                .container {  padding: 30px 50px 20px; margin: 0 auto; }
                .profile_info_nickname_wrap { margin-bottom: 10px; }
                .profile_info_nickname { height: 56px; line-height: 56px; font-size: 34px; color: #FFFFFF; display: inline-block; vertical-align: top; }
                .profile_info_nickname_button { height: 32px; line-height: 32px; margin: 12px 0 0 25px; padding: 0 20px; display: inline-block; font-size: 20px; color: #F361A6; background: rgba(255, 255, 255, 0.9); vertical-align: top; border: 1px solid transparent; border-radius: 4px; cursor: pointer;
                    touch-action: manipulation;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                span { font-size: 22px; color: #FFFFFF; line-height: 30px; }
                .profile_info_title { width: 110px; display: inline-block; color: #DDDDDD; }
            }

            #profile_tab_section {
                & { margin-bottom: 30px; border-bottom: 2px solid rgba(255, 255, 255, 0.2); border-top: 2px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.15); }
                .container { padding: 0 50px; width: 100%; height: auto; }
                .container > span { padding: 0 35px 0 0; }
                .profile_tab_item { padding: 13px 0; display: inline-block; font-size: 22px; color: rgba(255, 255, 255, 0.8); cursor: pointer; }
                .profile_tab_item:hover, .profile_tab_item.active { color: #FFFFFF; font-weight: 700; }
            }

            #favorite_music_section {
                .container { padding: 0 50px 50px; width: 100%; height: auto; }
                span, a { color: #FFFFFF; line-height: 48px; font-size: 22px; font-weight: 400; display: inline-block; vertical-align: top; }

                #favorite_music_title { font-size: 34px; margin: 0 0 8px 0; display: block; }
                #favorite_music_subtitle { font-size: 24px; margin: 0 0 15px 0; display: inline-block; vertical-align: top; }

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

            #favorite_artist_section {
                .container { padding: 0 50px 20px; width: 100%; height: auto; }
                /*span, a { color: #FFFFFF; line-height: 48px; font-size: 22px; font-weight: 400; display: inline-block; vertical-align: top; }*/

                #favorite_artist_title { font-size: 34px; margin: 0 0 8px 0; display: block; }
                #favorite_artist_subtitle { font-size: 24px; margin: 0 0 15px 0; display: inline-block; vertical-align: top; }

                #artist_list_wrap {
                    .artist_item { width: 25%; padding: 0 7px 30px; display: inline-block; }
                    .artist_item_wrap {
                        & { position: relative; display: block; font-size: 12pt; font-weight: 400; text-align: left; background-color: rgba(255, 255, 255, 0.075); border-bottom: none; border-radius: 6px; outline: 0; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
                            -moz-transition: all 0.2s ease;
                            -webkit-transition: all 0.2s ease;
                            -ms-transition: all 0.2s ease;
                            transition: all 0.2s ease;
                        }
                        &:hover { background-color: rgba(255, 255, 255, 0.25); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), 0 0 0.5em 0 #FF6382; }

                        .artist_item_img { width: 100%; cursor: pointer; }
                        .artist_item_title_div { display: inline-block; padding: 7px 0 7px 18px; letter-spacing: 0.4px; width: calc(100% - 44px); height: 76px; }
                        .artist_item_title_div > div { height: 25px; }
                        /*.artist_item_title_div > div > span { max-width: 100%; display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; vertical-align: top; }*/
                        .artist_item_title_div .artist_title { font-size: 23px; cursor: pointer; color: #FFFFFF !important; transition: initial; display: inline-block; max-width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 25px; }
                        .artist_item_title_div .artist_title:hover { text-decoration: underline; color: #FFFFFF !important; }
                        .artist_item_title_div .artist_group_type { font-size: 20px; line-height: 1; margin: 0; padding: 0; display: block; }
                        .artist_item_title_div .artist_songs_number { font-size: 20px; line-height: 1; margin: 0; padding: 0; display: block; }
                        .artist_item_likes_div { position: absolute; right: 0; bottom: 0; padding: 26px 11px 26px 0; display: inline-block; letter-spacing: 0.4px; vertical-align: top; float: right; }
                        .artist_item_likes_span { line-height: 3; padding-right: 4px; }
                        .artist_item_likes_img { width: 24px; cursor: pointer; }
                    }
                }
            }

            #recent_section {
                .container { padding: 0 50px 20px; width: 100%; height: auto; }
                span, a { color: #FFFFFF; line-height: 48px; font-size: 22px; font-weight: 400; display: inline-block; vertical-align: top; }

                #recent_title { font-size: 34px; margin: 0 0 8px 0; display: block; }
                #recent_subtitle { font-size: 24px; margin: 0 0 15px 0; display: inline-block; vertical-align: top; }

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
            }
        }
    }
</style>
