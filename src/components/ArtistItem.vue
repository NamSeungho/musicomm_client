<template>
    <div class="artist_item">
        <div class="artist_item_wrap">
            <router-link :to="'/artist/' + artist.artistId" class="artist_item_a">
                <img class="artist_item_img" :src="'/images/artist/' + artist.artistId + '.jpg'" :alt="artist.artistId" />
            </router-link>
            <div class="artist_item_title_div">
                <div><router-link :to="'/artist/' + artist.artistId" class="artist_title">{{ artist.title }}<span v-if="artist.title_en !== ''"> ({{ artist.title_en }})</span></router-link></div>
                <span class="artist_group_type" v-if="artist.type === '1'">여성그룹</span>
                <span class="artist_group_type" v-if="artist.type === '2'">남성그룹</span>
                <span class="artist_group_type" v-if="artist.type === '3'">혼성그룹</span>
                <span class="artist_group_type" v-if="artist.type === '4'">여성솔로</span>
                <span class="artist_group_type" v-if="artist.type === '5'">남성솔로</span>
                <span class="artist_songs_number">{{ artist.debut.substr(0, 4) }}. {{ artist.debut.substr(4, 2) }}. {{ artist.debut.substr(6, 2) }} 데뷔</span>
            </div>
            <div class="artist_item_likes_div">
                <img v-if="!artist.isLike" class="artist_item_likes_img" src="/images/icon_likes_off.png" @click="favoriteArtist(true)" alt="좋아요 취소" />
                <img v-else class="artist_item_likes_img on" src="/images/icon_likes_on.png" @click="favoriteArtist(false)" alt="좋아요" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MusicItem",
        props: {
            artist: Object
        },
        computed: {
            resolution() {
                return this.$store.getters.resolution;
            }
        },
        methods: {
            favoriteArtist: function (isFavorite) {
                this.$emit('like', this.artist.artistId, isFavorite);
            }
        }
    }
</script>

<style scoped lang="scss">
    .artist_item { width: 25%; padding: 0 7px 30px; display: inline-block; }
    .artist_item_wrap {
        & { position: relative; display: block; font-size: 12pt; font-weight: 400; text-align: left; background-color: rgba(255, 255, 255, 0.075); border-bottom: none; border-radius: 6px; outline: 0; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
            -moz-transition: all 0.2s ease;
            -webkit-transition: all 0.2s ease;
            -ms-transition: all 0.2s ease;
            transition: all 0.2s ease;
        }
        &:hover { background-color: rgba(255, 255, 255, 0.25); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), 0 0 0.5em 0 #FF6382; }

        .artist_item_a { line-height: 0; display: block; }
        .artist_item_img { width: 100%; cursor: pointer; }
        .artist_item_title_div { display: inline-block; padding: 5px 0 7px 18px; width: calc(100% - 44px); }
        .artist_item_title_div > div { height: 28px; margin-bottom: 2px; }
        .artist_item_title_div .artist_title { line-height: 28px; font-size: 16px; cursor: pointer; color: #FFFFFF !important; transition: initial; display: inline-block; max-width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .artist_item_title_div .artist_title:hover { text-decoration: underline; color: #FFFFFF !important; }
        .artist_item_title_div .artist_group_type { line-height: 18px; font-size: 14px; margin: 0; padding: 0; display: block; }
        .artist_item_title_div .artist_songs_number { line-height: 18px; font-size: 14px; margin: 0; padding: 0; display: block; }
        .artist_item_likes_div { position: absolute; height: 24px; right: 12px; bottom: 26px; }
        .artist_item_likes_img { width: 24px; cursor: pointer; }
    }
</style>
