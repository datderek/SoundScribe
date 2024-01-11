import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { EndBehaviorType } from '@discordjs/voice';
import * as prism from 'prism-media';

/*
 * Creates a filename-safe timestamp based on the ISO-8601 format
 */
const createTimestamp = () => {
  return (new Date()).toISOString().replaceAll(':', '-').replace(/\.\d+Z/, '');
}

export function saveAudioStreamToFile(receiver, userId, userName) {
  const fileName = `./recordings/${createTimestamp()}-${userName}.ogg`;
  const out = createWriteStream(fileName);
  console.log(`Started recording ${fileName}`);

  /* 
   * Subscribe to the Opus audio stream from the specified user
   */
  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.Manual,
    },
  });

  /*
   * Destroy the audio stream once the 'end' event has been emitted by
   * `stop-recording.js`
   */
  opusStream.on("end", () => {
    opusStream.destroy();
  });

  /*
   * Sets up a Transform stream to convert the Opus audio stream to an Ogg stream
   */
	const oggStream = new prism.opus.OggLogicalBitstream({
		opusHead: new prism.opus.OpusHead({
			channelCount: 2,
			sampleRate: 48000,
		}),
		pageSizeControl: {
			maxPackets: 10,
		},
	});

  /*
   * Pipes the incoming Opus audio stream to the Ogg transform stream then
   * saves it to `./recordings` via the write stream.
   */
  pipeline(opusStream, oggStream, out, (err) => {
    if (err) {
      console.warn(`Error recording file ${fileName} - ${err.message}`);
    } else {
      console.log(`Recorded ${fileName}`);
    }
  });
}
