<template>
    <div class="admin_template">
        <div class="register_area" id="register_music_area">
            <p class="register_area_title">Register Music</p>

            <div class="register_input_area">
                <span class="register_input_area_title">artist</span>
                <input id="insert_music_artist" class="register_input_area_input form-control" type="text" placeholder="artist" v-model="inputArtistId" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">video</span>
                <input id="insert_music_video" class="register_input_area_input form-control" type="text" placeholder="video" v-model="inputVideoId" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">title</span>
                <input id="insert_music_title" class="register_input_area_input form-control" type="text" placeholder="title" v-model="inputVideoName" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">type</span>
                <input id="insert_music_type" class="register_input_area_input form-control" type="text" placeholder="number" v-model="inputVideoType" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">release</span>
                <input id="insert_music_release" class="register_input_area_input form-control" type="number" placeholder="release" v-model="inputVideoRelease" />

                <div id="register_music_button" class="register_button" @click="insertMusic">Register</div>
            </div>

            <div class='collaboration_artist_wrap' v-for="(artist, index) in collaborationArtists" v-bind:key="index">
                <p class='collaboration_artist_warp_title'>Collaboration Artist {{ index+1 }}</p>
                <div>
                    <span>id</span>
                    <input class='form-control insert_music_artist_id' type='text' placeholder='id' v-model="artist.id" />
                </div>
                <div>
                    <span>title</span>
                    <input class='form-control insert_music_artist_title' type='text' placeholder='title' v-model="artist.title" />
                </div>
                <div>
                    <span>title_en</span>
                    <input class='form-control insert_music_artist_title_en' type='text' placeholder='title_en' v-model="artist.subtitle" />
                </div>
            </div>

            <div id="add_artist_button" @click="addCollaborationArtist">Add Artist</div>
        </div>

        <div class="register_area" id="register_lyrics_area">
            <p class="register_area_title">Register Lirics</p>

            <div class="register_input_area">
                <span class="register_input_area_title">title</span>
                <input id="input_register_lyrics_title" class="register_input_area_input form-control" type="text" placeholder="file name" v-model="inputLyricsVideoId" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">lyrics</span>
                <textarea id="input_register_lyrics_contents" class="register_input_area_input form-control" style="height: 300px;" v-model="inputLyrics"></textarea>

                <div id="register_lyrics_button" class="register_button" @click="insertLyrics">Register</div>
            </div>
        </div>

        <div class="register_area" id="register_artist_area">
            <p class="register_area_title">Register Artist</p>

            <div class="register_input_area">
                <span class="register_input_area_title">title</span>
                <input id="input_register_artist_title" class="register_input_area_input form-control" type="text" placeholder="title" v-model="inputArtistTitle" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">title_en</span>
                <input id="input_register_artist_title_en" class="register_input_area_input form-control" type="text" placeholder="title_en" v-model="inputArtistSubTitle" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">debut</span>
                <input id="input_register_artist_debut" class="register_input_area_input form-control" type="text" placeholder="debut" v-model="inputArtistDebut" />
            </div>
            <div class="register_input_area">
                <span class="register_input_area_title">type</span>
                <input id="input_register_artist_type" class="register_input_area_input form-control" type="number" placeholder="type" v-model="inputArtistType" />

                <div id="register_artist_button" class="register_button" @click="insertArtist">Register</div>
            </div>

            <p id="inserted_artist_id_title">Inserted Artist ID : <span id="inserted_artist_id">{{ resultArtistId }}</span></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'AdminIndex',
        data: function () {
            return {
                inputArtistId: '',
                inputVideoId: '',
                inputVideoName: '',
                inputVideoType: '',
                inputVideoRelease: '',
                inputLyricsVideoId: '',
                inputLyrics: '',
                inputArtistTitle: '',
                inputArtistSubTitle: '',
                inputArtistDebut: '',
                inputArtistType: '',
                resultArtistId: '',
                collaborationArtists: []
            }
        },
        methods: {
            insertMusic: function () {
                if( this.inputArtistId === '' ) {
                    alert('Please insert artist');
                    return;
                }
                if( this.inputVideoId === '' ) {
                    alert('Please insert video');
                    return;
                }
                if( this.inputVideoName === '' ) {
                    alert('Please insert title');
                    return;
                }
                if( this.inputVideoType === '' ) {
                    alert('Please insert type');
                    return;
                }
                if( this.inputVideoRelease === '' ) {
                    alert('Please insert release');
                    return;
                }

                let singer = [];
                this.collaborationArtists.forEach(artist => {
                    if( artist.title === '' ) {
                        alert('Please insert artist title');
                        return;
                    }

                    const object = {
                        _id: artist.id,
                        title: artist.title,
                        title_en: artist.subtitle
                    };
                    singer.push(object);
                });

                axios.post(this.$store.getters.serverUrl + 'api/admin/insert_music', {
                    artist: this.inputArtistId,
                    video: this.inputVideoId,
                    title: this.inputVideoName,
                    type: this.inputVideoType,
                    release: this.inputVideoRelease,
                    singer: singer
                }).then((response) => {
                    console.log(response);

                    this.inputVideoId = '';
                    this.inputVideoName = '';
                    this.inputVideoType = '';
                    this.inputVideoRelease = '';
                    this.collaborationArtists = [];
                }).catch((error) => {
                    console.log(error);
                });
            },
            insertLyrics: function () {
                if( this.inputLyricsVideoId === '' ) {
                    alert('Please insert video');
                    return;
                }
                if( this.inputLyrics === '' ) {
                    alert('Please insert lyrics');
                    return;
                }

                axios.post(this.$store.getters.serverUrl + 'api/admin/insert_lyrics', {
                    name: this.inputLyricsVideoId,
                    contents: this.inputLyrics
                }).then((response) => {
                    console.log(response);

                    this.inputLyricsVideoId = '';
                    this.inputLyrics = this.inputLyrics.split('-')[0] + '- ';
                }).catch((error) => {
                    console.log(error);
                });
            },
            insertArtist: function () {
                if( this.inputArtistTitle === '' ) {
                    alert('Please insert artist title');
                    return;
                }
                if( this.inputArtistSubTitle === '' ) {
                    alert('Please insert artist subtitle');
                    return;
                }
                if( this.inputArtistDebut === '' ) {
                    alert('Please insert artist debut');
                    return;
                }
                if( this.inputArtistType === '' ) {
                    alert('Please insert artist type');
                    return;
                }

                axios.post(this.$store.getters.serverUrl + 'api/admin/insert_artist', {
                    title: this.inputArtistTitle,
                    title_en: this.inputArtistSubTitle,
                    debut: this.inputArtistDebut,
                    type: this.inputArtistType
                }).then((response) => {
                    console.log(response);

                    this.inputArtistTitle = '';
                    this.inputArtistSubTitle = '';
                    this.inputArtistDebut = '';
                    this.inputArtistType = '';

                    this.resultArtistId = response.data.result.id;
                }).catch((error) => {
                    console.log(error);
                });
            },
            addCollaborationArtist: function () {
                this.collaborationArtists.push({
                    id: '',
                    title: '',
                    subtitle: ''
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .admin_template { background: linear-gradient(270deg, #3a2a4e, #6b4d71, #f361a6); background-size: 600% 600%; -webkit-animation: bgAnimation 30s ease infinite; -moz-animation: bgAnimation 40s ease infinite; animation: bgAnimation 30s ease infinite; background: #6b4d71; }

    .register_area { width: 85%; margin: 0 auto; padding-bottom: 30px; }
    .register_area#register_artist_area, .register_area#register_lyrics_area { border-top: 1px solid #FFF; }

    .register_area_title { padding-top: 60px; margin-bottom: 20px; line-height: 30px; font-weight: 400; letter-spacing: 0.8px; font-size: 26pt; color: #FFFFFF; }
    .register_input_area { margin-bottom: 10px; }
    .register_input_area_title { width: 60px; display: inline-block; line-height: 36px; height: 36px; font-weight: 300; letter-spacing: 0.8px; font-size: 16pt; color: #FFFFFF; margin-right: 10px; vertical-align: top; }
    .register_input_area_input { width: 400px; height: 36px; padding: 10px; font-size: 16pt; display: inline-block; letter-spacing: 0.5px; }
    .register_button { width: 150px; margin-left: 1%; color: rgba(255, 255, 255, 0.9) !important; background: #F361A6 !important; letter-spacing: 1px; padding: 10px 0; cursor: pointer; font-size: 14pt; line-height: 1.2; border-radius: 4px; border: 1px solid transparent; white-space: nowrap; display: inline-block; margin-bottom: 0; font-weight: normal; text-align: center; vertical-align: middle; touch-action: manipulation; }

    #add_artist_button { width: 150px; margin-top: 25px; color: rgba(255, 255, 255, 0.9) !important; background: #F361A6 !important; letter-spacing: 1px; padding: 10px 0; cursor: pointer; font-size: 14pt; line-height: 1.2; border-radius: 4px; border: 1px solid transparent; white-space: nowrap; display: block; margin-bottom: 0; font-weight: normal; text-align: center; vertical-align: middle; touch-action: manipulation; margin-bottom: 30px; }

    .collaboration_artist_wrap { margin-top: 30px; }
    .collaboration_artist_warp_title { margin-top: 0; margin-bottom: 10px; line-height: 30px; font-weight: 300; letter-spacing: 0.8px; font-size: 20pt; color: #FFFFFF; }
    .collaboration_artist_wrap > div { margin-bottom: 10px; }
    .collaboration_artist_wrap > div > span { width: 60px; display: inline-block; line-height: 36px; height: 36px; font-weight: 300; letter-spacing: 0.8px; font-size: 16pt; color: #FFFFFF; margin-right: 10px; }
    .collaboration_artist_wrap > div > input { width: 400px; height: 36px; padding: 10px; font-size: 16pt; display: inline-block; letter-spacing: 0.5px; }

    #inserted_artist_id_title { font-weight: 300; letter-spacing: 0.8px; font-size: 16pt; color: #FFFFFF; margin-top: 20px; }
    #inserted_artist_id { font-weight: 400; }
</style>
