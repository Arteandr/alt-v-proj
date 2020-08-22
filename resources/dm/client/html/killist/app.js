Vue.config.devtools = true;
Vue.prototype.window = window;

if ('alt' in window){
    alt.on('killList:AddKillView',data=>{
        app.addKill(data);
    })
    alt.on('killList:Turn',()=>{
        app.killListShow()
    })
}


const app = new Vue({
    el: "#app",
    data(){
        return {
            lastFive: [],
            show: true
        }
    },
    methods: {
        imgUrl(hash) {
            switch (hash) {
                case 2725352035: 
                    return '../weapons/Fist-icon.webp'
                case 2578778090:
                    return '../weapons/Knife-icon.webp'
                case 1737195953:
                    return '../weapons/Nightstick-icon.webp'
                case 1317494643:
                    return '../weapons/Hammer-icon.webp'
                case 2508868239:
                    return '../weapons/Baseball-bat-icon.webp'
                case 2227010557:
                    return '../weapons/Crowbar-icon.webp'
                case 1141786504:
                    return '../weapons/Golf-club-icon.webp'
                case 4192643659:
                    return '../weapons/Broken-bottle-icon.webp'
                case 2460120199:
                    return '../weapons/Antique-cavalry-dagger-icon.webp'
                case 4191993645:
                    return '../weapons/Hatchet-icon.webp'
                case 3638508604:
                    return '../weapons/Knuckles-icon.webp'
                case 3713923289:
                    return '../weapons/Machete-icon.png'
                case 2343591895:
                    return '../weapons/Flashlight-icon.webp'
                case 3756226112:
                    return '../weapons/Switch-blade-icon.webp'
                case 2484171525:
                    return '../weapons/Pool-cue-icon.webp'
                case 419712736:
                    return '../weapons/Pipe-wrench-icon.webp'
                case 3441901897:
                    return '../weapons/Battle-axe-icon.webp'
                case 453432689:
                    return '../weapons/Pistol-icon.webp'
                case 3219281620:
                    return '../weapons/Pistol-mk2-icon.webp'
                case 1593441988:
                    return '../weapons/Combat-pistol-icon.webp'
                case 2578377531:
                    return '../weapons/Pistol.webp'
                case 3218215474:
                    return '../weapons/Sns-pistol-icon.webp'
                case 3523564046:
                    return '../weapons/Heavy-pistol-icon.webp'
                case 137902532:
                    return '../weapons/Vintage-pistol-icon.webp'
                case 3696079510:
                    return '../weapons/Marksman-pistol-icon.webp'
                case 3249783761:
                    return '../weapons/Heavy-revolver-icon.webp'
                case 584646201:
                    return '../weapons/Appistol-icon.webp'
                case 911657153:
                    return '../weapons/Stungun-icon.webp'
                case 1198879012:
                    return '../weapons/Flaregun-icon.webp'
                case 324215364:
                    return '../weapons/Micro-smg-icon.webp'
                case 3675956304:
                    return '../weapons/Machine-pistol-icon.webp'
                case 736523883:
                    return '../weapons/Smg-icon.webp'
                case 2024373456:
                    return '../weapons/Smg-mk2-icon.webp'
                case 4024951519:
                    return '../weapons/Assault-smg-icon.webp'
                case 171789620:
                    return '../weapons/Combat-pdw-icon.webp'
                case 2634544996:
                    return '../weapons/Mg-icon.png'
                case 2144741730:
                    return '../weapons/Combat-mg-icon.webp'
                case 3686625920:
                    return '../weapons/Combat-mg-mk2-icon.png'
                case 1627465347:
                    return '../weapons/Gusenberg-sweeper-icon.png'
                case 3173288789:
                    return '../weapons/Mini-smg-icon.webp'
                case 3220176749:  
                    return '../weapons/Assault-rifle-icon.png'
                case 961495388:
                    return '../weapons/Assault-rifle-mk2-icon.png'
                case 2210333304:
                    return '../weapons/Carbine-rifle-icon.png'
                case 4208062921:
                    return '../weapons/Carbine-rifle-mk2-icon.webp'
                case 2937143193:
                    return '../weapons/Advanced-rifle-icon.webp'
                case 3231910285:
                    return '../weapons/Special-carbine-icon.webp'
                case 2132975508:
                    return '../weapons/Bullpup-rifle-icon.webp'
                case 1649403952:
                    return '../weapons/Compact-rifle-icon.webp'
                case 100416529:
                    return '../weapons/Sniper-rifle-icon.png'
                case 205991906:
                    return '../weapons/Heavy-sniper-icon.png'
                case 177293209:
                    return '../weapons/Heavy-sniper-mk2-icon.png'
                case 3342088282:
                    return '../weapons/Marksman-rifle-icon.png'
                case 487013001:
                    return '../weapons/Pump-shotgun-icon.webp'
                case 2017895192:
                    return '../weapons/Sawed-off-shotgun-icon.webp'
                case 2640438543:
                    return '../weapons/Bullpup-shotgun-icon.webp'
                case 3800352039:
                    return '../weapons/Assault-shotgun-icon.webp'
                case 2828843422:
                    return '../weapons/Musket-icon.webp'
                case 984333226:
                    return '../weapons/Heavy-shotgun-icon.webp'
                case 4019527611:  
                    return '../weapons/Double-barrel-shotgun-icon.webp'
                case 317205821:
                    return '../weapons/Sweeper-shotgun-icon.webp'
                case 2726580491:
                    return '../weapons/Grenade-launcher-icon.png'
                case 2982836145:  
                    return '../weapons/Rocket-launcher-icon.png'
                case 1119849093:  
                    return '../weapons/Minigun-icon.png'
                case 2138347493:
                    return '../weapons/Firework-launcher-icon.png'
                case 1834241177:
                    return '../weapons/Railgun-icon.png'
                case 1672152130:
                    return '../weapons/Homing-launcher-icon.png'
                case 1305664598:
                    return '../weapons/Grenade-launcher-icon.png'
                case 125959754:
                    return '../weapons/Grenade-compact-launcher-icon.webp'
                case 2481070269:
                    return '../weapons/Grenade-icon.webp'
                case 741814745:
                    return '../weapons/Sticky-bomb-icon.png'
                case 2874559379:  
                    return '../weapons/Proximity-mines-icon.webp'
                case 2694266206:
                    return '../weapons/Bz-gas-icon.webp'
                case 615608432:  
                    return '../weapons/Molotov-icon.webp'
                case 1233104067:
                    return '../weapons/Flare-icon.webp'
                case 600439132:
                    return '../weapons/Ball-icon.webp'
                case 126349499:
                    return '../weapons/Snowball-icon.webp'
                case 4256991824:
                    return '../weapons/Tear-gas-icon.webp'
                case 3125143736:  
                    return '../weapons/Pipe-bomb-icon.webp'
                default:
                    return '../weapons/suicide.png'
            }
        },
        addKill(data){
            if(this.lastFive.length > 5){
                this.lastFive.shift();
                this.lastFive.push({
                    victim: data.victimName,
                    killer: data.killer,
                    hash: data.weaponHash
                })
            }else{
                this.lastFive.push({
                    victim: data.victimName,
                    killer: data.killer,
                    hash: data.weaponHash
                })
            }
        },
        killListShow(){
            this.show = !this.show
        }
    }
})