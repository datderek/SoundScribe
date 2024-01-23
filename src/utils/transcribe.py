import sys
import threading
import queue
import time

# Stores incoming audio data
data_queue = queue.Queue()

# Background thread to constantly receive input data from stdin
# so that the main thread is not blocked
def read_input():
  print("Background thread has started", flush = True)
  while True:
    data = sys.stdin.buffer.read(1024)
    if data:
      data_queue.put(data)
      data = None
      print("Received audio data!", flush = True)

print("Main thread has started", flush = True)
input_thread = threading.Thread(target=read_input)
input_thread.start()
time.sleep(10)
