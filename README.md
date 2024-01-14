<h1 align="center">Say it aloud and let SoundScribe handle the rest!</h1>

SoundScribe is an open-source discord bot designed to transcribe audio in real-time within voice channels, saving you the effort of having to remember what has been said.

Invite SoundScribe to your server effortlessly capture and transcribe conversations! 

# 🤖 Bot Features
🎤**Real Time Transcription** - Experience seamless audio-to-text conversion in real-time.

📝**Meeting Summarization** - Condense your meetings into concise AI-generated notes.

💬**Language Translation** - Break language barriers by translating your spoken words.

# 🛠️ Local Development
### Install the Prerequisites
- Install `FFmpeg` either [manually](https://ffmpeg.org/) or through package manager (apt, brew, choco, etc.)
- Install `rust` by following the [Getting Started page](https://www.rust-lang.org/learn/get-started), this may needed for the OpenAI model
- Clone this repository: `git clone https://github.com/datderek/SoundScribe.git`
- Install all the dependencies: `npm i`
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
### Start up SoundScribe!
Start the bot by running:
```
npm run start
```
The bot should now be logged in and able to respond to registered slash commands.

# 📝 Roadmap
- [x] Transcribe a single users audio
- [ ] Transcribe audio in real-tine
- [ ] Implement speaker diarization to transcribe multiple users
- [ ] Generate meeting notes based on summarized transcription