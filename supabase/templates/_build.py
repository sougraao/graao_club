"""
IA para TDAH · gerador dos e-mails de autenticação do Supabase.

Gera um HTML por modelo em supabase/templates/ a partir de um layout único, para que
todos os e-mails sigam o design system (DESIGN_SYSTEM.md → "E-mails transacionais").
E-mail não aceita variáveis CSS nem SVG: as cores dos tokens vão escritas direto, em layout de tabela.

Uso:   python supabase/templates/_build.py            → gera os .html
       python supabase/templates/_build.py --preview  → também gera prévias com dados de exemplo em _preview/
"""
import os, sys, html

HERE = os.path.dirname(os.path.abspath(__file__))

# Tokens do design system (Safra) em valores fixos para e-mail
INK_950 = "#0b0d10"   # --g-ink-950  (fundo da faixa, texto principal)
INK_800 = "#1c2127"
TEXT_2 = "#5c636d"    # --g-text-2 (Dia)
TEXT_3 = "#7d848e"    # --g-text-3 (Dia)
MIST_50 = "#f6f6f8"   # --g-mist-50
MIST_100 = "#eeeef2"  # --g-mist-100 (fundo)
LINE = "#e2e2e8"      # --g-mist-200
BROTO = "#c5f82a"     # --g-broto-500 (acento)
BROTO_TEXT = "#4d6b00"  # --g-broto-800 (acento como texto no Dia)
FONT = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

TEMPLATES = [
    {
        "file": "confirmacao.html", "slot": "Confirm signup",
        "subject": "Confirme seu e-mail · IA para TDAH",
        "preheader": "Falta um passo para começar.",
        "eyebrow": "Boas-vindas",
        "title": "Confirme seu e-mail{{ if .Data.name }}, {{ .Data.name }}{{ end }}",
        "body": "Você está a um toque de entrar no IA para TDAH. Confirme este endereço para ativar sua conta e começar pela trilha <b>Comece Aqui</b>.",
        "cta": "Confirmar meu e-mail", "url": "{{ .ConfirmationURL }}",
        "note": "Se você não criou uma conta no IA para TDAH, ignore esta mensagem — nada vai acontecer.",
    },
    {
        "file": "convite.html", "slot": "Invite user",
        "subject": "Você foi convidado para o IA para TDAH",
        "preheader": "Um lugar para aprender, compartilhar e crescer com quem vive tecnologia.",
        "eyebrow": "Convite",
        "title": "Seu lugar está reservado",
        "body": "Alguém da equipe do IA para TDAH convidou você para entrar. Aceite o convite para criar sua senha e acessar a plataforma.",
        "cta": "Aceitar convite", "url": "{{ .ConfirmationURL }}",
        "note": "Não esperava este convite? Pode ignorar este e-mail com tranquilidade.",
    },
    {
        "file": "link-magico.html", "slot": "Magic Link",
        "subject": "Seu link de acesso ao IA para TDAH",
        "preheader": "Entre sem senha com um toque.",
        "eyebrow": "Acesso rápido",
        "title": "Entre no IA para TDAH",
        "body": "Use o botão abaixo para entrar na sua conta sem digitar senha. O link funciona uma única vez.",
        "cta": "Entrar agora", "url": "{{ .ConfirmationURL }}",
        "note": "Se não foi você que pediu este acesso, ignore este e-mail. Sua conta continua protegida.",
    },
    {
        "file": "troca-de-email.html", "slot": "Change Email Address",
        "subject": "Confirme seu novo e-mail · IA para TDAH",
        "preheader": "Confirme a troca do e-mail da sua conta.",
        "eyebrow": "Segurança da conta",
        "title": "Confirme seu novo e-mail",
        "body": "Recebemos um pedido para trocar o e-mail da sua conta de <b>{{ .Email }}</b> para <b>{{ .NewEmail }}</b>. Confirme para concluir a troca.",
        "cta": "Confirmar novo e-mail", "url": "{{ .ConfirmationURL }}",
        "note": "Se você não pediu essa troca, não confirme e fale com a gente em contato@graao.com.",
    },
    {
        "file": "redefinir-senha.html", "slot": "Reset Password",
        "subject": "Redefinir sua senha do IA para TDAH",
        "preheader": "Crie uma nova senha para voltar aos seus projetos.",
        "eyebrow": "Segurança da conta",
        "title": "Vamos criar uma nova senha",
        "body": "Recebemos um pedido para redefinir a senha da sua conta. Toque no botão abaixo e escolha uma nova senha.",
        "cta": "Criar nova senha", "url": "{{ .ConfirmationURL }}",
        "note": "Se você não pediu para trocar a senha, ignore este e-mail — sua senha atual continua valendo.",
    },
    {
        "file": "reautenticacao.html", "slot": "Reauthentication",
        "subject": "Seu código de verificação · IA para TDAH",
        "preheader": "Use este código para confirmar que é você.",
        "eyebrow": "Verificação",
        "title": "Confirme que é você",
        "body": "Use o código abaixo para concluir a ação sensível que você começou no IA para TDAH.",
        "code": "{{ .Token }}",
        "note": "Nunca compartilhe este código. A equipe do IA para TDAH jamais vai pedi-lo.",
    },
]


def button(label, url):
    return f"""<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:28px 0 8px">
                <tr><td align="center" bgcolor="{BROTO}" style="border-radius:999px">
                  <a href="{url}" target="_blank" style="display:inline-block;padding:15px 28px;font-family:{FONT};font-size:15px;font-weight:600;line-height:1;color:{INK_950};text-decoration:none;border-radius:999px">{label}&nbsp;&rarr;</a>
                </td></tr></table>
              <p style="margin:18px 0 0;font-family:{FONT};font-size:12.5px;line-height:1.6;color:{TEXT_3}">O botão não funcionou? Copie e cole este endereço no navegador:<br>
                <a href="{url}" style="color:{BROTO_TEXT};word-break:break-all">{url}</a></p>"""


def code_box(code):
    return f"""<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:26px 0 6px">
                <tr><td style="background:{INK_950};border-radius:18px;padding:18px 26px">
                  <span style="font-family:{MONO};font-size:30px;font-weight:600;letter-spacing:8px;color:{BROTO}">{code}</span>
                </td></tr></table>"""


def render(t):
    action = code_box(t["code"]) if t.get("code") else button(t["cta"], t["url"])
    return f"""<!doctype html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>{html.escape(t["subject"])}</title>
  <!-- Assunto sugerido: {t["subject"]} · Modelo Supabase: {t["slot"]} -->
</head>
<body style="margin:0;padding:0;background:{MIST_100};-webkit-text-size-adjust:100%">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">{t["preheader"]}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="{MIST_100}" style="background:{MIST_100}">
    <tr><td align="center" style="padding:32px 14px">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px">

        <!-- Faixa da marca -->
        <tr><td style="background:{INK_950};border-radius:28px 28px 0 0;padding:26px 32px">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0"><tr>
            <td width="34" height="34" align="center" valign="middle" bgcolor="{BROTO}" style="width:34px;height:34px;border-radius:11px;font-family:{FONT};font-size:17px;font-weight:800;color:{INK_950};line-height:34px">g</td>
            <td style="padding-left:11px;font-family:{FONT};font-size:20px;letter-spacing:-0.6px;line-height:1">
              <b style="color:#ffffff">graao</b><span style="color:{TEXT_3}">club</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Conteúdo -->
        <tr><td style="background:#ffffff;padding:36px 32px 32px;border-left:1px solid {LINE};border-right:1px solid {LINE}">
          <p style="margin:0 0 14px;font-family:{MONO};font-size:11px;font-weight:500;letter-spacing:1.6px;text-transform:uppercase;color:{BROTO_TEXT}">{t["eyebrow"]}</p>
          <h1 style="margin:0;font-family:{FONT};font-size:28px;line-height:1.15;font-weight:600;letter-spacing:-0.9px;color:{INK_950}">{t["title"]}</h1>
          <p style="margin:16px 0 0;font-family:{FONT};font-size:15.5px;line-height:1.65;color:{TEXT_2}">{t["body"]}</p>
          {action}
        </td></tr>

        <!-- Aviso de segurança -->
        <tr><td style="background:{MIST_50};padding:18px 32px;border:1px solid {LINE};border-top:0;border-radius:0 0 28px 28px">
          <p style="margin:0;font-family:{FONT};font-size:12.5px;line-height:1.6;color:{TEXT_3}">{t["note"]}</p>
        </td></tr>

        <!-- Rodapé -->
        <tr><td align="center" style="padding:26px 12px 6px">
          <p style="margin:0;font-family:{FONT};font-size:12px;line-height:1.7;color:{TEXT_3}">
            <b style="color:{INK_800}">Sua mente cria. Seu sistema entrega.</b><br>
            IA para TDAH · Da ideia à entrega.<br>
            Dúvidas? <a href="mailto:contato@graao.com" style="color:{BROTO_TEXT}">contato@graao.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""


SAMPLE = {
    "{{ .ConfirmationURL }}": "https://luhjaekwowmzdzwukgdx.supabase.co/auth/v1/verify?token=exemplo&type=signup&redirect_to=http://localhost:5173/inicio.html",
    "{{ if .Data.name }}, {{ .Data.name }}{{ end }}": ", Luiz",
    "{{ .Email }}": "antigo@exemplo.com", "{{ .NewEmail }}": "novo@exemplo.com", "{{ .Token }}": "482913",
}

if __name__ == "__main__":
    preview = "--preview" in sys.argv
    pdir = os.path.join(HERE, "_preview")
    if preview:
        os.makedirs(pdir, exist_ok=True)
    for t in TEMPLATES:
        out = render(t)
        with open(os.path.join(HERE, t["file"]), "w", encoding="utf-8") as f:
            f.write(out)
        if preview:
            p = out
            for k, v in SAMPLE.items():
                p = p.replace(k, v)
            with open(os.path.join(pdir, t["file"]), "w", encoding="utf-8") as f:
                f.write(p)
        print(f'{t["slot"]:<22} -> {t["file"]:<22} assunto: {t["subject"]}'.encode("ascii", "replace").decode())
