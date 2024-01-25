import { EndBehaviorType } from "@discordjs/voice";
import { pipeline } from "stream"
import { spawn } from 'child_process';
import prism from 'prism-media';

export function createTranscription(receiver, userId, userName, interaction) {
  /* 
   * Create the Python child process to handle transcription
   */
  const pythonProcess = spawn('./.venv/bin/python', ['./src/utils/transcribe.py']);
  interaction.client.processes.push(pythonProcess);

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
   * Transcribe audio and outputs to Discord. Creates a new message every minute.
   * Otherwise edits message by appending new transcription text.
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
    console.log(`Ended transcription process for ${userName}`);
  });
}