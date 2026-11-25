"""Draws the profile's static graphics into assets/ (masthead, timeline, stack, project flows). Run: python .github/profile/diagrams.py"""
import html, os
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets")
SANS="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
SERIF="Georgia,'Iowan Old Style','Times New Roman',serif"
MONO="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
STYLE=f"""<style>
.ink{{fill:#1f2328}} .soft{{fill:#59636e}} .faint{{fill:#818b98}} .acc{{fill:#0f766e}}
.rule{{stroke:#d1d9e0}} .box{{fill:#ffffff;stroke:#d1d9e0}} .hot{{fill:#f0fdfa;stroke:#0f766e}} .arrow{{stroke:#818b98;fill:none}} .tip{{fill:#818b98}}
.serif{{font-family:{SERIF}}} .sans{{font-family:{SANS}}} .mono{{font-family:{MONO}}}
@media (prefers-color-scheme: dark){{
.ink{{fill:#e6edf3}} .soft{{fill:#9198a1}} .faint{{fill:#6e7681}} .acc{{fill:#2dd4bf}}
.rule{{stroke:#3d444d}} .box{{fill:#0d1117;stroke:#3d444d}} .hot{{fill:#0b2a27;stroke:#2dd4bf}} .arrow{{stroke:#6e7681}} .tip{{fill:#6e7681}}}}
</style>"""
e=html.escape
def svg(w,h,label,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{e(label)}"><title>{e(label)}</title>{STYLE}{body}</svg>\n'
def text(x,y,s,cls,size,weight=400,anchor="start",ls=0):
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" letter-spacing="{ls}">{e(s)}</text>'

# masthead: name on the left, a notebook sketch of the loop I work on at the right
NOTE = "'Bradley Hand','Segoe Print','Comic Neue',cursive"
b=[text(0,24,"AI / ML ENGINEER",'acc mono',13,600,ls=2.6),
   text(0,78,"Sarbesh Kumar",'ink serif',46,400), text(0,128,"Tiwari",'ink serif',46,400),
   text(0,164,"LLM evaluation · AI systems · full-stack",'soft sans',17),
   text(0,190,"Gurugram, India",'faint sans',14),
   f'<line x1="470" y1="8" x2="470" y2="196" class="rule" stroke-width="1" stroke-dasharray="2 4"/>']
# the sketch: model -> output -> verifier, with a loop back through traces
def node(x,y,w,label,cls="box"):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="34" rx="7" class="{cls}" stroke-width="1.2"/>'
            + text(x+w/2,y+22,label,'ink sans',13,600,anchor="middle"))
b+= [node(510,40,92,"model"), node(660,40,92,"output"), node(780,104,92,"verifier","hot"), node(560,140,120,"traces + scores")]
b+= ['<path d="M602 57 L656 57" class="arrow" stroke-width="1.3"/><path d="M650 53 L657 57 L650 61Z" class="tip"/>',
     '<path d="M752 62 C 790 66, 822 80, 826 100" class="arrow" stroke-width="1.3"/><path d="M821 96 L826 103 L830 95Z" class="tip"/>',
     '<path d="M780 128 C 740 146, 712 154, 684 156" class="arrow" stroke-width="1.3"/><path d="M690 152 L683 156 L690 160Z" class="tip"/>',
     '<path d="M560 150 C 520 140, 512 108, 540 76" class="arrow" stroke-width="1.3" stroke-dasharray="4 3"/><path d="M535 79 L541 74 L543 82Z" class="tip"/>',
     f'<text x="770" y="90" class="acc" font-size="15" font-family="{NOTE}" text-anchor="end" transform="rotate(-4 770 90)">is it actually right?</text>',
     f'<text x="500" y="200" class="soft" font-size="14" font-family="{NOTE}" transform="rotate(-2 500 200)">fix the step that failed, run it again</text>',
     text(880,24,"fig. 1",'faint mono',11,500,anchor="end")]
open(ASSETS + "/masthead.svg","w").write(svg(880,212,"Sarbesh Kumar Tiwari, AI/ML engineer: LLM evaluation, AI systems, full-stack. Gurugram, India. Sketch: a model's output goes to a verifier, traces and scores feed the next run.","".join(b)))

# experience timeline, 2020 to now
YEARS = (2020, 2027); X0, X1 = 150, 852
def xof(y, m): return X0 + (X1 - X0) * ((y - YEARS[0]) + (m - 1) / 12) / (YEARS[1] - YEARS[0])
rows = [("Ethara.ai via Quess", "Full Stack Developer (AI Engineer)", (2026, 2), (2026, 11), "hot", "LLM evaluation · benchmarks · agent traces"),
        ("Ecorp Info Systems", "Full Stack Developer", (2024, 7), (2026, 2), "box", "10+ production apps · 30k+ daily users"),
        ("Aayan · iWashHub", "Flutter Developer", (2023, 6), (2024, 6), "box", "mobile apps and their APIs"),
        ("SRMU, Lucknow", "B.Tech, Data Science & AI", (2020, 8), (2024, 6), "box", "")]
b=[text(0,16,"WHERE I'VE WORKED",'faint mono',11.5,500,ls=0.6)]
for yr in range(YEARS[0], YEARS[1] + 1):
    x = xof(yr, 1)
    b.append(f'<line x1="{x:.1f}" y1="34" x2="{x:.1f}" y2="226" class="rule" stroke-width="1" stroke-dasharray="1 4"/>')
    b.append(text(round(x,1), 246, str(yr), 'faint mono', 11, anchor="middle"))
for i,(org,role,a,z,cls,note) in enumerate(rows):
    y = 44 + i * 46
    b.append(text(0, y + 13, org, 'ink sans', 13, 600)); b.append(text(0, y + 30, role, 'soft sans', 11.5))
    xa, xz = xof(*a), xof(*z)
    b.append(f'<rect x="{xa:.1f}" y="{y}" width="{xz - xa:.1f}" height="22" rx="5" class="{cls}" stroke-width="1.2"/>')
    if note:
        b.append(text(round(min(xz + 8, 880), 1) if xz < 700 else round(xa - 8, 1), y + 15, note, 'soft sans', 11.5, anchor="start" if xz < 700 else "end"))
b.append(f'<text x="{xof(2026, 11) - 2:.1f}" y="40" class="acc" font-size="13" font-family="{NOTE}" text-anchor="end">now</text>')
open(ASSETS + "/timeline.svg","w").write(svg(880,256,"Timeline: B.Tech in Data Science and AI 2020 to 2024; Flutter developer 2023 to 2024; Full Stack Developer at Ecorp July 2024 to February 2026; Full Stack Developer (AI Engineer) at Ethara.ai via Quess since February 2026.","".join(b)))

# stack: what I reach for, grouped, with the everyday tools set darker
groups = [("LLM engineering", ["evaluation & benchmarks", "agents", "LangChain", "Claude / OpenAI / Gemini", "AWS Bedrock", "Ollama"], 4),
          ("Backend", ["Python", "FastAPI", "Flask", "Node.js", "Express", "Playwright"], 3),
          ("Frontend", ["TypeScript", "React", "Next.js", "Tailwind", "Flutter"], 3),
          ("Data", ["PostgreSQL", "MongoDB", "MySQL", "Redis", "TimescaleDB"], 2),
          ("Infrastructure", ["AWS", "Docker", "GitHub Actions", "Nginx", "Linux"], 2)]
b=[text(0,16,"WHAT I BUILD WITH",'faint mono',11.5,500,ls=0.6),
   f'<text x="880" y="16" class="soft" font-size="13" font-family="{NOTE}" text-anchor="end">darker = daily use</text>']
cw = 880 / len(groups)
for i,(g,items,daily) in enumerate(groups):
    x = i * cw
    b.append(text(round(x,1), 46, g, 'ink sans', 13.5, 700))
    b.append(f'<line x1="{x:.1f}" y1="56" x2="{x + cw - 18:.1f}" y2="56" class="rule" stroke-width="1"/>')
    for k,it in enumerate(items):
        b.append(text(round(x,1), 78 + k * 21, it, 'ink sans' if k < daily else 'soft sans', 12.5, 600 if k < daily else 400))
open(ASSETS + "/stack.svg","w").write(svg(880,210,"Stack. LLM engineering: evaluation, agents, LangChain, Claude/OpenAI/Gemini, Bedrock, Ollama. Backend: Python, FastAPI, Flask, Node.js, Express, Playwright. Frontend: TypeScript, React, Next.js, Tailwind, Flutter. Data: PostgreSQL, MongoDB, MySQL, Redis, TimescaleDB. Infrastructure: AWS, Docker, GitHub Actions, Nginx, Linux.","".join(b)))

def flow(name,label,steps,hot,caption):
    """A row of stages joined by arrows; `hot` is the stage that carries the main engineering idea."""
    W,H=880,132; n=len(steps); gap=26; bw=(W-gap*(n-1))/n
    b=[text(0,16,caption,'faint mono',11.5,500,ls=0.6)]
    for i,(t1,t2) in enumerate(steps):
        x=i*(bw+gap); y=34
        b.append(f'<rect x="{x+.5:.1f}" y="{y+.5}" width="{bw-1:.1f}" height="80" rx="8" class="{"hot" if i==hot else "box"}" stroke-width="1"/>')
        b.append(text(round(x+14,1),y+33,t1,'ink sans',14,600))
        for k,line in enumerate(t2.split("\n")): b.append(text(round(x+14,1),y+53+k*16,line,'soft sans',12))
        if i<n-1:
            ax=x+bw+3; b.append(f'<line x1="{ax:.1f}" y1="{y+40}" x2="{ax+gap-9:.1f}" y2="{y+40}" class="arrow" stroke-width="1.2"/>')
            b.append(f'<path d="M{ax+gap-9:.1f} {y+36} L{ax+gap-4:.1f} {y+40} L{ax+gap-9:.1f} {y+44}Z" class="tip"/>')
    open(ASSETS + f"/{name}.svg","w").write(svg(W,H,label,"".join(b)))

FLOWS=[]
def add(*a): FLOWS.append(a); flow(*a)
add("reachout","Reachout flow: find jobs, rank against the resume, you approve, apply, learn from outcomes",
 [("Find","100+ job boards and\ncompany career pages"),("Rank","resume-aware scoring\nwith stated reasons"),
  ("You approve","nothing is sent or\napplied without you"),("Apply","public forms only;\nblocked sites never"),("Learn","feedback and outcomes\nadjust future scores")],2,"HOW IT WORKS")
add("pencil-puzzle-bench","Pencil Puzzle Bench flow: puzzles, model under test, step-level verifier, JSONL trajectory traces, multi-run statistics",
 [("Puzzles","machine-checkable\nsolutions"),("Model","direct or agentic;\nBedrock, GLM, APIs"),("Verify","every step checked\nagainst the rules"),
  ("Trace","JSONL trajectory\nper run"),("Compare","repeated runs for\nvariance, not luck")],2,"EVALUATION PIPELINE")
add("ats","ATS flow: research agents propose, schema validation, deterministic risk engine, mode gate, broker; every decision audited",
 [("Agents","LLM research proposes\na trade with reasons"),("Validate","proposal must match\na strict schema"),
  ("Risk engine","deterministic limits\nthe AI cannot bypass"),("Mode","paper · supervised\n· live (armed)"),("Audit","why it traded, and\nwhy it didn't")],2,"ORDER PATH")
add("voicepilot","VoicePilot flow: microphone, local speech to text, agent in a pseudo-terminal, read the reply, speak it",
 [("Listen","stops recording\non silence"),("Transcribe","faster-whisper or\nparakeet, on device"),("Agent in a PTY","Claude, Codex, Aider,\nOllama run unchanged"),
  ("Read reply","waits for output\nto go quiet"),("Speak","local text-to-speech;\nno audio leaves")],2,"VOICE LOOP")
print("ok")

