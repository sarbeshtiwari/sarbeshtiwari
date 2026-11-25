"""Draws the profile graphics into assets/ in the portfolio's style (sarbeshtiwari.vercel.app): warm paper, tomato
accent, serif headlines with italic phrases, handwritten notes, tape strips, coloured project panels, doodles.
Run: python .github/profile/diagrams.py"""
import html, os

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets")
SERIF = "'IBM Plex Serif','Iowan Old Style',Georgia,serif"
DISPLAY = "Fraunces,'Iowan Old Style',Georgia,serif"
SANS = "Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace"
HAND = "Caveat,'Bradley Hand','Segoe Print','Comic Neue',cursive"
STYLE = f"""<style>
.serif{{font-family:{SERIF}}} .display{{font-family:{DISPLAY}}} .sans{{font-family:{SANS}}} .mono{{font-family:{MONO}}} .hand{{font-family:{HAND}}}
.paper{{fill:#fffefd}} .tint{{fill:#f6f2ea}} .edge{{stroke:#ece5d7}} .ink{{fill:#1a1715}} .soft{{fill:#4a433d}} .mute{{fill:#8a8278}}
.tomato{{fill:#f25c3b}} .tomato-s{{stroke:#f25c3b}} .doodle{{fill:none;stroke:#1a1715}} .doodle-f{{fill:#1a1715}}
.chip{{fill:#fffefd;stroke:#f25c3b}} .chip-t{{fill:#c8401f}} .pill{{fill:#fffefd}} .pill-t{{fill:#1a1715}}
.shadow{{fill:#281e14;opacity:.07}}
.flow{{stroke-dasharray:4 5;animation:flow 1.3s linear infinite}} @keyframes flow{{to{{stroke-dashoffset:-18}}}}
.bob{{animation:bob 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}} @keyframes bob{{50%{{transform:translateY(-3px) rotate(4deg)}}}}
.spin{{animation:spin 14s linear infinite;transform-box:fill-box;transform-origin:center}} @keyframes spin{{to{{transform:rotate(360deg)}}}}
.write{{animation:write 1.6s ease-out both;animation-delay:var(--t,.5s)}} @keyframes write{{from{{opacity:0;transform:translateY(4px)}}}}
.draw{{stroke-dasharray:var(--l,600);stroke-dashoffset:var(--l,600);animation:draw 1.6s ease-out forwards;animation-delay:var(--t,.3s)}} @keyframes draw{{to{{stroke-dashoffset:0}}}}
.grow{{transform-box:fill-box;transform-origin:left center;animation:grow 1.3s cubic-bezier(.2,.8,.2,1) both}} @keyframes grow{{from{{transform:scaleX(0)}}}}
@media (prefers-reduced-motion: reduce){{.flow,.bob,.spin,.write,.draw,.grow{{animation:none}}.draw{{stroke-dashoffset:0}}}}
@media (prefers-color-scheme: dark){{
.paper{{fill:#14110e}} .tint{{fill:#1e1a16}} .edge{{stroke:#2c2620}} .ink{{fill:#f0ebe0}} .soft{{fill:#b8b0a2}} .mute{{fill:#807769}}
.doodle{{stroke:#f0ebe0}} .doodle-f{{fill:#f0ebe0}} .chip{{fill:#14110e}} .chip-t{{fill:#f6866b}} .shadow{{opacity:.35}}}}
</style>"""
e = html.escape
PANEL = {"lake": "#3e7b9e", "sage": "#4f7d52", "grape": "#6b4e8a", "marigold": "#d9921a", "tomato": "#c8401f"}
TAPE = {"marigold": "rgb(244 180 58 / .6)", "sage": "rgb(123 166 122 / .55)", "rose": "rgb(232 155 174 / .6)", "lake": "rgb(62 123 158 / .4)"}


def svg(w, h, label, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{e(label)}">'
            f'<title>{e(label)}</title>{STYLE}{body}</svg>\n')


def t(x, y, s, cls, size, weight=400, anchor="start", ls=0, italic=False, extra=""):
    st = ' font-style="italic"' if italic else ""
    return (f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" '
            f'letter-spacing="{ls}"{st}{extra}>{e(s)}</text>')


def tape(x, y, w, color, rot):
    return f'<rect x="{x}" y="{y}" width="{w}" height="16" fill="{TAPE[color]}" transform="rotate({rot} {x + w / 2} {y + 8})"/>'


def star(cx, cy, r, cls="doodle-f bob"):
    import math
    pts = []
    for i in range(10):
        a = math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * .42
        pts.append(f"{cx + rr * math.cos(a):.1f},{cy - rr * math.sin(a):.1f}")
    return f'<polygon points="{" ".join(pts)}" class="{cls}"/>'


def asterisk(cx, cy, r):
    return "".join(f'<line x1="{cx}" y1="{cy - r}" x2="{cx}" y2="{cy + r}" class="doodle" stroke-width="3" stroke-linecap="round" transform="rotate({a} {cx} {cy})"/>'
                   for a in (0, 60, 120))


def spiral(cx, cy):
    return (f'<path d="M{cx} {cy} m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -10 0 a8 8 0 1 1 16 0 a11 11 0 1 1 -22 0" '
            f'class="doodle spin" stroke-width="2.4" stroke-linecap="round"/>')


def pill(x, y, label, icon=""):
    w = len(label) * 7.6 + 26
    return (f'<rect x="{x}" y="{y}" width="{w:.0f}" height="26" rx="13" class="pill"/>'
            + t(round(x + 13, 1), y + 18, label, 'pill-t hand', 16, 600)), w


# --- masthead: like the site's hero ----------------------------------------------------------------------------------
b = ['<rect x="0" y="0" width="900" height="300" rx="16" class="paper"/>',
     t(450, 40, "GURUGRAM, INDIA  ·  AI ENGINEER @ QUESS CORP × ETHARA.AI  ·  OPEN TO WORK: ANYWHERE IN INDIA OR REMOTE",
       'soft mono', 11, 500, "middle", 1.6),
     t(450, 104, "hi, i'm an AI engineer who ships", 'ink serif', 42, 400, "middle"),
     f'<path d="M262 116 C 330 108, 420 110, 520 114" class="tomato-s draw" style="--l:300;--t:.5s" fill="none" stroke-width="2.6" stroke-linecap="round"/>',
     f'<text x="450" y="160" text-anchor="middle" font-size="42" class="serif"><tspan class="tomato" font-style="italic" font-weight="600">LLM agents, voice interfaces</tspan><tspan class="ink"> and</tspan></text>',
     t(450, 210, "the stack around them.", 'ink serif', 42, 400, "middle"),
     t(450, 250, "Sarbesh Kumar Tiwari  ·  LLM evaluation, AI agents and full-stack engineering", 'mute sans', 15, 400, "middle"),
     t(450, 282, "flip through my work ↓", 'mute hand write', 18, 400, "middle", extra=' style="--t:1.4s"'),
     asterisk(818, 96, 16), spiral(86, 92), star(844, 236, 13),
     t(64, 250, "sarbesh, 2026", 'mute hand write', 17, 400, extra=' style="--t:1s" transform="rotate(-6 64 250)"')]
open(ASSETS + "/masthead.svg", "w").write(svg(900, 300, "hi, i'm an AI engineer who ships LLM agents, voice interfaces and the stack around them. Sarbesh Kumar Tiwari, Gurugram, India. AI engineer at Quess Corp × Ethara.ai, open to work anywhere in India or remote.", "".join(b)))


# --- project card: the site's taped card with a coloured panel -----------------------------------------------------------
def card(name, label, kind, title, word, italic, tagline, steps, checks, tags, color, tape_c, badge=None):
    W, H = 900, 300
    b = [f'<rect x="10" y="16" width="{W - 20}" height="{H - 26}" rx="6" class="shadow"/>',
         f'<rect x="6" y="10" width="{W - 20}" height="{H - 26}" rx="6" class="tint edge" stroke-width="1"/>',
         tape(120, 2, 92, tape_c, -3), tape(W - 230, 4, 110, "lake" if tape_c != "lake" else "rose", 3)]
    px, py, pw, ph = 22, 26, 410, 236
    b.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="6" fill="{PANEL[color]}"/>')
    b.append(f'<pattern id="dots-{name}" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".9" fill="#ffffff" opacity=".12"/></pattern>')
    b.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="6" fill="url(#dots-{name})"/>')
    b.append(t(px + 18, py + 28, kind, 'mono', 10.5, 500, ls=1.6, extra=' fill="#ffffff" fill-opacity=".75"'))
    b.append(f'<text x="{px + 18}" y="{py + 120}" font-size="46" class="display" fill="#ffffff"><tspan font-weight="700">{e(word)}</tspan><tspan font-style="italic">{e(italic)}.</tspan></text>')
    x = px + 18
    for i, s in enumerate(steps):
        p, w = pill(x, py + 148, s)
        b.append(p)
        x += w
        if i < len(steps) - 1:
            b.append(f'<line x1="{x + 4}" y1="{py + 161}" x2="{x + 18}" y2="{py + 161}" stroke="#ffffff" stroke-width="1.6" class="flow"/>')
            x += 22
    cx = px + pw + 26
    b.append(t(cx, 50, label, 'mono', 10.5, 500, ls=1.6, extra=' fill="#3e7b9e"'))
    b.append(t(cx, 84, title, 'ink serif', 26, 700))
    b.append(t(cx, 108, tagline, 'tomato serif', 15, 400, italic=True))
    for i, c in enumerate(checks):
        y = 142 + i * 24
        b.append(f'<rect x="{cx}" y="{y - 12}" width="13" height="13" rx="2" fill="none" class="tomato-s" stroke-width="1.6"/>')
        b.append(f'<path d="M{cx + 3} {y - 6} l3 3 l6 -7" fill="none" class="tomato-s draw" style="--l:20;--t:{.6 + i * .25:.2f}s" stroke-width="1.8" stroke-linecap="round"/>')
        b.append(t(cx + 22, y, c, 'ink hand', 18, 500))
    x = cx
    for tg in tags:
        w = len(tg) * 7.2 + 20
        b.append(f'<rect x="{x}" y="226" width="{w:.0f}" height="22" rx="11" class="chip" stroke-width="1"/>')
        b.append(t(round(x + 10, 1), 241, tg.upper(), 'chip-t mono', 9.5, 500, ls=.8))
        x += w + 6
    if badge:
        bx = W - 118
        b.append(f'<g transform="rotate(4 {bx + 44} 40)"><rect x="{bx}" y="26" width="88" height="28" rx="3" fill="#f4b43a"/>'
                 + t(bx + 44, 46, badge, 'ink hand', 18, 700, "middle") + '</g>')
    open(ASSETS + f"/{name}.svg", "w").write(svg(W, H, label_text(title, tagline, steps, checks), "".join(b)))


def label_text(title, tagline, steps, checks):
    return f"{title}: {tagline}. Flow: {' → '.join(steps)}. " + "; ".join(checks) + "."


card("reachout", "AI AGENT / CAREER", "JOB SEARCH, ON AUTOPILOT", "Reachout", "reach", "out",
     "an AI agent that runs the whole job search", ["find", "rank", "you approve", "apply"],
     ["100+ job boards and company career pages", "Resume edits may only reorder, never add", "Nothing sent or applied without consent"],
     ["Python", "Flask", "LangChain", "Playwright", "React"], "tomato", "marigold", "live")
card("pencil-puzzle-bench", "LLM EVALUATION", "REASONING, MEASURED", "Pencil Puzzle Bench", "ppbench", "",
     "my evaluation tooling on an open benchmark", ["puzzle", "model", "verify", "trace"],
     ["Benchmark CLI: many models, seeds, dry runs", "JSONL trajectory trace for every run", "Bedrock + GLM; multi-run variance"],
     ["Python", "AWS Bedrock", "LLM APIs"], "grape", "rose")
card("ats", "AI / FINTECH", "AGENTS, WITH GUARDRAILS", "ATS", "ats", "agents",
     "LLM agents that can't bypass the risk rules", ["research", "risk check", "order"],
     ["Claude API research agents", "Deterministic risk engine as a hard guardrail", "Full audit trail of agent decisions"],
     ["Python", "FastAPI", "Claude API", "Groww TradeAPI"], "sage", "sage", "in progress")
card("voicepilot", "AI TOOL", "VOICE, NOT KEYBOARD", "VoicePilot", "voice", "pilot",
     "talking to terminal AI agents", ["speak", "agent works", "hear reply"],
     ["Works with any terminal agent", "Local speech recognition, no API keys", "Solo mode with a custom wake word"],
     ["Python", "faster-whisper", "PTY", "macOS", "Windows"], "lake", "lake", "live")

# --- timeline: taped notebook page -------------------------------------------------------------------------------------
YEARS = (2020, 2027); X0, X1 = 200, 860
def xof(y, m): return X0 + (X1 - X0) * ((y - YEARS[0]) + (m - 1) / 12) / (YEARS[1] - YEARS[0])
rows = [("Ethara.ai via Quess", "AI engineer", (2026, 2), (2026, 11), "#f25c3b"),
        ("Ecorp Info Systems", "full stack developer", (2024, 7), (2026, 2), "#3e7b9e"),
        ("Aayan · iWashHub", "flutter developer", (2023, 6), (2024, 6), "#7ba67a"),
        ("SRMU, Lucknow", "B.Tech, data science & AI", (2020, 8), (2024, 6), "#f4b43a")]
b = ['<rect x="0" y="0" width="900" height="300" rx="10" class="paper"/>',
     t(450, 34, "EXPERIENCE · /03", 'mono', 11, 500, "middle", 2, extra=' fill="#3e7b9e"'),
     t(450, 72, "where i've been building", 'ink serif', 32, 400, "middle"),
     t(450, 98, "newest at the top", 'mute hand', 18, 400, "middle")]
for yr in range(YEARS[0], YEARS[1] + 1):
    x = xof(yr, 1)
    b.append(f'<line x1="{x:.1f}" y1="114" x2="{x:.1f}" y2="268" class="edge" stroke-width="1" stroke-dasharray="2 5"/>')
    b.append(t(round(x, 1), 288, str(yr), 'mute mono', 11, anchor="middle"))
for i, (org, role, a, z, col) in enumerate(rows):
    y = 124 + i * 37
    b.append(t(30, y + 14, org, 'ink sans', 13.5, 600))
    b.append(t(30, y + 30, role, 'soft hand', 16))
    xa, xz = xof(*a), xof(*z)
    b.append(f'<rect x="{xa:.1f}" y="{y + 2}" width="{xz - xa:.1f}" height="24" rx="4" fill="{col}" fill-opacity=".85" class="grow" '
             f'style="animation-delay:{.3 + (3 - i) * .35:.2f}s"/>')
b.append(t(round(xof(2026, 11) + 4, 1), 118, "now ↓", 'tomato hand write', 18, 600, "end", extra=' style="--t:1.9s"'))
b.append(star(870, 40, 11)); b.append(spiral(40, 46))
open(ASSETS + "/timeline.svg", "w").write(svg(900, 300, "Experience: B.Tech in Data Science and AI at SRMU 2020 to 2024; Flutter developer at Aayan and iWashHub 2023 to 2024; full stack developer at Ecorp Info Systems July 2024 to February 2026; AI engineer at Ethara.ai via Quess since February 2026.", "".join(b)))

# --- stack: sticky notes ------------------------------------------------------------------------------------------------
notes = [("LLM engineering", ["evaluation & benchmarks", "agents", "LangChain", "Claude · OpenAI · Gemini", "AWS Bedrock · Ollama"], "#fbe6b4", -2),
         ("backend", ["Python · FastAPI · Flask", "Node.js · Express", "Playwright", "REST APIs"], "#dcebd6", 1.5),
         ("frontend", ["TypeScript", "React · Next.js", "Tailwind", "Flutter"], "#f8dde3", -1),
         ("data & infra", ["PostgreSQL · MongoDB", "MySQL · Redis", "AWS · Docker", "GitHub Actions · Nginx"], "#d6e6ef", 2)]
b = ['<rect x="0" y="0" width="900" height="290" rx="10" class="paper"/>',
     t(450, 34, "TOOLS · /04", 'mono', 11, 500, "middle", 2, extra=' fill="#3e7b9e"'),
     t(450, 70, "what i reach for", 'ink serif', 30, 400, "middle")]
for i, (title, items, col, rot) in enumerate(notes):
    x = 26 + i * 216; y = 96
    b.append(f'<g transform="rotate({rot} {x + 100} {y + 90})">'
             f'<rect x="{x + 4}" y="{y + 6}" width="200" height="172" class="shadow"/>'
             f'<rect x="{x}" y="{y}" width="200" height="172" fill="{col}"/>'
             + tape(x + 64, y - 8, 72, ["marigold", "sage", "rose", "lake"][i], -4)
             + t(x + 16, y + 34, title, 'hand', 22, 700, extra=' fill="#1a1715"')
             + "".join(t(x + 16, y + 62 + k * 22, it, 'sans', 12.5, 500, extra=' fill="#4a433d"') for k, it in enumerate(items))
             + '</g>')
open(ASSETS + "/stack.svg", "w").write(svg(900, 290, "Stack. LLM engineering: evaluation and benchmarks, agents, LangChain, Claude/OpenAI/Gemini, AWS Bedrock, Ollama. Backend: Python, FastAPI, Flask, Node.js, Express, Playwright. Frontend: TypeScript, React, Next.js, Tailwind, Flutter. Data and infrastructure: PostgreSQL, MongoDB, MySQL, Redis, AWS, Docker, GitHub Actions, Nginx.", "".join(b)))
print("ok")
