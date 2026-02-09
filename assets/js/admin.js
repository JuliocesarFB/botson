const SUPABASE_URL="https://ajlpafdkfhlesoldfdei.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbHBhZmRrZmhsZXNvbGRmZGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTA1MzgsImV4cCI6MjA4NTk4NjUzOH0.bwa8vORalnMrZRB6qyxSRO52txFmCnVvKkf5Km0Gu9E"
const supabaseClient=window.supabaseClient??window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)
window.supabaseClient=supabaseClient

const playersDiv=document.getElementById("players")
const addBtn=document.getElementById("addPlayer")
const saveBtn=document.getElementById("saveMatch")

let playersCache=[]

async function loadPlayers(){
const{data,error}=await supabaseClient.from("players").select("id,name").order("name")
if(error){alert("Erro ao carregar jogadores");console.error(error);return}
playersCache=data??[]
}

function createPlayerRow(){
const div=document.createElement("div")
div.className="player-row"
div.innerHTML=`
<select class="player">
<option value="">Jogador</option>
${playersCache.map(p=>`<option value="${p.id}">${p.name}</option>`).join("")}
</select>
<input class="kd" type="number" step="0.01" min="0" placeholder="KD">
<input class="hs" type="number" min="0" placeholder="HS">
<input class="fk" type="number" min="0" placeholder="FK">
`
return div
}

addBtn.addEventListener("click",async()=>{
if(!playersCache.length)await loadPlayers()
playersDiv.appendChild(createPlayerRow())
})

saveBtn.addEventListener("click",async()=>{
const map=document.getElementById("map").value.trim()
if(!map){alert("Informe o mapa");return}

const {data:match,error:matchError}=await supabaseClient
.from("matches")
.insert({map})
.select()
.single()

if(matchError){
alert("Erro ao salvar partida")
console.error(matchError)
return
}

const rows=[]

document.querySelectorAll(".player-row").forEach(row=>{
const player_id=row.querySelector(".player").value
const kd=row.querySelector(".kd").value
const hs=row.querySelector(".hs").value
const fk=row.querySelector(".fk").value
if(!player_id||!kd)return
rows.push({
match_id:match.id,
player_id:Number(player_id),
kd:Number(kd),
hs:Number(hs||0),
fk:Number(fk||0)
})
})

if(!rows.length){
alert("Adicione ao menos um jogador com KD")
return
}

const {error:statsError}=await supabaseClient
.from("match_players")
.insert(rows)

if(statsError){
alert("Erro ao salvar estatísticas")
console.error(statsError)
return
}

alert("Partida salva com sucesso ✅")
playersDiv.innerHTML=""
document.getElementById("map").value=""
})

document.addEventListener("DOMContentLoaded",loadPlayers)
