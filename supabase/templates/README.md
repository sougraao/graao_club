# E-mails de autenticação do graao club

Modelos em português no visual do design system (faixa grafite, marca, botão Broto, aviso de segurança).
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

> **Pré-requisito:** o Supabase só permite editar assunto e corpo dos modelos **depois de configurar SMTP próprio** (Authentication → Emails → SMTP Settings). Com o envio padrão os campos ficam travados ("Set up custom SMTP to edit templates") — verificado em 2026-11-09 no `graao-club-dev`. Veja a seção "Remetente" abaixo.

1. Supabase → **Authentication → Emails → Templates**.
2. Para cada modelo da tabela: cole o **assunto** e o conteúdo do arquivo `.html` correspondente → **Save**.
3. Mande um teste (ex.: "Esqueci minha senha" em `entrar.html`) e confira no Gmail e no celular.

As variáveis `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .Email }}`, `{{ .NewEmail }}` e `{{ .Data.name }}` são preenchidas pelo Supabase.

## Remetente ("De:")

Com o envio padrão do Supabase o remetente é sempre **Supabase Auth &lt;noreply@mail.app.supabase.io&gt;**, há limite baixo de envios por hora e só chegam e-mails para membros da equipe do projeto.
Para enviar como **graao club &lt;nao-responda@graao.com&gt;** é preciso SMTP próprio:

1. Criar conta num serviço de envio (ex.: Resend, Amazon SES, Brevo) e **verificar o domínio** (registros SPF/DKIM no DNS).
2. Supabase → **Authentication → Emails → SMTP Settings** → ativar *Custom SMTP* com host, porta, usuário e senha do serviço; *Sender name* = `graao club`; *Sender email* = `nao-responda@graao.com`.
3. Ajustar o limite de envios em **Authentication → Rate Limits**.

A senha do SMTP fica só no painel do Supabase — nunca no repositório.

## Logo

E-mail não exibe SVG (Gmail/Outlook). Por enquanto a marca é feita com texto e um quadrado Broto. Quando o site estiver no domínio final (Vercel), troque por um PNG hospedado (`assets/img/graao-mark@2x.png`, 68×68) no `_build.py`.
