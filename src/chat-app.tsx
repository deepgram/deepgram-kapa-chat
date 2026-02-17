/**
 * React chat component.
 * Uses @deepgram/styles classes for theming, minimal dg-chat-* classes for layout.
 */
import { useState, useEffect, useRef, Fragment } from 'react';
import { useChat } from '@kapaai/react-sdk';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import go from 'highlight.js/lib/languages/go';
import csharp from 'highlight.js/lib/languages/csharp';
import { StopIcon, PaperPlaneIcon, CommentsIcon, ThumbsUpIcon, ThumbsDownIcon } from './icons';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('go', go);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cs', csharp);

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  }),
);
marked.setOptions({ breaks: true, gfm: true });

const EXAMPLES = [
  'How do I get started with Deepgram?',
  'How do I transcribe audio?',
  'What speech models are available?',
  'How do I use text-to-speech?',
];

export function ChatApp() {
  const {
    conversation,
    submitQuery,
    isGeneratingAnswer,
    isPreparingAnswer,
    resetConversation,
    addFeedback,
    stopGeneration,
    error,
  } = useChat();

  const [input, setInput] = useState('');
  const [votes, setVotes] = useState<Record<string, string>>({});
  const msgsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = isPreparingAnswer || isGeneratingAnswer;
  const empty = conversation.length === 0;

  useEffect(() => {
    const el = msgsRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  });

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    submitQuery(q);
    setInput('');
  }

  function onVote(id: string, reaction: 'upvote' | 'downvote') {
    if (!id || votes[id]) return;
    addFeedback(id, reaction);
    setVotes((prev) => ({ ...prev, [id]: reaction }));
  }

  function onReset() {
    resetConversation();
    setVotes({});
  }

  function renderInput() {
    return (
      <form className="dg-chat-input-area" onSubmit={onSubmit}>
        <div className="dg-chat-input-row">
          <input
            ref={inputRef}
            className="dg-input dg-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about Deepgram…"
            disabled={busy}
          />
          {busy ? (
            <button type="button" className="dg-btn dg-btn--ghost dg-btn--icon-only" onClick={stopGeneration} title="Stop generating">
              <StopIcon />
            </button>
          ) : (
            <button type="submit" className="dg-btn dg-btn--secondary dg-btn--icon-only" disabled={!input.trim()} title="Send">
              <PaperPlaneIcon />
            </button>
          )}
        </div>
        {!empty && (
          <div className="dg-chat-input-actions">
            <button type="button" className="dg-btn dg-btn--sm dg-btn--ghost" onClick={onReset}>
              New conversation
            </button>
          </div>
        )}
      </form>
    );
  }

  if (empty && !busy) {
    return (
      <div className="dg-chat-chat">
        <div className="dg-chat-messages" ref={msgsRef}>
          <div className="dg-chat-empty-state">
            <div className="dg-chat-empty-icon">
              <CommentsIcon style={{ fontSize: '3em' }} />
            </div>
            <h2 className="dg-chat-empty-title">Ask Deepgram AI</h2>
            <p className="dg-chat-empty-subtitle">
              Get instant answers about Deepgram&rsquo;s products, APIs, and documentation.
            </p>
            <div className="dg-chat-examples">
              {EXAMPLES.map((q, i) => (
                <button key={i} className="dg-btn dg-btn--sm dg-btn--ghost" onClick={() => submitQuery(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
        {renderInput()}
      </div>
    );
  }

  return (
    <div className="dg-chat-chat">
      <div className="dg-chat-messages" ref={msgsRef}>
        {conversation.map((qa, i) => {
          const isStreaming = qa.status === 'streaming';
          const qaVote = qa.id ? votes[qa.id] : null;

          return (
            <Fragment key={qa.id || `qa-${i}`}>
              <div className="dg-chat-message dg-chat-message-question">
                <div className="dg-chat-message-label dg-chat-label-you">You</div>
                <div className="dg-chat-message-content">{qa.question}</div>
              </div>
              <div className={`dg-chat-message dg-chat-message-answer${isStreaming ? ' dg-chat-streaming' : ''}`}>
                <div className="dg-chat-message-label">Deepgram AI</div>
                {qa.answer ? (
                  <div
                    className="dg-chat-message-content dg-prose"
                    dangerouslySetInnerHTML={{ __html: marked.parse(qa.answer) as string }}
                  />
                ) : (
                  <div className="dg-chat-message-content">
                    <div className="dg-chat-loading-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                {qa.sources && qa.sources.length > 0 && (
                  <div className="dg-chat-sources">
                    <span className="dg-chat-message-label">Sources</span>
                    <div className="dg-chat-sources-list">
                      {qa.sources.map((s, si) => (
                        <a
                          key={si}
                          className="dg-btn dg-btn--sm dg-btn--ghost dg-chat-source-link"
                          href={s.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{s.title || s.source_url}</span>
                          {s.source_type && (
                            <span className="dg-chat-source-type">{s.source_type}</span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {!isStreaming && qa.id && qa.isFeedbackSubmissionEnabled && (
                  <div className="dg-chat-feedback">
                    <span className="dg-chat-feedback-label">Was this helpful?</span>
                    <button
                      className={`dg-btn dg-btn--sm dg-btn--ghost dg-btn--icon-only dg-chat-feedback-btn${qaVote === 'upvote' ? ' active' : ''}`}
                      onClick={() => onVote(qa.id!, 'upvote')}
                      title="Helpful"
                    >
                      <ThumbsUpIcon />
                    </button>
                    <button
                      className={`dg-btn dg-btn--sm dg-btn--ghost dg-btn--icon-only dg-chat-feedback-btn${qaVote === 'downvote' ? ' active' : ''}`}
                      onClick={() => onVote(qa.id!, 'downvote')}
                      title="Not helpful"
                    >
                      <ThumbsDownIcon />
                    </button>
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {error && <div className="dg-status dg-status--error">{error}</div>}
      {renderInput()}
    </div>
  );
}
