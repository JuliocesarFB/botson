

const supabaseClientUrl = "https://ajlpafdkfhlesoldfdei.supabase.co";
const supabaseClientKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbHBhZmRrZmhsZXNvbGRmZGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTA1MzgsImV4cCI6MjA4NTk4NjUzOH0.bwa8vORalnMrZRB6qyxSRO52txFmCnVvKkf5Km0Gu9E";

const supabase = window.supabase.createClient(
  supabaseClientUrl,
  supabaseClientKey
);


document.getElementById("saveBtn").onclick = async () => {
  const id = document.getElementById("playerSelect").value;
  if (!id) return alert("Selecione um jogador");

  const stats = {
    id,
    kd: Number(kd.value),
    wr: Number(wr.value),
    games: Number(games.value),
    fk: Number(fk.value),
    presence: Number(presence.value),
    kast: Number(kast.value),
    hs: Number(hs.value),
    updated_at: new Date()
  };

  const { error } = await supabase
    .from("players")
    .upsert(stats);

  if (error) {
    console.error(error);
    alert("Erro ao salvar");
  } else {
    alert("Salvo no banco!");
  }
};
