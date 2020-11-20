<template>
    <div id="artist_list_template">
        <section id="artist_list_container">
            <div class="container">
                <p id="artist_list_title">아티스트 목록</p>
                <p id="artist_list_subtitle">좋아하는 아티스트를 찾아보세요.</p>

                <div id="artist_list_filter">
                    <div id="artist_filter_wrap" :class="{active: isFilterActive}" @click="isFilterActive = !isFilterActive">
                        <div id="artist_filter_select_div">
                            <span class="artist_filter_select_span" :class="{selected: item.type === filterType}" v-for="item in filterList" @click="filterArtistType(item.type)" :key="item.type">{{ item.name }}</span>
                        </div>
                        <span id="artist_filter_placeholder">{{ filterList[filterType].name }}<img src="/images/down_arrow.png" alt="" /></span>
                    </div>
                </div>

                <div id="artist_list_wrap">
                    <div class="artist_item" v-for="(artist, index) in artistList" v-bind:key="index">
                        <div class="artist_item_wrap">
                            <router-link :to="'/artist/' + artist._id">
                                <img class="artist_item_img" :src="'/images/artist/' + artist._id + '.jpg'" :alt="artist._id" />
                            </router-link>
                            <div class="artist_item_title_div">
                                <div><router-link :to="'/artist/' + artist._id" class="artist_title">{{ artist.title }}<span v-if="artist.title_en !== ''"> ({{ artist.title_en }})</span></router-link></div>
                                <span class="artist_group_type" v-if="artist.type === '1'">여성그룹</span>
                                <span class="artist_group_type" v-if="artist.type === '2'">남성그룹</span>
                                <span class="artist_group_type" v-if="artist.type === '3'">혼성그룹</span>
                                <span class="artist_group_type" v-if="artist.type === '4'">여성솔로</span>
                                <span class="artist_group_type" v-if="artist.type === '5'">남성솔로</span>
                                <span class="artist_songs_number">{{ artist.debut.substr(0, 4) }}. {{ artist.debut.substr(4, 2) }}. {{ artist.debut.substr(6, 2) }} 데뷔</span>
                            </div>
                            <div class="artist_item_likes_div">
                                <img v-if="artist.isLike === -1" class="artist_item_likes_img" src="/images/icon_likes_off.png" @click="likeArtist(artist._id, true)" alt="좋아요 취소" />
                                <img v-else class="artist_item_likes_img on" src="/images/icon_likes_on.png" @click="likeArtist(artist._id, false)" alt="좋아요" />
                            </div>
                        </div>
                    </div>
                </div>
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
        </section>
    </div>
</template>

<script>
    import Adsense from "../Adsense";

    export default {metaInfo: {
            title: '뮤지컴 - 무료 음악감상 사이트 | 아티스트 목록',
            titleTemplate: '뮤지컴 - 무료 음악감상 사이트 | 아티스트 목록',
            meta: [
                { vmid: 'description', name: 'description', content: '음악 감상할 수 있는 아티스트 목록입니다.' }
            ]
        },
        name: 'ArtistList',
        components: {
            Adsense
        },
        data: function () {
            return {
                allArtistList: [],
                isFilterActive: false,
                filterType: 0,
                filterList: [
                    { type: 0, name: '전체' },
                    { type: 1, name: '여성그룹' },
                    { type: 2, name: '남성그룹' },
                    { type: 3, name: '혼성그룹' },
                    { type: 4, name: '여성솔로' },
                    { type: 5, name: '남성솔로' }
                ]
            }
        },
        computed: {
            artistList () {
                return this.allArtistList.filter(artist => this.filterType === 0 || artist.type === this.filterType.toString());
            }
        },
        mounted () {
            this.$store.dispatch('setLoading', true);

            this.getArtistList();
        },
        methods: {
            getArtistList: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/artist/list', {}).then((response) => {
                    this.allArtistList = response.data.result;

                    this.$store.dispatch('setLoading', false);
                }).catch((error) => {
                    console.log(error);

                    this.$store.dispatch('setLoading', false);
                });
            },
            filterArtistType: function (type) {
                this.filterType = type;
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
                        if (artist._id === artistId) {
                            artist.isLike = isLike ? 1 : -1;
                        }
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #artist_list_template {
        & { min-height: 100%; }

        #artist_list_container {
            & { position: relative; width: 100%; color: white; background: repeating-linear-gradient(140deg,#f361a6, #6b4d71, #f361a6 2000px); }
            .container { width: 100%; padding: 30px 50px 0; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }
            .ad_container { width: 100%; height: auto; text-align: center; padding: 10px 0 3px 0; }

            #artist_list_title { font-size: 34px; margin: 0 0 8px 0; display: block; padding-left: 10px; }
            #artist_list_subtitle { font-size: 24px; margin: 0 0 12px 0; display: inline-block; vertical-align: top; padding-left: 10px; }

            #artist_list_filter {
                & { margin: -7px 7px 0 0; display: block; float: right; }

                #artist_filter_wrap {
                    & {
                        & { display: block; width: 250px; margin-left: auto; margin-right: 0; background-color: transparent; position: relative; cursor: pointer; border-bottom: 2px solid rgba(0, 0, 0, 0.3); z-index: 3; padding-bottom: 1px; line-height: 1; }

                        #artist_filter_placeholder { display: block; font-size: 21px; font-weight: 400; color: #FFFFFF; padding: 0.2em 0.5em; text-align: left; pointer-events: none; user-select: none; visibility: visible; }
                        #artist_filter_placeholder::before { position: absolute; top: 0; bottom: 0; left: 0; right: 0; padding: 0.2em 0.5em; content: attr(data-placeholder); visibility: hidden; }
                        #artist_filter_placeholder img { height: 13px; float: right; margin-top: 5px; visibility: visible; }
                        #artist_filter_select_div { position: absolute; top: calc(100% + 4px); display: none; list-style-type: none; text-align: left; font-size: 1em; background-color: #FFF; width: 100%; box-sizing: border-box; }
                        .artist_filter_select_span { display: list-item; font-size: 19px; font-weight: 400; color: #838e95; padding: 0.4em 1em; user-select: none; }
                        .artist_filter_select_span.selected { color: #F361A6; }
                        .artist_filter_select_span:hover { background-color: #ebedef; }
                    }
                    &.active {
                        #artist_filter_select_div { display: block; animation: artistFilterFadeInUp 400ms; }
                    }
                }
            }

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
    }

    @keyframes artistFilterFadeInUp {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>
