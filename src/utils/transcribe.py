import whisper
import sys
from datetime import datetime, timedelta
from queue import Queue

model = whisper.load_model('tiny.en')
audio_data_queue = Queue()
last_phrase_time = None

while True:
  # Saves new audio data into a queue
  for line in sys.stdin:
    audio_data_queue.put(line)

  now = datetime.utcnow()

  if not audio_data_queue.empty():
    phrase_complete = False
    if last_phrase_time and now - last_phrase_time > timedelta(seconds=5):
        phrase_complete = True
        print("Reached it here")
    
    last_phrase_time = now

    audio_data = ''.join(audio_data_queue.queue)
    audio_data_queue.queue.clear()

    result = model.transcribe(audio_data, fp16=False)
    text = result['text'].strip()
    print(text)
    
    
