/* graao club — ambiente.
   Valores PÚBLICOS por design (URL do projeto + chave anon/publishable). Nunca coloque aqui a
   service role, chaves do R2 ou do Asaas — essas ficam só nos secrets das Edge Functions.
   Deixe supabaseUrl vazio para rodar em modo demonstração (dados locais, sem backend).
   Projeto: graao-club (sougraao's Org, sa-east-1, ref mevtbwrfdttwulskaspb) desde 2026-11-11.
   O antigo graao-club-dev (luhjaekwowmzdzwukgdx) não é mais usado pelo site. */
window.GRAAO_ENV = {
  env: "prod",
  supabaseUrl: "https://mevtbwrfdttwulskaspb.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldnRid3JmZHR0d3Vsc2thc3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0MzgxOTksImV4cCI6MjExMDAxNDE5OX0.RwF60vErih8mJjvWKW2qOmVNw2biOfl7IPVV9vTKt6A",
  // Ative depois de configurar o provedor Google no Supabase (Authentication → Providers → Google).
  googleAuth: false,
};
