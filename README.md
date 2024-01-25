<p align="center">
  <img src="https://github.com/datderek/SoundScribe/assets/88995035/4a399b1c-a71b-4284-a692-b41e3e278564" data-canonical-src="https://github.com/datderek/SoundScribe/assets/88995035/4a399b1c-a71b-4284-a692-b41e3e278564"/>
</p>
<h1 align="center">Say it aloud and let SoundScribe handle the rest!</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
  <img src="https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue"/>
  <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"/>
</p>

SoundScribe is an open-source Discord bot designed to transcribe audio in real-time within voice channels, saving you the effort of having to remember what was said.

Invite SoundScribe to your server effortlessly capture and transcribe conversations! 

# 🤖 Bot Features
🎤 **Real Time Transcription** - Experience seamless audio-to-text conversion in real-time.

📝 **Meeting Summarization** - Condense your meetings into concise AI-generated notes.

💬 **Language Translation** - Break language barriers by translating your spoken words.

# 🛠️ Local Development
### Install the Prerequisites
- Install `FFmpeg` either [manually](https://ffmpeg.org/) or through package manager (apt, brew, choco, etc.)
- Install `rust` by following the [Getting Started page](https://www.rust-lang.org/learn/get-started), this may needed for the OpenAI model
- Clone this repository: `git clone https://github.com/datderek/SoundScribe.git`
- Install the dependencies: `npm install`
### Setting up the Discord bot
1. Set up the bot by following the Discord.js [documentation](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) and note down the **Bot Token** and the **Application ID**
2. Invite the bot to your server by [creating an invite link](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#creating-and-using-your-invite-link).
3. Enable Developer Mode and note down your **Server ID**
4. Create a `.env` file in the project root with the **CLIENTID (Appliation ID)**, **TOKEN (Bot Token)**, and **SERVERID**
```
CLIENTID=1234
SERVERID=1234
TOKEN=1234
```
5. Register the slash commands by running:
```
npm run deploy
```
### Start up SoundScribe!
Start the bot by running:
```
npm run start
```
The bot should now be logged in and able to respond to registered slash commands.

### Additional Notes
The accuracy of the transcription is dependent on the Whisper model that is used. Larger models are much more 
accurate but also slower. Feel free to change the model used in `utils/transcribe.py`, but keep in mind the model requirements 
defined in the Whisper [documentation](https://github.com/openai/whisper?tab=readme-ov-file#available-models-and-languages).

# 📝 Roadmap
- [x] Transcribe a single users audio
- [x] Transcribe audio in real-tine
- [x] Record and transcribe multiple users
- [ ] Generate meeting notes based on summarized transcription
- [ ] Translate transcription to desired language
