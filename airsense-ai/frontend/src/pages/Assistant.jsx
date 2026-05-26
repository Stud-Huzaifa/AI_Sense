import { Bot, Brain, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

export default function Assistant({ messages, onAsk, current }) {
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const prompts = [
    "Is it safe to go outside today?",
    "Why is AQI high right now?",
    "What does PM2.5 mean?",
    "Should asthma patients avoid outdoor activity?",
    "Which pollutant is most dangerous today?",
  ];

  const submit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setSending(true);
    try {
      await onAsk(question.trim());
      setQuestion("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="assistant-panel">
      <div className="assistant-header">
        <div>
          <span className="eyebrow">AQI-aware assistant</span>
          <h2>Ask AirSense AI about pollutants, health risk, and outdoor safety</h2>
        </div>
        <div className="assistant-avatar">
          <Brain size={25} />
        </div>
      </div>

      <div className="prompt-chips">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => setQuestion(prompt)}>
            <Sparkles size={15} />
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-window">
        {!messages.length && (
          <div className="bot-msg intro">
            <Bot size={18} />
            <p>
              I can explain today&apos;s AQI in {current?.city || "your city"}, identify pollutant drivers, and translate
              risk into practical health guidance.
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.question}-${index}`} className="chat-pair">
            <p className="user-msg">
              <User size={15} />
              {message.question}
            </p>
            <div className="bot-msg">
              <Bot size={16} />
              <p>{message.answer}</p>
              {!!message.insights?.length && (
                <div className="chat-insights">
                  <strong>Insights</strong>
                  {message.insights.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              {!!message.suggestions?.length && (
                <div className="chat-suggestions">
                  {message.suggestions.slice(0, 4).map((item) => (
                    <em key={item}>{item}</em>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="typing-indicator">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form className="chat-input" onSubmit={submit}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask AirSense AI..." />
        <button className="icon-action send-action" type="submit" title="Send message" disabled={sending}>
          <Send size={18} />
          <span>Send</span>
        </button>
      </form>
    </section>
  );
}
