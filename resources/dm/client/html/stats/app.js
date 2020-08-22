Vue.config.devtools = true;
Vue.prototype.window = window;

if('alt' in window){
    alt.on('stats:Refresh:Vue',(k,d)=>{
        app.readyStats(k,d);
    });
}


const app = new Vue({
    el: '#app',
    data:{
        kills: 0,
        deaths: 0,
    },
    computed: {
        KD : function () {
            if(this.deaths < 1) return (this.kills / 1).toFixed(2);
            return (this.kills / this.deaths).toFixed(2);
        }
    },
    methods:{
        readyStats(k,d){
            this.kills = k;
            this.deaths = d;
        }
    }
    ,
    mounted(){
        if('alt' in window){
            alt.on('load',this.readyStats);
            alt.emit('load');
        }
    }
})
