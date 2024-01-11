import whisper
import sys

fileName = str(sys.argv[1])
model = whisper.load_model("tiny.en")
result = model.transcribe(f"{fileName}", fp16=False)
print(result['text'])