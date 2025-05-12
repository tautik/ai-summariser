# Voice Pipeline - Mermaid Diagram

Below is a simple visualization of the audio summary generation pipeline using Mermaid.

```mermaid
flowchart TD
    subgraph "Data Sources"
        A1[Twitter Data] 
        A2[Gmail Data]
        A3[Reddit Data]
    end

    subgraph "Processing Pipeline"
        B[Data Aggregation]
        C[LLM Text Generation]
        D[ElevenLabs Speech Synthesis]
    end

    E[Audio MP3 File]

    A1 --> B
    A2 --> B
    A3 --> B
    B --> C
    C --> D
    D --> E

    classDef sources fill:#e1f5fe,stroke:#0288d1
    classDef process fill:#f3e5f5,stroke:#7b1fa2
    classDef output fill:#e8f5e9,stroke:#2e7d32

    class A1,A2,A3 sources
    class B,C,D process
    class E output
```

## Key Steps

1. **Data Collection** - Gather data from Twitter, Gmail, and Reddit
2. **Data Aggregation** - Format and structure data for AI processing
3. **Text Generation** - Process with OpenAI's GPT-4 to create summary
4. **Speech Synthesis** - Convert text to audio using ElevenLabs
5. **Output** - Generate MP3 file for playback in the frontend

This pipeline transforms user activity data into a personalized audio summary that can be played in the application. 