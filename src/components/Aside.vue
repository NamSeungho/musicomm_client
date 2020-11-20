<template>
    <aside id="frame_aside">
        <div id="player_container" class="noselect" ref="playerContainer" @mouseleave="playerLeave" @mouseup="playerLeave">
            <div id="player">
                <span>뮤직 플레이어</span>
            </div>

            <div id="player_control_wrap" class="on">
                <div>
                    <p id="player_control_music_title">{{ musicTitle }}</p>
                    <p id="player_control_music_time">{{ musicTime }}</p>
                    <div id="player_control_progress_bar" ref="playerProgressBar" @mousedown="progressBarDown" @mouseup="progressBarUp" @mouseenter="progressBarEnter" @mouseleave="progressBarLeave" @mousemove="progressBarMove">
                        <div id="player_control_progress_bar_active" :style="{ width: playerProgressBarWidth + '%' }"></div>
                    </div>
                    <img id="player_control_play_btn" src="/images/player_pause.png" alt='재생' v-if="playerStatus === 'PLAYING'" @click="pause" />
                    <img id="player_control_play_btn" src="/images/player_play.png" alt='재생' v-else @click="play" />
                    <img id="player_control_prev_btn" src="/images/player_prev.png" alt='이전 음악' @click="prev" />
                    <img id="player_control_next_btn" src="/images/player_next.png" alt='다음 음악' @click="next" />
                    <img id="player_control_large_btn" src="/images/player_large.png" alt='크게보기' @click="fullscreen" />
                    <img id="player_control_repeat_btn" src="/images/player_repeat_on.png" alt='반복 재생' v-if="playerRepeat" @click="repeat(false)" />
                    <img id="player_control_repeat_btn" src="/images/player_repeat.png" alt='반복 재생' v-else @click="repeat(true)" />
                    <img id="player_control_shuffle_btn" src="/images/player_shuffle_on.png" alt='셔플 재생' v-if="playerShuffle" @click="shuffle(false)" />
                    <img id="player_control_shuffle_btn" src="/images/player_shuffle.png" alt='셔플 재생' v-else @click="shuffle(true)" />
                    <img id="player_control_volume_btn" src="/images/player_volume.png" alt='볼륨 조절' v-if="playerMute" @click="mute(false)" />
                    <img id="player_control_volume_btn" src="/images/player_volume_on.png" alt='볼륨 조절' v-else @click="mute(true)" />
                    <div id="player_control_volume_bar" ref="playerVolumeBar" @mousedown="volumeBarDown" @mouseup="volumeBarUp" @mouseenter="volumeBarEnter" @mouseleave="volumeBarLeave" @mousemove="volumeBarMove">
                        <div id="player_control_volume_bar_active" :style="{ width: playerVolumeBarsWidth + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div id="aside_container">
            <div id="aside_partition">
                <div id="aside_partition_text_wrap">
<!--                    <span id="active_chatting_wrap_button" class="aside_partition_text" v-bind:class="{ on : chattingMode }" @click="chattingMode = true">채팅</span><span id="aside_partition_button_token"> / </span>-->
                    <span id="active_lyrics_wrap_button" class="aside_partition_text" v-bind:class="{ on : !chattingMode }" @click="chattingMode = false">가사</span>
                </div>
            </div>
            <div id="aside_contents_wrap">
                <div id="aside_chatting_wrap" v-bind:class="{ on : chattingMode }">
                    <div id="aside_chatting_container">
                        <div id="aside_chatting_contents_wrap" ref="chattingContainer">
                            <div class="aside_chatting_contents" v-for="chatting in chattingList" v-bind:key="chatting.key">
                                <div id='chatting_message_name_wrap'>
                                    <router-link :to="'/profile/' + chatting.userId" class="chatting_message_name">{{ chatting.nickname }}</router-link>
                                    <span class='chatting_message_time'>{{ chatting.timestamp }}</span>
                                </div>
                                <span class='chatting_message_content'>{{ chatting.message }}</span>
                            </div>
                        </div>
                        <div id="aside_chatting_input_wrap">
                            <div id="aside_chatting_textarea_wrap">
                                <textarea id="aside_chatting_textarea" maxlength="200" placeholder="채팅 메세지를 입력하세요" v-model="chattingMessage" @keypress.enter.prevent="keydownSendChattingMessage" />
                            </div>
                            <p id="aside_chatting_send_button" style="cursor: pointer;" @click="sendChattingMessage">
                                <img id="aside_chatting_send_img" src="/images/icon_send.png">
                            </p>
                        </div>
                    </div>
                </div>
                <div id="aside_lyrics_wrap" v-bind:class="{ on : !chattingMode }">
                    <div id="aside_lyrics_container" ref="lyricsContainer">
                        <p id="aside_lyrics_title" class="empty" v-if="lyricsTitle === ''">재생중인 음악이 없습니다</p>
                        <p id="aside_lyrics_title" v-else>{{ lyricsTitle }}</p>
                        <div id="aside_lyrics_contents_wrap" v-html="lyricsContents"></div>
                    </div>
                </div>
            </div>

            <div id="aside_ad_wrap">
                <div class="container" style=" position: relative; width: 100%; height: auto; text-align: center; padding: 0;">
                    <div style="width: 100%; height: 100%; display: inline-block; text-align: right; padding-right: 7px;">
                        <!-- 데스크탑 aside 배너 -->
                        <Adsense :styles="'display:inline-block;width:410px;height:60px'" :clientNo="'ca-pub-7268044498226837'" :slotNo="'9688616863'" />
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
    import Adsense from "./Adsense";

    export default {
        name: 'Header',
        components: {
            Adsense
        },
        data: function () {
            return {
                YT: null,
                player: null,
                playerStatus: 'ENDED',
                playerInterval: null,
                playerProgressBarWidth: '0',
                playerVolumeBarsWidth: '100',
                playerRepeat: false,
                playerShuffle: false,
                playerMute: false,
                playCount: 0,
                isProgressBarDown: false,
                isProgressBarHover: false,
                isVolumeBarDown: false,
                isVolumeBarHover: false,
                musicTitle: '',
                musicTime: '0:00 / 0:00',
                lyricsTitle: '',
                lyricsContents: '',
                chattingMode: false,
                chattingList: [],
                chattingMessage: '',
                chattingFirstDraw: true
            }
        },
        computed: {
            playlist () {
                let playlist = this.$store.getters.playlist.map(item => item);

                if (this.playerShuffle) {
                    let j, x, i;
                    for (i = playlist.length; i; i -= 1) {
                        j = Math.floor(Math.random() * i);
                        x = playlist[i - 1];
                        playlist[i - 1] = playlist[j];
                        playlist[j] = x;
                    }
                }

                return playlist;
            },
            videoId () {
                return this.$store.getters.videoId;
            }
        },
        watch: {
            playlist () {
                this.chattingMode = false;
            },
            videoId (videoId) {
                this.start(videoId);
            }
        },
        mounted () {
            // Youtube Player
            let tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;

            // Chatting
            this.getChattingMessage();
            setInterval(() => this.getChattingMessage(), 30000);
        },
        methods: {
            onYouTubeIframeAPIReady: function () {
                this.YT = window.YT;
            },
            onPlayerReady: function (event) {
                event.target.playVideo();
            },
            onPlayerStateChange: function (event) {
                if(event.data === this.YT.PlayerState.ENDED) {
                    this.playerStatus = 'ENDED';

                    if( this.playerInterval != null ) {
                        clearInterval(this.playerInterval);
                        this.playerInterval = null;
                    }

                    if (this.playerRepeat) {
                        this.playCount = 0;
                        this.player.seekTo(0);
                    } else {
                        this.next();
                    }
                } else if(event.data === this.YT.PlayerState.PLAYING) {
                    this.playerStatus = 'PLAYING';

                    if (this.playerInterval == null) {
                        this.playerInterval = setInterval(() => {
                            const curTime = this.player.getCurrentTime();
                            const duration = this.player.getDuration();

                            if (curTime === undefined || duration === undefined) {
                                return;
                            }

                            this.playerProgressBarWidth = (curTime / duration * 100);
                            this.musicTime = (parseInt(curTime/60))+":"+((parseInt(curTime)%60)<10 ? "0"+(parseInt(curTime)%60) : (parseInt(curTime)%60)) + " / " + (parseInt(duration/60))+":"+((parseInt(duration)%60)<10 ? "0"+(parseInt(duration)%60) : (parseInt(duration)%60));

                            this.playCount++;
                            if(this.playCount === 300) {
                                const video = this.playlist.filter(item => item.video === this.videoId)[0];

                                this.axios.post(this.$store.getters.serverUrl + 'api/music/play', {
                                    video: video.video,
                                    artist: video.artist
                                }).then(() => {
                                    //
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        }, 200);
                    }
                } else if(event.data === this.YT.PlayerState.PAUSED || event.data === this.YT.PlayerState.UNSTARTED || event.data === this.YT.PlayerState.BUFFERING) {
                    this.playerStatus = 'PAUSED';

                    if( this.playerInterval != null ) {
                        clearInterval(this.playerInterval);
                        this.playerInterval = null;
                    }
                }
            },
            start: function (videoId) {
                this.playCount = 0;

                if (this.player === null) {
                    this.player = new this.YT.Player('player', {
                        width: this.$refs.playerContainer.clientWidth,
                        height: this.$refs.playerContainer.clientWidth / 16 * 9,
                        playerVars: {
                            'autoplay': 1,
                            'controls': 0,
                            'cc_load_policy': 0,
                            'disablekb': 1,
                            'iv_load_policy': 3,
                            'loop': 1,
                            'modestbranding': 1,
                            'rel': 0,
                            'showinfo': 0,
                            'playsinline': 0
                        },
                        videoId: videoId,
                        events: {
                            'onReady': this.onPlayerReady,
                            'onStateChange': this.onPlayerStateChange
                        }
                    });
                } else {
                    try {
                        this.player.loadVideoById(videoId, 0, 'hd1080');
                    } catch (e) {
                        console.log('아직 음악을 재생할 준비가 되지 않았습니다<br/>다시 한번 시도해주세요');
                    }
                }

                const video = this.playlist.filter(item => item.video === videoId)[0];
                this.musicTitle = video.title + ' - ' + video.singer[0].name;
                this.getLyricsFile(videoId);
            },
            play: function () {
                if (this.player === null) {
                    return;
                }

                this.player.playVideo();
            },
            pause: function () {
                if (this.player === null) {
                    return;
                }

                this.player.pauseVideo();
            },
            prev: function () {
                if (this.player === null) {
                    return;
                }

                if( this.playerInterval != null ) {
                    clearInterval(this.playerInterval);
                    this.playerInterval = null;
                }

                const currentVideoIndex = this.playlist.map(item => item.video).indexOf(this.videoId);
                if (currentVideoIndex === 0) {
                    this.$store.dispatch('setVideoId', this.playlist[this.playlist.length-1].video);
                } else {
                    this.$store.dispatch('setVideoId', this.playlist[currentVideoIndex-1].video);
                }
            },
            next: function () {
                if (this.player === null) {
                    return;
                }

                if( this.playerInterval != null ) {
                    clearInterval(this.playerInterval);
                    this.playerInterval = null;
                }

                const currentVideoIndex = this.playlist.map(item => item.video).indexOf(this.videoId);
                if (currentVideoIndex === this.playlist.length-1) {
                    this.$store.dispatch('setVideoId', this.playlist[0].video);
                } else {
                    this.$store.dispatch('setVideoId', this.playlist[currentVideoIndex+1].video);
                }
            },
            repeat: function (playerRepeat) {
                if (this.player === null) {
                    return;
                }

                this.playerRepeat = playerRepeat;
            },
            shuffle: function (playerShuffle) {
                if (this.player === null) {
                    return;
                }

                this.playerShuffle = playerShuffle;
            },
            mute: function (playerMute) {
                if (this.player === null) {
                    return;
                }

                this.playerMute = playerMute;

                if (playerMute) {
                    this.player.setVolume(0);
                    this.playerVolumeBarsWidth = 0;
                } else {
                    this.player.setVolume(80);
                    this.playerVolumeBarsWidth = 80;
                }
            },
            fullscreen: function () {
                if (this.player === null) {
                    return;
                }

                var ppp = document.querySelector.bind(document);
                var requestFullScreen = ppp('#player').requestFullScreen || ppp('#player').mozRequestFullScreen || ppp('#player').webkitRequestFullScreen;
                if (requestFullScreen) {
                    requestFullScreen.bind(ppp('#player'))();
                }
            },
            progressBarDown: function (event) {
                if (this.player === null) {
                    return;
                }

                this.isProgressBarDown = true;
                this.isProgressBarHover = true;

                this.progressBarHandle(event);
            },
            progressBarUp: function () {
                this.isProgressBarHover = false;
            },
            progressBarEnter: function () {
                if (this.isProgressBarDown) {
                    this.isProgressBarHover = true;
                }
            },
            progressBarLeave: function () {
                this.isProgressBarHover = false;
            },
            progressBarMove: function (event) {
                if (this.isProgressBarDown) {
                    this.progressBarHandle(event);
                }
            },
            progressBarHandle: function (event) {
                if (this.isProgressBarHover) {
                    let x;
                    if (event.target.id === 'player_control_progress_bar')
                        x = event.pageX - (event.target.parentNode.parentNode.parentNode.parentNode.offsetLeft + event.target.offsetLeft);
                    else
                        x = event.pageX - (event.target.parentNode.parentNode.parentNode.parentNode.parentNode.offsetLeft + event.target.parentNode.offsetLeft);

                    const curTime = this.player.getCurrentTime();
                    const duration = this.player.getDuration();

                    this.player.seekTo(duration * x / this.$refs.playerProgressBar.clientWidth);
                    this.playerProgressBarWidth = (curTime / duration * 100);
                    this.musicTime = (parseInt(curTime/60))+":"+((parseInt(curTime)%60)<10 ? "0"+(parseInt(curTime)%60) : (parseInt(curTime)%60)) + " / " + (parseInt(duration/60))+":"+((parseInt(duration)%60)<10 ? "0"+(parseInt(duration)%60) : (parseInt(duration)%60));
                }
            },
            volumeBarDown: function (event) {
                if (this.player === null) {
                    return;
                }

                this.isVolumeBarDown = true;
                this.isVolumeBarHover = true;

                this.volumeBarHandle(event);
            },
            volumeBarUp: function () {
                this.isVolumeBarHover = false;
            },
            volumeBarEnter: function () {
                if (this.isVolumeBarDown) {
                    this.isVolumeBarHover = true;
                }
            },
            volumeBarLeave: function (event) {
                if (this.isVolumeBarHover) {
                    if( event.offsetX >= 100 ) {
                        this.playerVolumeBarsWidth = '100';
                        this.player.setVolume(100);
                        this.playerMute = false;
                    }
                    else if( event.offsetX <= 0 ) {
                        this.playerVolumeBarsWidth = '0';
                        this.player.setVolume(0);
                        this.playerMute = true;
                    }
                }
                this.isVolumeBarHover = false;
            },
            volumeBarMove: function (event) {
                if (this.isVolumeBarDown) {
                    this.volumeBarHandle(event);
                }
            },
            volumeBarHandle: function (event) {
                if (this.isVolumeBarHover) {
                    let x;
                    if(event.target.id === 'player_control_volume_bar')
                        x = event.pageX - (event.target.parentNode.parentNode.parentNode.parentNode.offsetLeft + event.target.offsetLeft);
                    else
                        x = event.pageX - (event.target.parentNode.parentNode.parentNode.parentNode.parentNode.offsetLeft + event.target.parentNode.offsetLeft);
                    const volume = parseInt(x / this.$refs.playerVolumeBar.clientWidth * 100);
                    this.playerVolumeBarsWidth = volume;
                    this.player.setVolume(volume);
                    if (volume <= 0) {
                        this.playerMute = true;
                    } else {
                        this.playerMute = false;
                    }
                }
            },
            playerLeave: function () {
                this.isProgressBarDown = false;
                this.isProgressBarHover = false;
                this.isVolumeBarDown = false;
                this.isVolumeBarHover = false;
            },
            getLyricsFile: function (videoId) {
                this.axios.get(this.$store.getters.serverUrl + 'lyrics/' + videoId).then((response) => {
                    const lyrics = response.data.split("\n");
                    this.lyricsTitle = lyrics[0];

                    let html = '';
                    for (let i = 1; i < lyrics.length; i++) {
                        if (lyrics[i] === '') {
                            html += '<p class="aside_lyrics_nbsp_contents">&nbsp;</p>';
                        } else {
                            html += '<p class="aside_lyrics_contents">' + lyrics[i] + '</p>';
                        }
                    }
                    this.lyricsContents = html;

                    this.$refs.lyricsContainer.scrollTop = 0;
                }).catch((error) => {
                    console.log(error);
                });
            },
            drawChattingMessage: function (data) {
                this.chattingList = data.chatList.map((chatInfo, index) => {
                    let timestamp = data.currentTimeStamp - chatInfo.timestamp;
                    if(timestamp / 1000 < 60)
                        timestamp = Math.floor(timestamp / 1000)+"초 전";
                    else if(timestamp / 60000 < 60)
                        timestamp = Math.floor(timestamp / 60000)+"분 전";
                    else if(timestamp / 3600000 < 24)
                        timestamp = Math.floor(timestamp / 3600000)+"시간 전";
                    else if(timestamp / 86400000 < 30)
                        timestamp = Math.floor(timestamp / 86400000)+"일 전";
                    else if(timestamp / 31536000000 >= 1)
                        timestamp = Math.floor(timestamp / 31536000000)+"년 전";
                    else
                        timestamp = Math.floor(timestamp / 2592000000)+"달 전";

                    chatInfo.key = index;
                    chatInfo.timestamp = timestamp;
                    chatInfo.message = chatInfo.message.replace(/\n/g, '<br/>');

                    return chatInfo;
                });

                if (this.chattingFirstDraw) {
                    this.chattingFirstDraw = false;
                    setTimeout(() => {
                        this.$refs.chattingContainer.scrollTop = 10000000;
                    }, 200);
                }
            },
            getChattingMessage: function () {
                this.axios.post(this.$store.getters.serverUrl + 'api/chat/select', {}).then((response) => {
                    this.drawChattingMessage(response.data.result);
                }).catch((error) => {
                    console.log(error);
                });
            },
            keydownSendChattingMessage: function () {
                this.sendChattingMessage();
            },
            sendChattingMessage: function () {
                if (this.$store.getters.user === '') {
                    this.$showAlert('로그인이 필요합니다', '확인', () => {
                        this.$store.dispatch('setSignInPopupType', 'LOGIN');
                        this.$store.dispatch('setSignInPopupStatus', 'SHOW');
                    });
                    return;
                }

                if (this.chattingMessage === '') {
                    return;
                }

                this.$socket.emit('chat',{
                    id      : this.$store.getters.user,
                    name    : this.$store.getters.nickname,
                    message : this.chattingMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                });

                this.chattingMessage = '';
            }
        },
        sockets: {
            connect: function () {
                //
            },
            chat: function (data) {
                this.chattingList.push({
                    key: this.chattingList.length,
                    userId: data.id,
                    nickname: data.name,
                    message: data.message,
                    timestamp: '방금'
                });

                setTimeout(() => {
                    this.$refs.chattingContainer.scrollTop = 10000000;
                }, 200);
            }
        }
    }
</script>

<style lang="scss">
    #frame_aside #player_container #player { width: 100%; height: 253.125px; background-color: #000; display: block; line-height: 253.125px; text-align: center; color: #FFFFFF; font-weight: 400; }

    #frame_aside #aside_lyrics_wrap {
        & { width: 100%; height: 100%; display: none; padding-bottom: 10px; }
        &.on { display: block; }

        #aside_lyrics_container { position: relative; width: 100%; height: 100%; overflow-y: auto; }
        #aside_lyrics_title { margin: 0 0 19px 0; padding: 0; font-size: 24px; font-weight: 500; line-height: 23px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; color: #333333; }
        #aside_lyrics_title.empty { text-align: center; margin-top: 30px; }
        .aside_lyrics_contents { margin: 0; font-size: 22px; font-weight: 400; line-height: 27px; color: #666666; }
        .aside_lyrics_nbsp_contents { margin: 0; font-size: 15px; line-height: 1; }
    }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    /*todo*/
    #frame_aside {
        & { position: fixed; width: 450px; height: 100%; min-height: 500px; right: 0; top: 0; padding-top: 55px; border-left: 1px solid #AAAAAA; background-color: #FFFFFF; }

        #player_container {
            & { position: relative; width: 450px; }

            #player { width: 100%; height: 253.125px; background-color: #000; display: block; line-height: 253.125px; text-align: center; color: #FFFFFF; font-weight: 400;}
            #player > span { display: block; padding-top: 30px; font-size: 25px; }

            #player_control_wrap {
                & { position: relative; width: 100%; height: 120px; display: block; z-index: 90; opacity: 1;
                    background: rgba(0,0,0,0.75);
                    background: -webkit-linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.9), rgba(0,0,0,0.75), rgba(0,0,0,0.6), rgba(0,0,0,0.45), rgba(0,0,0,0.3), rgba(0,0,0,0)); /* For Safari 5.1 to 6.0 */
                    background: -o-linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.9), rgba(0,0,0,0.75), rgba(0,0,0,0.6), rgba(0,0,0,0.45), rgba(0,0,0,0.3), rgba(0,0,0,0)); /* For Opera 11.1 to 12.0 */
                    background: -moz-linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.9), rgba(0,0,0,0.75), rgba(0,0,0,0.6), rgba(0,0,0,0.45), rgba(0,0,0,0.3), rgba(0,0,0,0)); /* For Firefox 3.6 to 15 */
                    background: linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.9), rgba(0,0,0,0.75), rgba(0,0,0,0.6), rgba(0,0,0,0.45), rgba(0,0,0,0.3), rgba(0,0,0,0)); /* Standard syntax */
                }
                & > div { opacity: 0; height: 0; overflow: hidden;
                    -moz-transition: opacity 0.4s ease;
                    -webkit-transition: opacity 0.4s ease;
                    -ms-transition: opacity 0.4s ease;
                    transition: opacity 0.4s ease; }
                &.on > div { opacity: 1; height: auto; }
                &.large { position: fixed; bottom: 0; width: 100%; height: 120px; z-index: 110;}

                #player_control_music_title { width: 100%; height: 36px; margin: 0; padding: 10px 5% 4px; color: #FFFFFF; font-size: 23px; font-weight: 400; line-height: 1; display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
                #player_control_music_time { margin: 0; padding: 0 5% 9px 0; text-align: right; color: #FFFFFF; font-size: 21px; font-weight: 400; line-height: 1; letter-spacing: 1px; }
                #player_control_progress_bar { width: 90%; height: 8px; margin: 0 auto; background-color: #FFFFFF; border-radius: 4px; cursor: pointer; }
                #player_control_progress_bar_active { width: 0%; height: 8px; background-color: #F361DC; border-radius: 4px; cursor: pointer; }
                #player_control_play_btn { margin-left: 5%; margin-top: 12px; height: 23px; cursor: pointer; }
                #player_control_prev_btn { margin-left: 14px; margin-top: 12px; height: 23px; cursor: pointer; }
                #player_control_next_btn { margin-left: 14px; margin-top: 12px; height: 23px; cursor: pointer; }
                #player_control_large_btn { float: right; margin-right: 5%; margin-top: 12px; height: 23px; cursor: pointer; }
                #player_control_repeat_btn { margin-left: 36px; margin-top: 12px; height: 23px; cursor: pointer; }
                #player_control_shuffle_btn { margin-left: 14px; margin-top: 12px; height: 23px; cursor: pointer; }
                #player_control_volume_bar { width: 100px; height: 8px; margin: 0 auto; background-color: #FFFFFF; border-radius: 4px; cursor: pointer; display: inline-block; vertical-align: top; margin-top: 19px; }
                #player_control_volume_bar_active { width: 100%; height: 8px; background-color: #F361A6; border-radius: 4px; cursor: pointer; }
                #player_control_volume_btn { margin-right: 14px; margin-left: 36px; margin-top: 12px; height: 23px; cursor: pointer; }
            }
        }

        #aside_container {
            & { position: relative; width: 410px; height: calc(100% - 373.125px); margin: 0 auto; background-color: rgba(0,0,0,0); }

            #aside_partition {
                & { width: 100%; display: inline-block; text-align: center; margin: 14px 0; font-size: 22px; color: #888888; font-weight: 400; position: relative; height: 23px; }
                &::after { content: ''; width: 100%; height: 1px; position: absolute; top: 50%; left: 0; margin-top: -0.5px; background-color: #AAAAAA; }

                #aside_partition_text_wrap { position: relative; padding: 0 13px; box-sizing: border-box; background-color: #fff; display: inline-block; z-index: 1; }
                .aside_partition_text { font-weight: 500; color: #333333; }
                /*.aside_partition_text { border-bottom: 1px solid #FFFFFF; cursor: pointer; }*/
                /*.aside_partition_text:hover { border-bottom: 1px solid #888888; font-weight: 500; }*/
                /*.aside_partition_text.on { border-bottom: 1px solid #333333; font-weight: 500; color: #333333; }*/
            }

            #aside_contents_wrap {
                & { position: relative; width: 410px; height: calc(100% - 118px); margin: 0 auto; }

                #aside_chatting_wrap {
                    & { width: 100%; height: 100%; display: none; padding-bottom: 14px; }
                    &.on { display: block; }

                    #aside_chatting_container { position: relative; width: 100%; height: 100%; }
                    #aside_chatting_contents_wrap { position: relative; height: calc(100% - 70px); overflow-y: auto; }
                    #aside_chatting_input_wrap { width: 100%; height: 55px; position: relative; margin-top: 10px; box-sizing: border-box; justify-content: flex-start; align-items: center; background-color: #fff;
                        display: flex;
                        display: -ms-flexbox;
                        -webkit-box-align: center;
                        -ms-flex-align: center;
                        -webkit-box-pack: start;
                        -ms-flex-pack: start;
                    }
                    #aside_chatting_textarea_wrap { width: 343px; height: 100%; margin: 0 10px 0 0; }
                    #aside_chatting_textarea { width: 100%; height: 100%; padding: 10px 12px; font-size: 20px; box-sizing: border-box; background-color: #EEEEEE; resize: none; border: none; letter-spacing: 0.4px; border-radius: 5px; font-weight: 400; }
                    .aside_chatting_contents { margin: 0; font-size: 22px; font-weight: 400; line-height: 24px; margin-bottom: 13px; }
                    .chatting_message_name { cursor: pointer; color: #333333; font-weight: 500; text-decoration: none; }
                    .chatting_message_name:hover { text-decoration: none; }
                    .chatting_message_time { margin-left: 6px; font-size: 19px; color: #AAAAAA; }
                    .chatting_message_content { color: #666666; display: block; padding-left: 8px; }
                    #aside_chatting_send_button { width: 55px; height: 100%; margin: 0; position: relative; justify-content: center; align-items: center; border: 2px solid #F361A6; box-sizing: border-box;
                        display: flex;
                        display: -ms-flexbox;
                        -webkit-box-align: center;
                        -ms-flex-align: center;
                        -webkit-box-pack: center;
                        -ms-flex-pack: center;
                        -webkit-border-radius: 10px;
                        -moz-border-radius: 10px;
                        -ms-border-radius: 10px;
                        -o-border-radius: 10px;
                        border-radius: 10px;
                    }
                    #aside_chatting_send_img { width: 25px; margin-left: 1px; }
                }
            }
        }
    }
</style>


