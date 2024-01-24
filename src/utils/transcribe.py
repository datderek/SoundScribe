import numpy as np
import sys
import threading
import whisper
from queue import Queue
from time import sleep

print("Loading transcription model", flush = True)
model = whisper.load_model("small.en")
print("Model has loaded.", flush = True)
data_queue = Queue()

# Background thread set up to receive input data from stdin so that the 
# main thread is not blocked
def read_input():
  while True:
    data_chunk = sys.stdin.buffer.read(1024)
    if data_chunk:
      data_queue.put(data_chunk)
      data_chunk = None
input_thread = threading.Thread(target=read_input)
input_thread.start()

# Main thread handles the transcription when data is present within the queue
while True:
  if not data_queue.empty():
    data = b''.join(data_queue.queue)
    data_queue.queue.clear()

    # Format the PCM audio into NumPy array containing the audio as a float32
    # monowave form
    np_data = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
    
    result = model.transcribe(np_data, fp16 = False)
    text = result['text'].strip()
    print(f"{text}", flush = True)
    sleep(0.25)
    
