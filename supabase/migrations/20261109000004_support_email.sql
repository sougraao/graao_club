-- graao club · e-mail de suporte no domínio oficial (graao.com)
update public.settings
set value = jsonb_set(value, '{supportEmail}', '"contato@graao.com"')
where key = 'general';
