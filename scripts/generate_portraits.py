#!/usr/bin/env python3
"""Create 38 original, reproducible 512px transparent CHOKEPOINT 2040 cartoon portraits.
Read identities and exact filenames from design/portrait-manifest.json.
Usage: python scripts/generate_portraits.py --manifest design/portrait-manifest.json --out assets/portraits/original
"""
import argparse, json, math, re, hashlib
from pathlib import Path
import cairosvg
from PIL import Image

INK = '#15242b'
SKINS = ['#f1c5a4','#e8ae82','#ce8e68','#b76d4b','#9e613e','#79503e','#5d382b']
LOOK = {
'india-a':(3,'wavy','#26343b','teal','cream'), 'india-b':(3,'short','#76706a','ochre','charcoal'),
'china-a':(1,'bob','#24292b','navy','jade'),'china-b':(1,'short','#1d252b','charcoal','red'),
'germany-a':(0,'cropped','#a38c62','petrol','ivory'),'germany-b':(0,'curly','#684a3b','rust','cream'),
'usa-a':(6,'curly','#282323','burgundy','cream'),'usa-b':(0,'receding','#7b7168','navy','pale'),
'france-a':(2,'curly','#362b31','plum','cream'),'france-b':(4,'close','#24292c','forest','ivory'),
'saudi-a':(2,'scarf','#3d444b','sand','ivory'),'saudi-b':(2,'scarfman','#2b272a','grey','white'),
'uae-a':(3,'scarf','#26374a','turquoise','cream'),'uae-b':(2,'scarfman','#292c2c','slate','white'),
'japan-a':(1,'swept','#292d2e','indigo','ivory'),'japan-b':(1,'short','#454344','olive','cream'),
'korea-a':(1,'swept','#27282e','cobalt','charcoal'),'korea-b':(1,'long','#29272d','aubergine','cream'),
'australia-a':(2,'ponytail','#282b30','bottle','cream'),'australia-b':(0,'short','#aaa095','ochre','navy'),
'indonesia-a':(2,'bob','#25282e','coral','cream'),'indonesia-b':(3,'wavy','#25272d','slate','blue'),
'brazil-a':(4,'curly','#312c29','teal','cream'),'brazil-b':(4,'short','#6f6a65','terracotta','cream'),
'aster-a':(4,'asymmetric','#262937','violet','charcoal'),'aster-b':(3,'bob','#777070','charcoal','violet'),
'meridian-a':(1,'cropped','#25272e','cobalt','ivory'),'meridian-b':(2,'swept','#b2aba4','darkblue','cream'),
'helix-a':(1,'slick','#26242a','charcoal','copper'),'helix-b':(6,'close','#302826','copper','cream'),
'bluewave-a':(3,'wavy','#25272c','ocean','cream'),'bluewave-b':(4,'curly','#26282c','navy','aqua'),
'grainvault-a':(2,'ponytail','#362e30','sage','cream'),'grainvault-b':(6,'bald','#31292a','olive','cream'),
'northgrid-a':(4,'short','#343233','navy','amber'),'northgrid-b':(0,'cropped','#ad614b','amber','ivory'),
'atlas-a':(3,'short','#93918f','burgundy','cream'),'atlas-b':(4,'wavy','#2c2c30','burgundy','cream'),
}
COLORS = {
 'teal':'#17757b','ochre':'#bf8b3e','navy':'#2d4259','charcoal':'#464951','petrol':'#1f6373',
 'rust':'#a35e43','burgundy':'#7c3554','plum':'#754465','forest':'#37635b','sand':'#b5a18b',
 'grey':'#6a777d','turquoise':'#318f91','slate':'#566c7d','indigo':'#3c547a','olive':'#697664',
 'cobalt':'#33639b','aubergine':'#5e4160','bottle':'#2c6557','coral':'#c96b60','terracotta':'#ab6950',
 'violet':'#645184','darkblue':'#26475c','copper':'#a86743','ocean':'#28769b','sage':'#7b9581','amber':'#c5964e',
 'cream':'#f5e9d3','ivory':'#faf3e9','pale':'#d8e0e6','jade':'#5b9c88','red':'#a44d50',
 'white':'#f4f1e9','blue':'#7ca1bd','aqua':'#63c0c1',
}

def rgb(h):return tuple(int(h[i:i+2],16) for i in (1,3,5))
def hexmix(a,b,r=.28):
 x,y=rgb(a),rgb(b);return '#'+''.join('%02x'%max(0,min(255,round(xx*(1-r)+yy*r))) for xx,yy in zip(x,y))
def dark(h,a=.2): return hexmix(h,INK,a)
def light(h,a=.2): return hexmix(h,'#ffffff',a)
def path(d,fill,stroke=INK,w=5,extras=''):
 return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extras}/>'
def ell(cx,cy,rx,ry,fill,stroke=INK,w=4): return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" />'
def line(d,color=INK,w=4): return path(d,'none',color,w)

def portrait(c):
 cid=c['id'];skin_index,hair,shade,jacket,inner=LOOK[cid]
 skin=SKINS[skin_index];skin2=dark(skin,.17); hi=light(skin,.19)
 jacket=COLORS[jacket];shirt=COLORS[inner]; jacket2=dark(jacket,.25)
 female=cid in ('india-a','china-a','germany-a','usa-a','france-a','saudi-a','uae-a','japan-a','korea-b','australia-a','indonesia-a','brazil-a','aster-b','meridian-a','helix-b','bluewave-a','grainvault-a','northgrid-b','atlas-b')
 # Keep variation controlled and symmetrical across institution A/B, not a change in moral tone.
 wide=3 if cid in ('germany-b','australia-b','northgrid-a','atlas-a') else 0
 slim=4 if cid in ('china-a','japan-a','korea-b','bluewave-a') else 0
 face_left=159+slim;face_right=357+wide-slim
 age=1 if ('-b' in cid or cid in ('germany-a','atlas-a','grainvault-a')) else 0
 out=[]
 # Hair visible behind face and neck, silhouette varies by cut
 if hair in ('bob','long','wavy','curly','ponytail','asymmetric'):
  if hair=='long': d='M154 190 Q143 116 202 83 Q279 53 330 112 Q379 142 367 280 L383 362 Q320 385 282 347 L185 360 Q124 330 141 272Z'
  elif hair=='curly': d='M147 174 Q108 126 164 111 Q151 72 204 78 Q231 51 260 69 Q306 48 324 79 Q365 72 364 121 Q395 153 361 185 L373 315 Q338 347 303 335 L174 337 Q126 320 141 269Z'
  elif hair=='ponytail': d='M153 175 Q139 93 223 80 Q321 64 352 151 L369 263 Q409 303 379 373 Q343 359 342 313 L153 309Z'
  elif hair=='asymmetric': d='M147 172 Q134 106 190 84 Q306 49 356 135 L368 309 Q347 347 318 339 L161 325 Q128 280 147 172Z'
  else:d='M148 165 Q138 90 218 74 Q329 59 358 144 L377 303 Q365 350 329 364 L161 344 Q126 294 148 165Z'
  out.append(path(d,dark(shade,.15),INK,6))
 # Back of torso, torso fits fully inside canvas
 out.append(path('M70 473 Q63 446 89 416 Q115 396 177 384 L216 367 L301 367 L346 387 Q407 392 429 423 Q449 449 438 473 Q256 487 70 473Z',jacket,INK,6))
 out.append(path('M75 451 Q83 411 164 398 L185 406 Q118 420 114 469Z',jacket2,'none',0))
 out.append(path('M343 388 Q419 401 436 448 L435 471 L398 474 Q403 414 343 388Z',jacket2,'none',0))
 # Neck and shadow
 out.append(path('M213 327 L215 373 Q252 408 302 369 L300 316Z',skin,INK,5))
 out.append(path('M264 341 L302 320 L299 370 Q279 385 261 385Z',skin2,'none',0))
 # Clothing center & lapels
 out.append(path('M217 378 L258 422 L304 375 L336 405 L321 473 L187 474 L184 406Z',shirt,INK,4))
 if inner in ('white','cream','ivory','pale','blue','aqua','jade'):
  out.append(path('M219 377 L259 416 L233 430 L198 389Z',light(shirt,.14),INK,2.5))
  out.append(path('M299 377 L258 416 L281 429 L325 389Z',light(shirt,.1),INK,2.5))
  out.append(line('M258 422 L257 472',dark(shirt,.24),2.5))
 if inner in ('red','amber','copper'):
  out.append(path('M246 409 L269 409 L274 427 L262 443 L252 428Z',COLORS[inner],INK,3))
  out.append(path('M262 443 L246 475 L281 475Z',dark(COLORS[inner],.1),INK,3))
 if cid in ('india-a','india-b','atlas-a'):
  out.append(path('M238 393 L275 394 L271 474 L242 474Z',shirt,'none',0))
  for y in (429,457):out.append(ell(257,y,2.5,2.5,dark(shirt,.3),'none',0))
 # Jacket lapels give silhouette readable at 96 px
 if cid in ('saudi-b','uae-b'):
  out.append(path('M195 389 L205 473 L320 473 L327 392 Q303 424 262 430 Q222 419 195 389Z',COLORS['white'],INK,3))
 else:
  out.append(path('M201 373 L256 422 L221 473 L177 410 L190 394Z',jacket,INK,4))
  out.append(path('M308 372 L258 422 L302 473 L348 407 L333 391Z',jacket,INK,4))
  out.append(path('M177 410 L213 438 L201 453 L231 476', 'none', light(jacket,.25),3))
  out.append(path('M348 410 L314 438 L326 453 L297 476', 'none', dark(jacket,.35),3))
 if cid=='india-b':
  out.append(path('M201 380 L229 413 L213 472 L181 458Z',dark(jacket,.1),INK,3))
  out.append(path('M310 379 L283 413 L304 470 L343 457Z',dark(jacket,.1),INK,3))
  for y in (430,459):out.append(ell(257,y,3,3,'#d1b87e','none',0))
 # Ears back
 out.append(ell(157,243,15,28,skin,INK,4))
 out.append(ell(356,241,13,27,skin2,INK,4))
 out.append(line('M154 238 Q145 246 157 257',skin2,3))
 # Facial contour: neck visible + 2 tone angular cheek shading
 out.append(path(f'M{face_left} 176 Q{face_left-3} 117 209 103 Q263 73 318 105 Q{face_right+4} 135 {face_right} 194 L{face_right-6} 269 Q341 319 299 343 Q266 357 228 346 Q175 323 164 274 Q158 239 {face_left} 176Z',skin,INK,5.5))
 out.append(path('M314 111 Q358 140 352 201 L347 271 Q331 314 299 342 Q274 351 261 349 Q310 307 318 264 Q337 193 314 111Z',skin2,'none',0))
 out.append(path('M177 192 Q181 137 213 121 Q189 153 181 210 L179 262 Q170 231 177 192Z',hi,'none',0))
 out.append(path('M201 287 Q212 305 235 304', 'none',dark(skin,.11),3))
 # Eyes: unequal widths cue three-quarter angle; pupils and highlights
 for x,y,scale in ((216,225,1.0),(298,219,.82)):
  rx=18*scale;ry=9*scale
  out.append(path(f'M{x-rx:.1f} {y} Q{x} {y-ry*1.55:.1f} {x+rx:.1f} {y-1} Q{x} {y+ry:.1f} {x-rx:.1f} {y}Z','#f2ede7',INK,2.6))
  out.append(ell(x+3,y-1,5.3*scale,6.2*scale,'#52483f','none',0))
  out.append(ell(x+3,y-1,2.7*scale,4*scale,INK,'none',0))
  out.append(ell(x+1.5,y-3,1.5,1.7,'#ffffff','none',0))
  if female:out.append(line(f'M{x-rx-2:.1f} {y} l-4 -3',INK,2))
 # eyebrows varied in shape, dark not menacing
 bcolor=light(shade,.1)
 out.append(path('M193 203 Q212 192 234 201','none',bcolor,5.5 if not female else 4.3))
 out.append(path('M285 195 Q300 188 314 196','none',bcolor,5 if not female else 4.2))
 # Nose, lips and wrinkles
 out.append(path('M264 231 Q263 255 269 269 Q275 276 286 268','none',dark(skin,.3),3))
 out.append(path('M265 277 Q277 283 283 277','none',hi,2))
 lip=dark(skin,.29)
 out.append(path('M231 299 Q250 290 264 294 Q278 291 292 295 Q264 311 238 301','none',lip,3.2))
 out.append(path('M243 312 Q264 316 283 307','none',dark(skin,.13),2))
 if age:
  out.append(path('M184 284 Q190 290 199 288','none',skin2,2))
  out.append(path('M308 282 Q320 279 324 272','none',skin2,2))
 # Face hair in front; tailored to style
 if hair=='scarf':
  scarf='#263b50' if cid=='uae-a' else '#4a4c50'
  out.append(path('M159 174 Q142 112 201 94 Q265 59 324 103 Q361 129 356 184 Q344 145 319 130 Q259 105 221 125 Q180 140 159 200Z',scarf,INK,5))
  out.append(path('M159 173 Q139 245 153 320 Q159 361 196 386 L178 414 Q117 379 126 298 Q122 221 159 173Z',dark(scarf,.14),INK,5))
  out.append(path('M355 176 Q391 274 368 370 L346 401 L321 379 Q356 344 355 176Z',scarf,INK,5))
  out.append(path('M167 175 Q195 121 256 111 Q306 110 347 164','none',light(scarf,.23),5))
 elif hair=='scarfman':
  out.append(path('M163 157 Q163 88 253 84 Q350 95 347 165 Q315 120 261 114 Q197 113 163 157Z',shade,INK,5))
 elif hair=='bald':
  out.append(path('M174 157 Q185 99 259 98 Q328 103 341 161','none',dark(skin,.12),4))
 elif hair=='receding':
  out.append(path('M161 184 Q152 128 193 105 Q186 132 195 145 Q228 109 266 114 Q300 104 331 123 L353 166 Q354 105 317 94 Q244 63 203 95 Q156 112 161 184Z',shade,INK,5))
 elif hair=='short' or hair=='close' or hair=='cropped':
  height=95 if hair=='short' else 103
  out.append(path(f'M161 192 Q150 {height+21} 203 {height} Q261 {height-28} 317 {height+4} Q355 {height+20} 352 189 L341 170 Q334 142 315 137 Q285 117 248 137 Q203 127 180 158 L169 189Z',shade,INK,5.5))
  out.append(path('M178 144 Q217 103 266 115','none',light(shade,.23),5))
 elif hair=='slick' or hair=='swept':
  out.append(path('M155 187 Q153 127 192 102 Q241 77 290 98 Q343 88 358 161 L349 188 Q331 137 301 134 Q257 127 218 147 Q177 157 155 187Z',shade,INK,5.5))
  out.append(path('M183 132 Q241 91 323 118','none',light(shade,.25),6))
 elif hair=='bob':
  out.append(path('M147 181 Q133 124 175 94 Q230 61 300 82 Q362 103 364 180 L359 287 Q352 314 335 327 Q344 277 339 229 Q338 159 313 136 Q263 107 221 139 Q180 135 161 200 L165 322 Q135 285 147 181Z',shade,INK,5.5))
  out.append(path('M172 130 Q212 89 277 104', 'none', light(shade,.22),6))
 elif hair=='wavy' or hair=='long' or hair=='asymmetric':
  out.append(path('M151 194 Q128 146 154 111 Q183 73 225 83 Q289 65 333 102 Q362 131 356 199 Q348 158 321 137 Q279 117 251 146 Q219 159 196 140 Q164 149 151 194Z',shade,INK,5.5))
  out.append(path('M159 172 Q143 211 154 257 Q140 290 158 328','none',light(shade,.15),8))
  out.append(path('M185 113 Q208 93 243 96', 'none', light(shade,.27),5))
  if hair=='asymmetric':out.append(path('M311 112 Q342 123 340 175 Q323 191 307 199 L293 177 Q311 140 311 112Z',shade,INK,4))
 elif hair=='curly':
  for x,y,r in [(166,159,24),(179,130,25),(212,104,24),(246,92,27),(281,99,28),(313,116,25),(345,147,23),(340,180,19)]:
   out.append(ell(x,y,r,r*.86,shade,INK,4))
  for x,y in [(181,124),(227,99),(295,112),(342,152)]:out.append(path(f'M{x-10} {y} Q{x} {y-11} {x+11} {y}','none',light(shade,.19),3.2))
 elif hair=='ponytail':
  out.append(path('M149 189 Q144 125 192 100 Q266 63 341 120 L353 184 Q330 143 302 133 Q250 113 207 144 Q171 146 149 189Z',shade,INK,5))
  out.append(path('M178 142 Q236 94 314 125','none',light(shade,.24),5))
 # Glasses for explicit characters
 if 'glasses' in c.get('appearance','').lower() or cid=='meridian-a':
  roundglasses=cid=='germany-a'
  for x,y in ((216,225),(297,219)):
   if roundglasses:out.append(ell(x,y,27,22,'none','#3e4448',4))
   else:out.append(path(f'M{x-27} {y-17} Q{x} {y-20} {x+26} {y-17} L{x+21} {y+15} Q{x} {y+21} {x-22} {y+13}Z','none','#333a40',4))
  out.append(line('M243 222 Q255 217 270 221','#333a40',4))
  out.append(line('M189 225 L166 218','#333a40',3.5))
  out.append(line('M323 218 L343 211','#333a40',3.5))
 # Beards where specified
 if cid in ('saudi-b','uae-b','northgrid-a'):
  out.append(path('M171 272 Q183 324 226 345 Q274 369 302 342 Q344 320 344 279 L331 292 Q321 326 291 335 Q261 346 225 331 Q189 314 179 276Z',dark(shade,.03),INK,3))
  out.append(path('M240 300 Q261 295 288 299','none',light(shade,.13),3))
 # accessories and job markers without flags or logos
 if female and hair not in ('scarf','scarfman') and cid not in ('meridian-a','aster-a'):
  out.append(ell(154,272,4,6,'#e2be78','none',0))
 if cid in ('meridian-a','meridian-b','bluewave-b','northgrid-b'):
  out.append(path('M353 423 L379 433 L370 443 L344 432Z',light(jacket,.2),'none',0))
 # Consistent broad shadow under chin
 out.append(path('M217 350 Q259 372 299 350','none',dark(skin,.22),4))
 # Cropping safe: no art outside x50..457 and y65..485
 return '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'+''.join(out)+'</svg>'

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--manifest',default='design/portrait-manifest.json');ap.add_argument('--out',default='assets/portraits/original');ap.add_argument('--source',default='design/portrait-vector-sources');a=ap.parse_args()
 manifest=json.loads(Path(a.manifest).read_text(encoding='utf-8'))
 dest=Path(a.out);dest.mkdir(parents=True,exist_ok=True)
 src=Path(a.source);src.mkdir(parents=True,exist_ok=True)
 files=[]
 for ch in manifest['characters']:
  svg=portrait(ch);p=dest/ch['sourceFilename'];s=src/ch['sourceFilename'].replace('.png','.svg')
  s.write_text(svg,encoding='utf-8')
  cairosvg.svg2png(bytestring=svg.encode(),write_to=str(p),output_width=512,output_height=512)
  with Image.open(p) as im:
   q=im.convert("RGBA").quantize(colors=48, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
   q.save(p,optimize=True,compress_level=9)
  files.append((ch['sourceFilename'],hashlib.sha256(p.read_bytes()).hexdigest(),p.stat().st_size))
 print(f'generated {len(files)} original transparent PNGs')
 for f,h,n in files:print(f'{f} {n} bytes sha256={h[:12]}')

if __name__=='__main__':main()