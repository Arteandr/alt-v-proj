Vue.config.devtools = true;
Vue.prototype.window = window;

if('alt' in window){
    alt.on('edit',ONLINE=>{
        app.setOnline(ONLINE);
    })
}


const app = new Vue({
    el: '#app',
    data(){
        return{
            locations: [],
            ready: false,
            online: [],
            current: null
        }
    },
    methods: {
        loadLoc(loc,currentLoc){
            this.locations = loc
            this.current = currentLoc;
        },
        onSubmit(id){
            alt.emit('location:Enter',id)
        },
        getWeaponURL(weaponName){
            switch (weaponName) {
                case 'unarmed': 
                return '../weapons/Fist-icon.webp'
                case 'knife':
                    return '../weapons/Knife-icon.webp'
                case 'nightstick':
                    return '../weapons/Nightstick-icon.webp'
                case 'hammer':
                    return '../weapons/Hammer-icon.webp'
                case 'bat':
                    return '../weapons/Baseball-bat-icon.webp'
                case 'crowbar':
                    return '../weapons/Crowbar-icon.webp'
                case 'golfclub':
                    return '../weapons/Golf-club-icon.webp'
                case 'bottle':
                    return '../weapons/Broken-bottle-icon.webp'
                case 'dagger':
                    return '../weapons/Antique-cavalry-dagger-icon.webp'
                case 'hatchet':
                    return '../weapons/Hatchet-icon.webp'
                case 'knuckleduster':
                    return '../weapons/Knuckles-icon.webp'
                case 'machete':
                    return '../weapons/Machete-icon.png'
                case 'flashlight':
                    return '../weapons/Flashlight-icon.webp'
                case 'switchblade':
                    return '../weapons/Switch-blade-icon.webp'
                case 'poolcue':
                    return '../weapons/Pool-cue-icon.webp'
                case 'wrench':
                    return '../weapons/Pipe-wrench-icon.webp'
                case 'battleaxe':
                    return '../weapons/Battle-axe-icon.webp'
                case 'pistol':
                    return '../weapons/Pistol-icon.webp'
                case 'pistolmk2':
                    return '../weapons/Pistol-mk2-icon.webp'
                case 'combatpistol':
                    return '../weapons/Combat-pistol-icon.webp'
                case 'pistol50':
                    return '../weapons/Pistol.webp'
                case 'snspistol':
                    return '../weapons/Sns-pistol-icon.webp'
                case 'heavypistol':
                    return '../weapons/Heavy-pistol-icon.webp'
                case 'vintagepistol':
                    return '../weapons/Vintage-pistol-icon.webp'
                case 'marksmanpistol':
                    return '../weapons/Marksman-pistol-icon.webp'
                case 'revolver':
                    return '../weapons/Heavy-revolver-icon.webp'
                case 'appistol':
                    return '../weapons/Appistol-icon.webp'
                case 'stungun':
                    return '../weapons/Stungun-icon.webp'
                case 'flaregun':
                    return '../weapons/Flaregun-icon.webp'
                case 'microsmg':
                    return '../weapons/Micro-smg-icon.webp'
                case 'machinepistol':
                    return '../weapons/Machine-pistol-icon.webp'
                case 'smg':
                    return '../weapons/Smg-icon.webp'
                case 'smgmk2':
                    return '../weapons/Smg-mk2-icon.webp'
                case 'assaultsmg':
                    return '../weapons/Assault-smg-icon.webp'
                case 'combatpdw':
                    return '../weapons/Combat-pdw-icon.webp'
                case 'mg':
                    return '../weapons/Mg-icon.png'
                case 'combatmg':
                    return '../weapons/Combat-mg-icon.webp'
                case 'combatmgmk2':
                    return '../weapons/Combat-mg-mk2-icon.png'
                case 'gusenberg':
                    return '../weapons/Gusenberg-sweeper-icon.png'
                case 'minismg':
                    return '../weapons/Mini-smg-icon.webp'
                case 'assaultrifle':  
                    return '../weapons/Assault-rifle-icon.png'
                case 'assaultriflemk2':
                    return '../weapons/Assault-rifle-mk2-icon.png'
                case 'carbinerifle':
                    return '../weapons/Carbine-rifle-icon.png'
                case 'carbineriflemk2':
                    return '../weapons/Carbine-rifle-mk2-icon.webp'
                case 'advancedrifle':
                    return '../weapons/Advanced-rifle-icon.webp'
                case 'specialcarbine':
                    return '../weapons/Special-carbine-icon.webp'
                case 'bullpuprifle':
                    return '../weapons/Bullpup-rifle-icon.webp'
                case 'compactrifle':
                    return '../weapons/Compact-rifle-icon.webp'
                case 'sniperrifle':
                    return '../weapons/Sniper-rifle-icon.png'
                case 'heavysniper':
                    return '../weapons/Heavy-sniper-icon.png'
                case 'heavysnipermk2':
                    return '../weapons/Heavy-sniper-mk2-icon.png'
                case 'marksmanrifle':
                    return '../weapons/Marksman-rifle-icon.png'
                case 'pumpshotgun':
                    return '../weapons/Pump-shotgun-icon.webp'
                case 'sawnoffshotgun':
                    return '../weapons/Sawed-off-shotgun-icon.webp'
                case 'bullpupshotgun':
                    return '../weapons/Bullpup-shotgun-icon.webp'
                case 'assaultshotgun':
                    return '../weapons/Assault-shotgun-icon.webp'
                case 'mukset':
                    return '../weapons/Musket-icon.webp'
                case 'heavyshotgun':
                    return '../weapons/Heavy-shotgun-icon.webp'
                case 'doublebarrelshotgun':  
                    return '../weapons/Double-barrel-shotgun-icon.webp'
                case 'autoshotgun':
                    return '../weapons/Sweeper-shotgun-icon.webp'
                case 'grenadelauncher':
                    return '../weapons/Grenade-launcher-icon.png'
                case 'rpg':  
                    return '../weapons/Rocket-launcher-icon.png'
                case 'minigun':  
                    return '../weapons/Minigun-icon.png'
                case 'firework':
                    return '../weapons/Firework-launcher-icon.png'
                case 'railgun':
                    return '../weapons/Railgun-icon.png'
                case 'hominglauncher':
                    return '../weapons/Homing-launcher-icon.png'
                case 'grenadelaunchersmoke':
                    return '../weapons/Grenade-launcher-icon.png'
                case 'compactlauncher':
                    return '../weapons/Grenade-compact-launcher-icon.webp'
                case 'grenade':
                    return '../weapons/Grenade-icon.webp'
                case 'stickybomb':
                    return '../weapons/Sticky-bomb-icon.png'
                case 'proximitymine':  
                    return '../weapons/Proximity-mines-icon.webp'
                case 'bzgas':
                    return '../weapons/Bz-gas-icon.webp'
                case 'molotov':  
                    return '../weapons/Molotov-icon.webp'
                case 'flare':
                    return '../weapons/Flare-icon.webp'
                case 'ball':
                    return '../weapons/Ball-icon.webp'
                case 'snowball':
                    return '../weapons/Snowball-icon.webp'
                case 'smokegrenade':
                    return '../weapons/Tear-gas-icon.webp'
                case 'pipebomb':  
                    return '../weapons/Pipe-bomb-icon.webp'
                default:
                    break;
            }
        },
        getLocID(id){
            return id + 1;
        },
        setOnline(ONLINE){
            this.online = ONLINE
        },
        lobbyEmit(){
            alt.emit('lobby:Join:Vue')
        }
    },
    mounted(){
        if('alt' in window){
            alt.on('location:Ready',this.loadLoc);
            alt.emit('location:Ready');
        }
    }
})
