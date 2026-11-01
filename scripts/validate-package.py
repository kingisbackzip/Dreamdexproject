"""Validate package completeness/provenance, not live vulnerability validity."""
from pathlib import Path
import re,json,hashlib

ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'manifest.json').read_text())
public=m.get('package_kind')=='public-feedback'
expected=36 if public else 38
reports=m['reports']
assert len(reports)==expected, (len(reports),expected)
assert len({r['id'] for r in reports})==expected
assert sum(r['path'].startswith('feedback/') for r in reports)==36
assert len(list((ROOT/'feedback').glob('*.md')))==36
assert all(r['severity'] in {'critical','major','normal'} for r in reports)
assert all(r['area'] in {'API','SDK','docs','app','contracts'} for r in reports)
required=['Summary and impact','Steps to reproduce','Expected','Actual','Evidence','Environment','Severity rationale','Scope, duplicates and limitations','Suggested remediation']
for r in reports:
    text=(ROOT/r['path']).read_text()
    assert all('\n## '+heading+'\n' in text for heading in required),r['path']
    assert f"Severity: {r['severity']}" in text
    assert f"Area: {r['area']}" in text
    assert (ROOT/r['source_excerpt']).is_file()
    assert 1 <= r['pdf_pages'][0] <= r['pdf_pages'][1] <= 63
    assert f"PDF pages {r['pdf_pages'][0]}-{r['pdf_pages'][1]}" in text
if public:
    assert not (ROOT/'pending').exists()
    assert not (ROOT/'scripts/revalidate-private.mjs').exists()
    assert not (ROOT/'evidence/private-revalidation').exists()
    assert not any(r['id'] in {'015','030'} for r in reports)
    assert not (ROOT/'evidence/pdf/015.txt').exists()
    assert not (ROOT/'evidence/pdf/030.txt').exists()
else:
    assert {r['id'] for r in reports}=={f'{n:03}' for n in range(1,39)}
    assert {r['id'] for r in reports if r['disclosure']=='private-review'}=={'015','030'}
    assert sum(r['severity']=='major' for r in reports)==3

snapshots=json.loads((ROOT/'evidence/upstream/manifest.json').read_text())
for s in snapshots:
    data=(ROOT/s['path']).read_bytes()
    sha=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    assert sha==s['blob_sha'],(s['path'],sha,s['blob_sha'])

checked=0
for path in ROOT.rglob('*.md'):
    if 'evidence/upstream' in path.as_posix():continue
    text=re.sub(r'```[\s\S]*?```','',path.read_text())
    for link in re.findall(r'\]\(([^)]+)\)',text):
        if re.match(r'^[a-zA-Z]+:',link) or link.startswith('#'):continue
        target=link.split('#',1)[0]
        assert (path.parent/target).exists(),(str(path.relative_to(ROOT)),link)
        checked+=1
print(f'PASS: {expected} reports; 36 Feedback candidates; '+('0 private reports in export' if public else '2 private holds'))
print(f'PASS: all required sections, severity/area enums, unique IDs and PDF-page mappings')
print(f'PASS: {len(snapshots)} exact upstream Git blob hashes; {checked} local Markdown links')
print('NOTE: this structural check does not validate the live findings, rules, access or acceptance')
