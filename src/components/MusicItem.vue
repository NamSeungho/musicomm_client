<template>
    <div class="music_video_list_item" :class="{ 'medium': resolution === 'MEDIUM' }">
        <div class="music_video_list_item_wrap">
            <div>
                <div class="music_video_list_item_thumbnail_cover" v-bind:class="{ active: music.isActive }" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" @mousemove="music.isActive = true" @click="$emit('play', music.video)">
                    <img class="music_video_list_item_thumbnail_cover_img" src="/images/icon_play_round.png" alt="" />
                </div>
                <img class="music_video_list_item_thumbnail" @mouseenter="music.isActive = true" @mouseleave="music.isActive = false" :src="'https://i.ytimg.com/vi/' + music.video + '/mqdefault.jpg'" :alt="music.title" />
            </div>
            <div class="music_video_list_item_title_div">
                <router-link :to="'/music/' + music.video" class="music_video_list_item_music_name">{{ music.title }}</router-link>
                <router-link :to="'/artist/' + music.artistId" class="music_video_list_item_artist">{{ music.artist }}</router-link>
                <div class="music_item_arrow_div" v-if="music.singer.length > 1">
                    <img class="music_item_arrow arrow_up" src="/images/up_arrow.png" alt="" @click="music.isArrow = false" v-if="music.isArrow" />
                    <img class="music_item_arrow" src="/images/down_arrow.png" alt="" @click="music.isArrow = true" v-else />
                    <div class="music_item_singer_div" v-if="music.isArrow">
                        <div v-for="(singer, index) in music.singer" :key="index">
                            <router-link :to="'/artist/' + singer._id" tag="p" class="music_item_singer_item">{{ singer.name }}</router-link>
                        </div>
                    </div>
                </div>
                <span class="music_video_list_item_release_date">{{ music.release.substr(0,4) }}.{{ music.release.substr(4,2) }}.{{ music.release.substr(6,2) }}</span>
            </div>
            <div class="music_video_list_item_fav_div">
                <img v-if="music.isFavorite" class="music_video_list_item_fav_img on" src="/images/icon_fav_on.png" alt="즐겨찾기" @click="$emit('favorite', music.video, false)" />
                <img v-else class="music_video_list_item_fav_img" src="/images/icon_fav_off.png" alt="즐겨찾기 취소" @click="$emit('favorite', music.video, true)" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MusicItem",
        props: {
            music: Object
        },
        computed: {
            resolution() {
                return this.$store.getters.resolution;
            }
        }
    }
</script>

<style scoped lang="scss">
    .music_video_list_item {
        & { width: 25%; padding: 0 7px 30px; display: inline-block; vertical-align: top; }
        &.medium { width: 33%; }

        .music_video_list_item_wrap {
            & { position: relative; font-size: 12pt; border-bottom: none; display: block; text-align: left; border-radius: 6px; background-color: rgba(0, 0, 0, 0.25); outline: 0;
                -moz-transition: all 0.2s ease;
                -webkit-transition: all 0.2s ease;
                -ms-transition: all 0.2s ease;
                transition: all 0.2s ease;
            }
            &:hover { background-color: rgba(0, 0, 0, 0.15); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), 0 0 0.5em 0 #AAAAAA; }
            & > div { position: relative; display: flex; }
            .music_video_list_item_thumbnail { width: 100%; cursor: pointer; }
            .music_video_list_item_thumbnail_cover { background:rgba(0,0,0,0.4); position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-top-left-radius: 6px; border-top-right-radius: 6px; opacity: 0; cursor: pointer;
                -moz-transition: opacity 0.3s ease;
                -webkit-transition: opacity 0.3s ease;
                -ms-transition: opacity 0.3s ease;
                transition: opacity 0.3s ease;
            }
            .music_video_list_item_thumbnail_cover.active { opacity: 1; }
            .music_video_list_item_thumbnail_cover_img { width: 40px; position: absolute; bottom: 12px; right: 12px; }

            .music_video_list_item_title_div { width: calc(100% - 44px); position: relative; display: inline-block; padding: 5px 15px 7px; letter-spacing: 0.4px; line-height: 1; }
            .music_video_list_item_title_div > span { display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 100%; }
            .music_video_list_item_music_name { display: block; font-weight: 400; font-size: 23px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; cursor: pointer; line-height: 1.4; max-width: 100%; color: #FFFFFF !important; }
            .music_video_list_item_music_name:hover { text-decoration: underline; }
            .music_video_list_item_artist { display: inline-block; font-weight: 400; font-size: 20px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; line-height: 1; cursor: pointer; max-width: 100%; color: #FFFFFF !important; }
            .music_video_list_item_artist:hover { text-decoration: underline; }
            .music_video_list_item_release_date { display: block; font-size: 20px; line-height: 1; }
            .music_video_list_item_fav_div { display: inline-block; padding: 7px 10px 7px 0; letter-spacing: 0.4px; vertical-align: top; float: right; line-height: 4; }
            .music_video_list_item_fav_img { width: 32px; padding: 4px; margin-top: -4px; vertical-align: middle; cursor: pointer; }
            .music_list_item_play_div { display: inline-block; padding: 7px 0 7px 0; letter-spacing: 0.4px; vertical-align: top; float: right; line-height: 3; }
            .music_list_item_play { width: 32px; padding: 5px; margin-top: -4px; }

            .music_item_arrow_div { display: inline-block; vertical-align: top; }
            .music_item_arrow { width: 12px; margin: 3px 0 0 5px; vertical-align: top; cursor: pointer; }

            .music_item_singer_div { position: absolute; width: 160px; margin: 3px 0 0 -70px; padding: 2px 15px; border: 1px solid #FFF; background: #444; z-index: 1; }
            .music_item_singer_item { position: relative; display: inline-block; margin: 0; padding: 0; cursor: pointer; line-height: 25px; vertical-align: top; font-size: 20px; color: #FFFFFF !important; transition: initial; }
            .music_item_singer_item:hover { text-decoration: underline; }
        }
    }
</style>
