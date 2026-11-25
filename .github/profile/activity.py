"""Draws assets/activity.svg: the last year of contributions and the languages across my public repositories.
Uses only public data (the contribution calendar page and the repos API). Run by .github/workflows/profile.yml."""
import collections, datetime as dt, html, json, os, re, urllib.request

USER = "sarbeshtiwari"
SKIP = {"HACTOBERFEST_2022", "SSD-Saarthi", "minor-"}  # forks and archives that aren't my code


def get(url, accept="application/json"):
    headers = {"User-Agent": "profile-graphics", "Accept": accept}
    if os.environ.get("GITHUB_TOKEN") and "api.github.com" in url:
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
        return r.read().decode()


page = get(f"https://github.com/users/{USER}/contributions", "text/html")
cells = {m[1]: int(m[2]) for m in re.finditer(r'data-date="(\d{4}-\d\d-\d\d)"[^>]*?data-level="(\d)"', page)}
counts = {}
for m in re.finditer(r'for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]+)<', page):
    n = re.match(r"(\d+) contribution", m[2])
    day = re.search(rf'data-date="(\d{{4}}-\d\d-\d\d)" id="{m[1]}"', page)
    if day:
        counts[day[1]] = int(n[1]) if n else 0
total = sum(counts.values())

langs = collections.Counter()
repos = json.loads(get(f"https://api.github.com/users/{USER}/repos?per_page=100&type=owner"))
for r in repos:
    if r["fork"] or r["name"] in SKIP or r["size"] > 200_000:  # skip forks and repos that are mostly media
        continue
    for k, v in json.loads(get(r["languages_url"])).items():
        langs[k] += v
top = langs.most_common(6)
rest = sum(langs.values()) - sum(v for _, v in top)
if rest > 0:
    top.append(("Other", rest))
whole = sum(v for _, v in top) or 1

SANS = "Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace"
SERIF = "'IBM Plex Serif','Iowan Old Style',Georgia,serif"
HAND = "Caveat,'Bradley Hand','Segoe Print',cursive"
STYLE = f"""<style>
text{{font-family:{SANS}}} .mono{{font-family:{MONO}}} .serif{{font-family:{SERIF}}} .hand{{font-family:{HAND}}}
.bg{{fill:#fffefd}} .ink{{fill:#1a1715}} .soft{{fill:#4a433d}} .faint{{fill:#8a8278}} .rule{{stroke:#ece5d7}} .lake{{fill:#3e7b9e}}
.l0{{fill:#f1ece2}} .l1{{fill:#fbd3c6}} .l2{{fill:#f8a58f}} .l3{{fill:#f25c3b}} .l4{{fill:#c8401f}}
.b0{{fill:#f25c3b}} .b1{{fill:#3e7b9e}} .b2{{fill:#7ba67a}} .b3{{fill:#f4b43a}} .b4{{fill:#6b4e8a}} .b5{{fill:#e89bae}} .b6{{fill:#c9c2b5}}
.cell{{animation:pop .5s ease-out both;transform-box:fill-box;transform-origin:center}} @keyframes pop{{from{{opacity:0;transform:scale(.4)}}}}
.bar{{transform-box:fill-box;transform-origin:left center;animation:grow 1.2s cubic-bezier(.2,.8,.2,1) both}} @keyframes grow{{from{{transform:scaleX(0)}}}}
.hot{{animation:glow 2.2s ease-in-out infinite}} @keyframes glow{{50%{{opacity:.55}}}}
@media (prefers-reduced-motion: reduce){{.cell,.bar,.hot{{animation:none}}}}
@media (prefers-color-scheme: dark){{
.bg{{fill:#14110e}} .ink{{fill:#f0ebe0}} .soft{{fill:#b8b0a2}} .faint{{fill:#807769}} .rule{{stroke:#2c2620}}
.l0{{fill:#211c17}} .l1{{fill:#4a2419}} .l2{{fill:#8a3420}} .l3{{fill:#d4502f}} .l4{{fill:#f6866b}} .b6{{fill:#4a433d}}}}
</style>"""
e = html.escape
out = []
days = sorted(cells)
first = dt.date.fromisoformat(days[0]) if days else dt.date.today()
out.append(f'<text x="0" y="16" class="lake mono" font-size="11" letter-spacing="2">ON GITHUB · LAST 12 MONTHS</text>')
out.append(f'<text x="880" y="18" class="soft hand" font-size="19" text-anchor="end">{total:,} contributions this year</text>')
size, gap, top_y = 13, 3, 32
seen_month = None
for d in days:
    day = dt.date.fromisoformat(d)
    week = (day - first).days // 7 + (1 if first.weekday() != 6 and day.weekday() == 6 and False else 0)
    col = ((day - first).days + (first.isoweekday() % 7)) // 7
    row = day.isoweekday() % 7
    x, y = col * (size + gap) + 30, top_y + 16 + row * (size + gap)
    tip = f"{counts.get(d, 0)} on {day:%d %b %Y}"
    out.append(f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="2.5" class="cell l{cells[d]}{' hot' if cells[d] == 4 else ''}" style="animation-delay:{col * .02:.2f}s"><title>{e(tip)}</title></rect>')
    if day.day <= 7 and row == 0 and day.month != seen_month:
        seen_month = day.month
        out.append(f'<text x="{x}" y="{top_y + 8}" class="faint" font-size="10.5">{day:%b}</text>')
for r, name in ((1, "Mon"), (3, "Wed"), (5, "Fri")):
    out.append(f'<text x="0" y="{top_y + 16 + r * (size + gap) + 10}" class="faint" font-size="10.5">{name}</text>')
ly = top_y + 16 + 7 * (size + gap) + 34
out.append(f'<line x1="0" y1="{ly - 14}" x2="880" y2="{ly - 14}" class="rule" stroke-width="1"/>')
out.append(f'<text x="0" y="{ly + 6}" class="lake mono" font-size="11" letter-spacing="2">LANGUAGES IN MY REPOSITORIES</text>')
x = 0
for i, (name, v) in enumerate(top):
    w = max(2, 880 * v / whole)
    out.append(f'<rect x="{x:.1f}" y="{ly + 18}" width="{w - 2:.1f}" height="10" rx="2" class="bar b{i}" style="animation-delay:{1.2 + i * .12:.2f}s"><title>{e(name)}: {100 * v / whole:.1f}%</title></rect>')
    x += w
x = 0
for i, (name, v) in enumerate(top):
    label = f"{name} {100 * v / whole:.0f}%"
    out.append(f'<rect x="{x}" y="{ly + 44}" width="9" height="9" rx="2" class="b{i}"/>')
    out.append(f'<text x="{x + 14}" y="{ly + 53}" class="soft" font-size="12">{e(label)}</text>')
    x += 14 + len(label) * 6.9 + 22
H = ly + 66
label = f"{total} contributions in the last year; languages: " + ", ".join(f"{n} {100 * v / whole:.0f}%" for n, v in top)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{H + 20}" viewBox="-10 -10 900 {H + 20}" role="img" aria-label="{e(label)}">'
       f'<title>{e(label)}</title>{STYLE}<rect x="-10" y="-10" width="900" height="{H + 20}" rx="10" class="bg"/>{"".join(out)}</svg>\n')
open(os.path.join(os.path.dirname(__file__), "..", "..", "assets", "activity.svg"), "w").write(svg)
print(label)
