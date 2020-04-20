<template>
    <ins class="adsbygoogle" :style="styles" :data-ad-client="clientNo" :data-ad-slot="slotNo" />
</template>

<script>
    export default {
        name: 'Adsense',
        props: {
            clientNo: String,
            slotNo: String,
            styles: String
        },
        data: function () {
            return {
                //
            }
        },
        mounted () {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>


