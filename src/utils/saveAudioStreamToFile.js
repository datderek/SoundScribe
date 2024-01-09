import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { EndBehaviorType } from '@discordjs/voice';
import * as prism from 'prism-media';

export function saveAudioStreamToFile(receiver, userId, userName) {
  const filename = `./recordings/${Date.now()}-${userName}.ogg`;
  const out = createWriteStream(filename);
  console.log(`Started recording ${filename}`);

  /* 
   * Subscribe to the Opus audio stream from the specified user, terminating 
   * after 3.5s of silence
   */
  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.Manual,
    },
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
      console.warn(`Error recording file ${filename} - ${err.message}`);
    } else {
      console.log(`Recorded ${filename}`);
    }
  });
}
