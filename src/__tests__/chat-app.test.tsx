import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Set up mock for useChat before importing component
const mockSubmitQuery = vi.fn();
const mockResetConversation = vi.fn();
const mockAddFeedback = vi.fn();
const mockStopGeneration = vi.fn();

interface MockSource {
  title: string;
  source_url: string;
  source_type?: string;
}

interface MockConversationItem {
  id?: string;
  question: string;
  answer: string;
  status: string;
  sources?: MockSource[];
  isFeedbackSubmissionEnabled?: boolean;
}

interface MockChatState {
  conversation: MockConversationItem[];
  submitQuery: typeof mockSubmitQuery;
  isGeneratingAnswer: boolean;
  isPreparingAnswer: boolean;
  resetConversation: typeof mockResetConversation;
  addFeedback: typeof mockAddFeedback;
  stopGeneration: typeof mockStopGeneration;
  error: string | null;
}

const defaultChatState: MockChatState = {
  conversation: [],
  submitQuery: mockSubmitQuery,
  isGeneratingAnswer: false,
  isPreparingAnswer: false,
  resetConversation: mockResetConversation,
  addFeedback: mockAddFeedback,
  stopGeneration: mockStopGeneration,
  error: null,
};

let chatState: MockChatState = { ...defaultChatState };

vi.mock('@kapaai/react-sdk', () => ({
  useChat: () => chatState,
}));

import { ChatApp } from '../chat-app';

describe('ChatApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chatState = { ...defaultChatState };
  });

  describe('empty state', () => {
    it('renders empty state with title', () => {
      render(<ChatApp />);
      expect(screen.getByText('Ask Deepgram AI')).toBeInTheDocument();
    });

    it('renders example questions', () => {
      render(<ChatApp />);
      expect(screen.getByText('How do I get started with Deepgram?')).toBeInTheDocument();
      expect(screen.getByText('How do I transcribe audio?')).toBeInTheDocument();
      expect(screen.getByText('What speech models are available?')).toBeInTheDocument();
      expect(screen.getByText('How do I use text-to-speech?')).toBeInTheDocument();
    });

    it('submits query when example is clicked', async () => {
      render(<ChatApp />);
      const exampleBtn = screen.getByText('How do I transcribe audio?');
      fireEvent.click(exampleBtn);

      expect(mockSubmitQuery).toHaveBeenCalledWith('How do I transcribe audio?');
    });

    it('renders input field', () => {
      render(<ChatApp />);
      expect(screen.getByPlaceholderText(/Ask a question/)).toBeInTheDocument();
    });
  });

  describe('input handling', () => {
    it('submits query on form submit', async () => {
      const user = userEvent.setup();
      render(<ChatApp />);

      const input = screen.getByPlaceholderText(/Ask a question/);
      await user.type(input, 'test query');
      await user.keyboard('{Enter}');

      expect(mockSubmitQuery).toHaveBeenCalledWith('test query');
    });

    it('clears input after submission', async () => {
      const user = userEvent.setup();
      render(<ChatApp />);

      const input = screen.getByPlaceholderText(/Ask a question/) as HTMLInputElement;
      await user.type(input, 'test query');
      await user.keyboard('{Enter}');

      expect(input.value).toBe('');
    });

    it('does not submit empty input', async () => {
      const user = userEvent.setup();
      render(<ChatApp />);

      const input = screen.getByPlaceholderText(/Ask a question/);
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockSubmitQuery).not.toHaveBeenCalled();
    });

    it('does not submit whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<ChatApp />);

      const input = screen.getByPlaceholderText(/Ask a question/);
      await user.type(input, '   ');
      await user.keyboard('{Enter}');

      expect(mockSubmitQuery).not.toHaveBeenCalled();
    });

    it('disables input when generating', () => {
      chatState = { ...defaultChatState, isGeneratingAnswer: true, conversation: [{ question: 'hi', answer: '', status: 'streaming' }] };
      render(<ChatApp />);

      const input = screen.getByPlaceholderText(/Ask a question/) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('shows stop button when generating', () => {
      chatState = { ...defaultChatState, isGeneratingAnswer: true, conversation: [{ question: 'hi', answer: '', status: 'streaming' }] };
      render(<ChatApp />);

      expect(screen.getByTitle('Stop generating')).toBeInTheDocument();
    });

    it('calls stopGeneration when stop button clicked', () => {
      chatState = { ...defaultChatState, isGeneratingAnswer: true, conversation: [{ question: 'hi', answer: '', status: 'streaming' }] };
      render(<ChatApp />);

      fireEvent.click(screen.getByTitle('Stop generating'));
      expect(mockStopGeneration).toHaveBeenCalled();
    });
  });

  describe('conversation rendering', () => {
    it('renders question and answer', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'What is Deepgram?',
          answer: 'Deepgram is an AI speech platform.',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: false,
        }],
      };

      render(<ChatApp />);

      expect(screen.getByText('What is Deepgram?')).toBeInTheDocument();
      expect(screen.getByText('You')).toBeInTheDocument();
      expect(screen.getByText('Deepgram AI')).toBeInTheDocument();
    });

    it('shows loading dots when answer is pending', () => {
      chatState = {
        ...defaultChatState,
        isPreparingAnswer: true,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: '',
          status: 'preparing',
          sources: [],
          isFeedbackSubmissionEnabled: false,
        }],
      };

      render(<ChatApp />);
      expect(document.querySelector('.dg-chat-loading-dots')).toBeInTheDocument();
    });

    it('shows "New conversation" button when conversation exists', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: false,
        }],
      };

      render(<ChatApp />);
      expect(screen.getByText('New conversation')).toBeInTheDocument();
    });

    it('calls resetConversation when "New conversation" clicked', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: false,
        }],
      };

      render(<ChatApp />);
      fireEvent.click(screen.getByText('New conversation'));
      expect(mockResetConversation).toHaveBeenCalled();
    });
  });

  describe('sources', () => {
    it('renders source links', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          isFeedbackSubmissionEnabled: false,
          sources: [{
            title: 'Getting Started',
            source_url: 'https://developers.deepgram.com/docs/getting-started',
            source_type: 'docs',
          }],
        }],
      };

      render(<ChatApp />);
      const link = screen.getByText('Getting Started');
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', 'https://developers.deepgram.com/docs/getting-started');
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
    });

    it('renders source type badge', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          isFeedbackSubmissionEnabled: false,
          sources: [{
            title: 'Getting Started',
            source_url: 'https://example.com',
            source_type: 'docs',
          }],
        }],
      };

      render(<ChatApp />);
      expect(screen.getByText('docs')).toBeInTheDocument();
    });
  });

  describe('feedback', () => {
    it('renders feedback buttons when enabled', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: true,
        }],
      };

      render(<ChatApp />);
      expect(screen.getByTitle('Helpful')).toBeInTheDocument();
      expect(screen.getByTitle('Not helpful')).toBeInTheDocument();
    });

    it('calls addFeedback with upvote', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: true,
        }],
      };

      render(<ChatApp />);
      fireEvent.click(screen.getByTitle('Helpful'));
      expect(mockAddFeedback).toHaveBeenCalledWith('q1', 'upvote');
    });

    it('calls addFeedback with downvote', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: true,
        }],
      };

      render(<ChatApp />);
      fireEvent.click(screen.getByTitle('Not helpful'));
      expect(mockAddFeedback).toHaveBeenCalledWith('q1', 'downvote');
    });

    it('prevents voting twice on the same answer', () => {
      chatState = {
        ...defaultChatState,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'answer',
          status: 'complete',
          sources: [],
          isFeedbackSubmissionEnabled: true,
        }],
      };

      render(<ChatApp />);
      fireEvent.click(screen.getByTitle('Helpful'));
      fireEvent.click(screen.getByTitle('Not helpful'));

      // Only the first vote should register
      expect(mockAddFeedback).toHaveBeenCalledTimes(1);
    });

    it('does not show feedback buttons while streaming', () => {
      chatState = {
        ...defaultChatState,
        isGeneratingAnswer: true,
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: 'partial answer',
          status: 'streaming',
          sources: [],
          isFeedbackSubmissionEnabled: true,
        }],
      };

      render(<ChatApp />);
      expect(screen.queryByTitle('Helpful')).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('displays error message', () => {
      chatState = {
        ...defaultChatState,
        error: 'Something went wrong',
        conversation: [{
          id: 'q1',
          question: 'test',
          answer: '',
          status: 'error',
          sources: [],
          isFeedbackSubmissionEnabled: false,
        }],
      };

      render(<ChatApp />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
