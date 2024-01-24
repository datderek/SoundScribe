import { EndBehaviorType } from "@discordjs/voice";
import { pipeline } from "stream"
import { spawn } from 'child_process';
import prism from 'prism-media';

export function createTranscription(receiver, userId, userName, interaction) {
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
   * Decodes Opus audio into PCM
   */
  const decoder = new prism.opus.Decoder({
    rate: 16000,  
    channels: 1,   
    frameSize: 480  
  });

  /*
   * Pipe the Opus stream into the Python process
   */
  pipeline(opusStream, decoder, pythonProcess.stdin, (err) => {
    if (err) {
      console.warn(`Error transcribing audio`);
    } else {
      console.log(`Audio transcription finished.`);
    }
  });

  /*
   * Handles the events thrown by the Python process
   */
  let lastMinute = null;
  let message;
  let messageContent;
  pythonProcess.stdout.on('data', async (data) => {
    const currentMinute = new Date().getUTCMinutes();
    if (currentMinute !== lastMinute) {
      messageContent = `**${userName}** - ${data}`
      message = await interaction.followUp({ content: messageContent });
      lastMinute = currentMinute;
    } else {
      messageContent += `${data}`;
      await message.edit(messageContent);
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Process Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python Process exited with code ${code}`);
  });
}