# 03 — Azure Speech Services

This module integrates **Azure Speech Services** into EchoWard to enable a fully voice-first experience — converting the user's voice to text (STT) and EchoWard's responses back to speech (TTS).

---

## 🎯 What You'll Configure

| Feature | Technology | Description |
|---|---|---|
| Speech-to-Text (STT) | Azure Speech SDK | Converts user voice input to text for the orchestrator |
| Text-to-Speech (TTS) | Azure Speech SDK | Reads EchoWard's responses aloud to the user |
| Voice Activity Detection | Azure Speech | Detects when the user has finished speaking |
| Custom Voice (optional) | Azure Speech Studio | A calm, reassuring voice tailored for EchoWard |

---

## 🛠️ Setup

### Step 1: Create a Speech Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **Speech** → Click **Create**
3. Resource group: `echoward-rg`
4. Region: same as your other resources (e.g., West Europe)
5. Pricing: Free (F0) for development, Standard (S0) for production
6. Copy the **Key 1** and **Region** values

### Step 2: Configure in Copilot Studio

Copilot Studio supports voice channels natively:

1. In Copilot Studio, go to **Channels** → **+ Add channel**
2. Select **Telephony** or **Custom** (depending on your deployment target)
3. For web-based demo: enable the **Web Chat** channel with speech enabled

### Step 3: Speech Configuration (for custom integration)

If building a custom voice interface outside Copilot Studio, use the Azure Speech SDK:

```python
import azure.cognitiveservices.speech as speechsdk

# Configuration
speech_key = "<your-speech-key>"
speech_region = "<your-region>"

speech_config = speechsdk.SpeechConfig(
    subscription=speech_key,
    region=speech_region
)

# Text-to-Speech — calm, clear voice for accessibility
speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

# Slower speech rate for elderly users
ssml = """
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    <prosody rate="-20%">{text}</prosody>
  </voice>
</speak>
"""

# Speech-to-Text
audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
recognizer = speechsdk.SpeechRecognizer(
    speech_config=speech_config,
    audio_config=audio_config
)

result = recognizer.recognize_once()
print("User said:", result.text)
```

### Step 4: Accessibility-Aware TTS Settings

Configure speech output based on the user's accessibility profile:

| User Profile | Voice | Speech Rate | Recommended Voice |
|---|---|---|---|
| Default | Neutral | Normal | `en-US-AriaNeural` |
| Elderly | Warm, clear | -20% | `en-US-JennyNeural` |
| Visually impaired | Descriptive | -10% | `en-US-AriaNeural` |
| Non-English speaker | Localized | Normal | `tr-TR-EmelNeural` (Turkish) |

### Step 5: Supported Languages (Future)

EchoWard's voice interface is designed for multi-language expansion:

| Language | Voice Name |
|---|---|
| English (US) | `en-US-AriaNeural` |
| Turkish | `tr-TR-EmelNeural` |
| Greek | `el-GR-AthinaNeural` |
| Portuguese | `pt-PT-RaquelNeural` |

---

## 🔗 Integrations

| Service | Purpose |
|---|---|
| Azure Speech STT | Convert user voice → text for orchestrator |
| Azure Speech TTS | Convert orchestrator response → audio for user |
| Copilot Studio Voice Channel | End-to-end voice conversation in the browser |

---

## ✅ Test Scenarios

| Scenario | Expected Behavior |
|---|---|
| User speaks clearly | Transcript captured accurately, response read aloud |
| User speaks slowly or with accent | STT still captures intent, responds without error |
| Elderly mode enabled | TTS rate reduced by 20%, pauses between sentences |
| User asks to repeat | TTS replays last response |
