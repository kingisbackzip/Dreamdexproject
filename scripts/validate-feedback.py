"""Validate this reviewed public package, its evidence boundaries and source pins."""
from pathlib import Path
import hashlib,json,re
r=Path(__file__).resolve().parents[1]
m=json.loads((r/'review-manifest.json').read_text())
assert m['reviewed_count']==38 and m['selected_count']==8
assert {d['id'] for d in m['decisions']}=={f'{i:03}' for i in range(1,39)}
selected={d['id'] for d in m['decisions'] if d['decision']=='submit-normal'}
assert selected=={'008','022','023','024','028','031','037','038'}
assert {p['id'] for p in m['reports']}==selected
assert len(list((r/'feedback').glob('*.md')))==8
required=['Summary and impact','Steps to reproduce','Expected','Actual','Evidence','Environment','Severity rationale','Scope, duplicates and limitations','Suggested remediation']
for report in m['reports']:
 s=(r/report['path']).read_text()
 assert all('\n## '+h+'\n' in s for h in required),report['id']
 assert 'Severity: normal' in s and 'Area: '+report['area'] in s
 assert report['id'] not in {'015','030'}
for forbidden in ['pending','evidence/private-revalidation','scripts/revalidate-private.mjs']:
 assert not (r/forbidden).exists(),forbidden
snap=json.loads((r/'evidence/upstream/manifest.json').read_text())
for row in snap:
 b=(r/row['path']).read_bytes();actual=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
 assert actual==row['blob_sha'],row['path']
lock=json.loads((r/'review/package-lock.json').read_text())
pkg=json.loads((r/'review/package.json').read_text())
assert lock['packages']['']['dependencies']==pkg['dependencies']
assert lock['packages']['node_modules/@somnia-chain/markets-sdk']['version']=='0.32.1'
assert lock['packages']['node_modules/viem']['version']=='2.24.0'
checked=0
paths=[r/'README.md',r/'REVALIDATION.md',r/'VALIDATION.md',r/'SUBMISSION.md',*list((r/'feedback').glob('*.md'))]
for p in paths:
 s=re.sub(r'```[\s\S]*?```','',p.read_text())
 for target in re.findall(r'\]\(([^)]+)\)',s):
  if re.match(r'^[a-zA-Z]+:',target) or target.startswith('#'):continue
  assert (p.parent/target.split('#',1)[0]).exists(),(p.name,target)
  checked+=1
run=(r/'evidence/revalidation/tests.tap').read_text()
assert '# tests 20' in run and '# pass 20' in run and '# fail 0' in run
print(f'PASS: 38 decisions; 8 normal Feedback reports; {len(snap)} source snapshots; {checked} local links; 20 passing recorded tests')
print('PASS: pinned SDK/viem lockfile; no private companion reports or private revalidation script')
