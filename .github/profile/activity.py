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


def calendar(year):
    """{date: (level, count)} for one calendar year, from the public contribution page."""
    page = get(f"https://github.com/users/{USER}/contributions?from={year}-01-01&to={year}-12-31", "text/html")
    out = {}
    for m in re.finditer(r'data-date="(\d{4}-\d\d-\d\d)" id="(contribution-day-component-\d+-\d+)"[^>]*?data-level="(\d)"', page):
        tip = re.search(rf'for="{m[2]}"[^>]*>(\d+) contribution', page)
        out[m[1]] = (int(m[3]), int(tip[1]) if tip else 0)
    return {d: v for d, v in out.items() if d.startswith(str(year))}


joined = int(json.loads(get(f"https://api.github.com/users/{USER}"))["created_at"][:4])
today = dt.date.today()
years = {y: calendar(y) for y in range(today.year, joined - 1, -1)}  # newest first
totals = {y: sum(c for _, c in cal.values()) for y, cal in years.items()}
total = sum(totals.values())

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
out.append(f'<text x="0" y="16" class="lake mono" font-size="11" letter-spacing="2">ON GITHUB · SINCE {joined}</text>')
out.append(f'<text x="880" y="18" class="soft hand" font-size="19" text-anchor="end">{total:,} contributions till date</text>')
size, gap, X = 12, 3, 66
y0 = 44
for i, (year, cal) in enumerate(years.items()):
    top_y = y0 + i * 124
    first = dt.date(year, 1, 1)
    out.append(f'<text x="0" y="{top_y + 30}" class="ink serif" font-size="20">{year}</text>')
    out.append(f'<text x="0" y="{top_y + 50}" class="faint mono" font-size="10.5">{totals[year]:,}</text>')
    seen_month = None
    for d in sorted(cal):
        day = dt.date.fromisoformat(d)
        if day > today:
            continue
        col = ((day - first).days + first.isoweekday() % 7) // 7
        row = day.isoweekday() % 7
        x, y = X + col * (size + gap), top_y + 14 + row * (size + gap)
        lvl, n = cal[d]
        out.append(f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="2" class="cell l{lvl}{' hot' if lvl == 4 else ''}" '
                   f'style="animation-delay:{i * .25 + col * .01:.2f}s"><title>{n} on {day:%d %b %Y}</title></rect>')
        if i == 0 and day.day <= 7 and row == 0 and day.month != seen_month:  # month names above the newest year only
            seen_month = day.month
            out.append(f'<text x="{x}" y="{top_y + 8}" class="faint" font-size="10">{day:%b}</text>')
ly = y0 + len(years) * 124 + 10
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
label = f"{total} contributions since {joined} (" + ", ".join(f"{y}: {t}" for y, t in totals.items()) + "); languages: " + ", ".join(f"{n} {100 * v / whole:.0f}%" for n, v in top)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{H + 20}" viewBox="-10 -10 900 {H + 20}" role="img" aria-label="{e(label)}">'
       f'<title>{e(label)}</title>{STYLE}<rect x="-10" y="-10" width="900" height="{H + 20}" rx="10" class="bg"/>{"".join(out)}</svg>\n')
open(os.path.join(os.path.dirname(__file__), "..", "..", "assets", "activity.svg"), "w").write(svg)
print(label)
