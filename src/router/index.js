import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../components/pages/Main.vue'
import LatestMusic from '../components/pages/LatestMusic.vue'
import ArtistList from '../components/pages/ArtistList.vue'
import Artist from '../components/pages/Artist.vue'
import Music from '../components/pages/Music.vue'
import Profile from '../components/pages/Profile.vue'
import Theme from '../components/pages/Theme.vue'
import Admin from '../components/pages/Admin.vue'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Main },
        { path: '/latest_music', component: LatestMusic },
        { path: '/artist_list', component: ArtistList },
        { path: '/artist/:artistId', component: Artist, props: true },
        { path: '/music/:videoId', component: Music, props: true },
        { path: '/profile/:userId', component: Profile, props: true },
        { path: '/theme', component: Theme },
        { path: '/admin', component: Admin },
    ]
});

export default router;