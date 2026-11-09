# E-mails de autenticação do graao club

Modelos em português no visual do design system (faixa grafite, marca, botão Limoncello, aviso de segurança).
Gerados por [`_build.py`](_build.py) a partir de um layout único — **edite o script, não os .html**, e rode:

```bash
python supabase/templates/_build.py --preview
```

`--preview` cria `_preview/` com dados de exemplo para abrir no navegador (fica fora do Git).

| Modelo no Supabase | Arquivo | Assunto |
|---|---|---|
| Confirm signup | `confirmacao.html` | Confirme seu e-mail · graao club |
| Invite user | `convite.html` | Você foi convidado para o graao club |
| Magic Link | `link-magico.html` | Seu link de acesso ao graao club |
| Change Email Address | `troca-de-email.html` | Confirme seu novo e-mail · graao club |
| Reset Password | `redefinir-senha.html` | Redefinir sua senha do graao club |
| Reauthentication | `reautenticacao.html` | Seu código de verificação · graao club |

## Como instalar (por projeto: dev e, depois, prod)

> **Pré-requisito:** o Supabase só permite editar assunto e corpo dos modelos **depois de configurar SMTP próprio** (Authentication → Emails → SMTP Settings). Com o envio padrão os campos ficam travados ("Set up custom SMTP to edit templates") — verificado em 2026-11-09 no `graao-club-dev`. Veja a seção "Remetente" abaixo. **No `graao-club-dev` já está feito** (Resend ligado pela integração oficial, modelos instalados em 2026-11-09); falta repetir no projeto de produção.

1. Supabase → **Authentication → Emails → Templates**.
2. Para cada modelo da tabela: cole o **assunto** e o conteúdo do arquivo `.html` correspondente → **Save**.
3. Mande um teste (ex.: "Esqueci minha senha" em `entrar.html`) e confira no Gmail e no celular.

As variáveis `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .Email }}`, `{{ .NewEmail }}` e `{{ .Data.name }}` são preenchidas pelo Supabase.

## Editar pelo painel (admin.html#/emails)

O painel tem a área **Sistema → E-mails** (permissão `settings.manage`, só Administrador): lista os 6 e-mails, edita assunto, texto de prévia, etiqueta, título, mensagem, botão e aviso, e mostra a prévia ao vivo (computador e celular) e como o e-mail aparece na caixa de entrada.

- Marcadores amigáveis viram variáveis do Supabase ao exportar: `{nome}` → `{{ .Data.name }}`, `{, nome}` → `{{ if .Data.name }}, {{ .Data.name }}{{ end }}`, `{email}` → `{{ .Email }}`, `{novo_email}` → `{{ .NewEmail }}`, `{link}` → `{{ .ConfirmationURL }}`, `{codigo}` → `{{ .Token }}`, `{site}` → `{{ .SiteURL }}`. `**texto**` vira negrito; todo o resto é escapado (sem HTML livre).
- **Copiar HTML** ou **Baixar .html** gera o mesmo layout deste script, pronto para colar no modelo do Supabase.
- Hoje os textos editados ficam no navegador (`localStorage["graao:db"].emails`), como o resto do painel. Os textos padrão estão em `assets/js/data.js` (`emails`) e precisam bater com `_build.py`; o layout e as cores do e-mail estão em `assets/js/admin.js` (`MAIL`, `mailHtml`) e espelham `render()` daqui. Mudou um, mude o outro.
- Próximo passo (fase 4, painel ligado ao banco): tabela `email_templates` + Edge Function `sync-auth-emails` que aplica assunto e HTML no Supabase pela Management API (`PATCH /v1/projects/{ref}/config/auth`, campos `mailer_subjects_*` e `mailer_templates_*_content`) com um token de acesso guardado só nos secrets das Edge Functions.

## Remetente ("De:")

Com o envio padrão do Supabase o remetente é sempre **Supabase Auth &lt;noreply@mail.app.supabase.io&gt;**, há limite baixo de envios por hora e só chegam e-mails para membros da equipe do projeto.
Para enviar como **graao club &lt;nao-responda@graao.com&gt;** é preciso SMTP próprio:

1. Criar conta num serviço de envio (ex.: Resend, Amazon SES, Brevo) e **verificar o domínio** (registros SPF/DKIM no DNS).
2. Supabase → **Authentication → Emails → SMTP Settings** → ativar *Custom SMTP* com host, porta, usuário e senha do serviço; *Sender name* = `graao club`; *Sender email* = `nao-responda@graao.com`.
3. Ajustar o limite de envios em **Authentication → Rate Limits**.

A senha do SMTP fica só no painel do Supabase — nunca no repositório.

## Logo

E-mail não exibe SVG (Gmail/Outlook). Por enquanto a marca é feita com texto e um quadrado Limoncello. Quando o site estiver no domínio final (Vercel), troque por um PNG hospedado (`assets/img/graao-mark@2x.png`, 68×68) no `_build.py`.
