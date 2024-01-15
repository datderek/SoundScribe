import { EndBehaviorType } from "@discordjs/voice";
import { pipeline } from "stream"
import { spawn } from 'child_process';

export function createTranscription(receiver, userId, userName) {
  /* 
   * Create the Python child process to handle transcription
   */
  const pythonProcess = spawn('python', ['./src/utils/transcribe.py']);

  /*
   * Subscribe to the Opus audio stream from the specified user
   */
  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.Manual
    }
  })

  /*
   * Pipe the Opus stream into the Python process
   */
  pipeline(opusStream, pythonProcess.stdin, (err) => {
    if (err) {
      console.warn(`Error transcribing audio`);
    } else {
      console.log(`Audio transcription finished.`);
    }
  });

  /*
   * Handles the events thrown by the Python process
   */
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Process Output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Process Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python Process exited with code ${code}`);
  });
}