import numpy as np
import sys
import threading
import whisper
from queue import Queue
from time import sleep

print("Loading transcription model", flush = True)
model = whisper.load_model("base.en")
print("Model has loaded.", flush = True)
data_queue = Queue()

# Background thread to constantly receive input data from stdin
# so that the main thread is not blocked
def read_input():
  while True:
    data_chunk = sys.stdin.buffer.read(1024)
    if data_chunk:
      data_queue.put(data_chunk)
      data_chunk = None

input_thread = threading.Thread(target=read_input)
input_thread.start()

while True:
  if not data_queue.empty():
    data = b''.join(data_queue.queue)
    data_queue.queue.clear()

    np_data = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0

    result = model.transcribe(np_data, fp16 = False)
    text = result['text']
    print(f"Transcription: {text}", flush = True)
    sleep(1)
    
