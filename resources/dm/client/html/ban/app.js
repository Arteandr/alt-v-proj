Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data(){
        return{
            left: NaN,
            ban: []
        }
    },
    methods:{
        setInfo(l,b){
            this.left = l;
            this.ban = b;
        },
        getBanDate(){
            const date = new Date(this.ban.date);
            return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth()+1)).slice(-2) + '.' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        }
    },
    mounted(){
        alt.on('ban:Ready',this.setInfo);
        alt.emit('ban:Ready');
    }
})