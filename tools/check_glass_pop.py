"""Smoke-check local references, theme contrast pairs and JavaScript syntax."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, subprocess

ROOT=Path(__file__).resolve().parents[1]
class References(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]; self.ids=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        for key in ('href','src'):
            if attrs.get(key): self.refs.append(attrs[key])

errors=[]
pages=list(ROOT.glob('*.html'))
for page in pages:
    parser=References(); parser.feed(page.read_text(encoding='utf-8'))
    for ref in parser.refs:
        url=urlsplit(ref)
        if url.scheme or url.netloc or not url.path: continue
        target=(page.parent/unquote(url.path)).resolve()
        if not target.exists():errors.append(f'{page.name}: missing {ref}')
    if page.name=='glass-pop.html' and len(parser.ids)!=len(set(parser.ids)):errors.append('Duplicate pilot IDs')

def luminance(color):
    rgb=[int(color.lstrip('#')[i:i+2],16)/255 for i in (0,2,4)]
    rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    return sum(a*b for a,b in zip(rgb,[.2126,.7152,.0722]))
def contrast(a,b):
    a,b=sorted([luminance(a),luminance(b)])
    return (b+.05)/(a+.05)

data=json.loads((ROOT/'assets/tokens/glass-pop.json').read_text(encoding='utf-8'))
ratios={}
for theme,values in data['themes'].items():
    values={k:v['$value'] for k,v in values.items()}
    for front,back in [('text','background'),('text-secondary','surface'),('text-muted','surface'),('on-accent','accent'),('accent-text','background'),('success','surface'),('warning','surface'),('danger','surface'),('info','surface')]:
        ratio=contrast(values[front],values[back]);ratios[f'{theme}/{front} on {back}']=round(ratio,2)
        if ratio<4.5:errors.append(f'Contrast below AA: {theme}/{front}: {ratio:.2f}')
for script in ['assets/js/glass-pop.js','assets/js/graao-ds.js']:
    result=subprocess.run(['node','--check',str(ROOT/script)],capture_output=True,text=True)
    if result.returncode:errors.append(result.stderr)
print(json.dumps({'pages':len(pages),'contrast':ratios,'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
