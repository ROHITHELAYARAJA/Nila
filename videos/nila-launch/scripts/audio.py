import json
import math
import subprocess
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

root = Path(__file__).resolve().parents[1]
cache = Path.home() / '.cache' / 'nila-video-audio'
cache.mkdir(parents=True, exist_ok=True)
for name in ['kokoro-v1.0.onnx', 'voices-v1.0.bin']:
    target = cache / name
    if not target.exists():
        print(f'Downloading local voice asset: {name}', flush=True)
        urllib.request.urlretrieve(f'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/{name}', target)
tts = Kokoro(str(cache / 'kokoro-v1.0.onnx'), str(cache / 'voices-v1.0.bin'))
out = root / 'assets' / 'audio'
out.mkdir(parents=True, exist_ok=True)
lines = [
    ('intro', 'Meet Neela. Your nightly AI companion.', 'af_heart', 1.04, 3.32, 3.1),
    ('question', 'How was your day?', 'af_heart', 1.20, 7.05, 0.91),
    ('user', 'Seven hours of sleep. One point eight liters of water. Three goals done.', 'am_adam', 1.25, 8.08, 3.18),
    ('ack', 'Got it!', 'af_heart', 1.10, 11.46, 0.44),
    ('recap', 'One conversation. Your whole day, organized.', 'af_heart', 1.11, 24.12, 2.68),
    ('tagline', 'One call. A clearer day.', 'af_heart', 1.02, 27.4, 2.05),
]
timing = []
for name, text, voice, speed, start, maximum in lines:
    samples, rate = tts.create(text, voice=voice, speed=speed, lang='en-us')
    samples = np.asarray(samples, dtype=np.float32)
    active = np.where(np.abs(samples) > 0.008)[0]
    if len(active):
        samples = samples[max(0, active[0]-int(rate*.018)):min(len(samples), active[-1]+int(rate*.045))]
    raw = out / f'{name}-raw.wav'
    final = out / f'{name}.wav'
    sf.write(raw, samples, rate)
    duration = len(samples) / rate
    factor = max(1, duration/maximum)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(raw),'-af',f'atempo={factor:.6f},loudnorm=I=-19:TP=-2:LRA=5','-ar','48000',str(final)],check=True)
    samples, rate = sf.read(final)
    duration = len(samples)/rate
    envelope = []
    for offset in range(0,len(samples),int(rate/30)):
        segment=samples[offset:offset+int(rate/30)]
        envelope.append(round(min(1,float(np.sqrt(np.mean(segment**2)))*7),4))
    timing.append({'id':name,'text':text,'voice':voice,'start':start,'duration':duration,'path':f'assets/audio/{name}.wav','envelope':envelope,'tempo_adjustment':round(factor,4)})
    print(f'{name}: {duration:.3f}s, tempo correction {factor:.3f}',flush=True)
    raw.unlink()
sr=48000
t=np.arange(sr*30)/sr
bed=np.zeros(len(t))
chords=[(146.832,174.614,220.0,261.626),(130.813,164.814,195.998,246.942),(110.0,130.813,164.814,195.998),(174.614,220.0,261.626,329.628)]
for j in range(8):
    start=j*3.75
    mask=(t>=start)&(t<min(start+4.4,30))
    q=t[mask]-start
    fade=np.minimum(q/.22,1)*np.minimum((4.4-q)/.8,1)
    for freq in chords[j%4]:
        bed[mask]+=0.022*fade*(np.sin(2*np.pi*freq*q)+.23*np.sin(2*np.pi*freq*2*q))
for j in range(96):
    start=j*.3125
    mask=(t>=start)&(t<start+.28)
    q=t[mask]-start
    freq=chords[(j//12)%4][j%4]*4
    bed[mask]+=.035*np.exp(-q*14)*np.sin(2*np.pi*freq*q)
    if j%2==0:
        mask=(t>=start)&(t<start+.16)
        q=t[mask]-start
        bed[mask]+=.065*np.exp(-q*25)*np.sin(2*np.pi*(48*q+19*(1-np.exp(-q*28))/28))
bed*=np.minimum(t/.3,1)*np.minimum((30-t)/1.1,1)
sf.write(out/'music.wav',np.column_stack([bed,bed*.96]),sr)
sfx=np.zeros(len(t))
for start in [.22,.83,3.15,3.72]:
    mask=(t>=start)&(t<start+.32)
    q=t[mask]-start
    sfx[mask]+=.075*np.sin(np.pi*np.minimum(q/.32,1))**2*(np.sin(2*np.pi*440*q)+np.sin(2*np.pi*480*q))
for i,start in enumerate([4.2,12.25,12.9,13.6,14.3,15.1,16.8,17.9,19.0,20.1,21.2,22.3,27.4]):
    mask=(t>=start)&(t<start+.18)
    q=t[mask]-start
    sfx[mask]+=.05*np.exp(-q*22)*np.sin(2*np.pi*(660+(i%4)*110)*q)
for offset,freq in [(27.52,523.251),(27.68,659.255),(27.88,783.991)]:
    mask=(t>=offset)&(t<offset+.7)
    q=t[mask]-offset
    sfx[mask]+=.08*np.exp(-q*7)*np.sin(2*np.pi*freq*q)
sf.write(out/'sfx.wav',sfx,sr)
(out/'timing.json').write_text(json.dumps(timing,indent=2))
from faster_whisper import WhisperModel
model=WhisperModel('tiny.en',device='cpu',compute_type='int8',download_root=str(cache/'whisper'))
for item in timing:
    segments,_=model.transcribe(str(root/item['path']),word_timestamps=True,beam_size=5,initial_prompt=item['text'])
    item['words']=[{'text':w.word.strip(),'start':round(w.start,3),'end':round(w.end,3)} for segment in segments for w in (segment.words or [])]
    print(f"{item['id']}: {len(item['words'])} timed words",flush=True)
(out/'timing.json').write_text(json.dumps(timing,indent=2))
(root/'audio_meta.json').write_text(json.dumps({'provider':'local-kokoro','voices':timing,'bgm':{'path':'assets/audio/music.wav','source':'host'},'sfx':[{'file':'assets/audio/sfx.wav','offset_s':0,'duration_s':30,'source':'host'}]},indent=2))
