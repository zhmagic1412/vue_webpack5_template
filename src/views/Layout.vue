<template>
    <div class="main-content">
        <Header></Header>
        Welcome!
        <div>
            {{store.state.login.username}}
        </div>
        <div>
            {{text}} 
        </div>
       <img :src="Images.LOGO" alt="">
    </div>
</template>
<script lang="ts">
import { Images } from "@/assets/images";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import {test} from '@/api/api'
import {useStore} from 'vuex'
import Header from "./Header";

export default defineComponent({
    components:{Header},
    setup() {
        const state = reactive({
            text:''
        })
        const store = useStore()
        onMounted(
            async()=>{
                const res  = await test()
                state.text = res.data.data
            
            }
        )
        return {
            ...toRefs(state),store,Images
        }
    }

})
</script>