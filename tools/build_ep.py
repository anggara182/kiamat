import json, sys
def build(E, meta, SH):
    shots=[]
    for (i,st,own,light,vo,fr,cam,hero,notes,sync) in SH:
        shots.append({'id':i,'start':0,'end':0,'act':1,'set':st,'owner':own,'framing':fr,'camera':cam,'vo_markup':vo,'vo':vo.replace('*',''),'voKind':'narration' if vo else 'none','speaker':'narr','words':[],'trans':'cut','caption':bool(vo),'light':light,'hero':hero,'notes':notes,'sync':sync})
    ep=dict(meta); ep.update({'fps':24,'width':1080,'height':1920,'durationSec':0,'accent':'#d9a441','audio':True,'shots':shots})
    json.dump(ep,open(f'{E}/src/data/episode-draft.json','w'),ensure_ascii=False,indent=1)
    RATE=2.9*1.10; t=0.0
    for s in ep['shots']:
        toks=s['vo_markup'].split()
        if not toks: s['start']=round(t,3); s['end']=round(t+4.2,3); t+=4.2; continue
        dur=max(1.5,len(toks)/RATE+0.35); a=t+0.1; b=t+dur-0.15; tot=sum(len(x) for x in toks); c=a; ws=[]
        for x in toks:
            d=(b-a)*len(x)/tot; ws.append({'text':x.replace('*',''),'highlight':x.startswith('*'),'start':round(c,3),'end':round(c+d,3)}); c+=d
        s['words']=ws; s['start']=round(t,3); s['end']=round(t+dur,3); t+=dur
    ep['durationSec']=round(t,3); ep['timingSource']='ESTIMATE (VO pending)'
    json.dump(ep,open(f'{E}/src/data/episode.json','w'),ensure_ascii=False,indent=1)
    own={s['id']:s['owner'] for s in ep['shots']}
    m=', '.join(f'{i}: {o}' for i,o in own.items())
    mods=sorted(set(own.values()))
    imp=''.join(f"import * as {o} from './{o}';\n" for o in mods)
    open(f'{E}/src/shots/index.ts','w').write(f"""import React from 'react';
import {{ AbsoluteFill }} from 'remotion';
{imp}
const Todo: React.FC = () => React.createElement(AbsoluteFill, {{ style: {{ backgroundColor: '#1a1a1f' }} }});
const pick = (m: Record<string, unknown>, name: string) => ((m[name] as React.FC) ?? Todo);

/** shot id -> owner module (episode.json "owner"). */
const OWNER: Record<number, Record<string, unknown>> = {{
  {m},
}};

export const SCENES: Record<number, React.FC> = Object.fromEntries(
  Object.entries(OWNER).map(([id, mod]) => [Number(id), pick(mod, `S${{String(id).padStart(2, '0')}}`)]),
);
""")
    print(E, len(' '.join(s['vo'] for s in shots if s['vo']).split()),'words, est',round(t,1),'s, owners',mods)
