import whisper
import sys

fileName = sys.argv[1]
model = whisper.load_model("tiny.en")
result = model.transcribe(f"./recordings/{fileName}", fp16=False)
print(result['text'])