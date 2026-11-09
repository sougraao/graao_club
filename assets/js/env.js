/* graao club — ambiente.
   Valores PÚBLICOS por design (URL do projeto + chave anon/publishable). Nunca coloque aqui a
   service role, chaves do R2 ou do Asaas — essas ficam só nos secrets das Edge Functions.
   Deixe supabaseUrl vazio para rodar em modo demonstração (dados locais, sem backend). */
window.GRAAO_ENV = {
  env: "dev",
  supabaseUrl: "https://luhjaekwowmzdzwukgdx.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aGphZWt3b3dtemR6d3VrZ2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxODUwOTksImV4cCI6MjEwOTc2MTA5OX0.SMRymcIs1C6BjFh6QoiynwI6PMEAiGMHjDUwV2XOJrY",
  // Ative depois de configurar o provedor Google no Supabase (Authentication → Providers → Google).
  googleAuth: false,
};
