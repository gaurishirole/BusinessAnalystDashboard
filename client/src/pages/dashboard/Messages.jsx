import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import '../../styles/Messages.css';
import { 
  Search, 
  Plus, 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Mail, 
  MailOpen, 
  Reply, 
  Trash, 
  Star 
} from 'lucide-react';
import { 
  fetchMessages, 
  createMessage, 
  markMessageAsRead, 
  updateMessageFolder 
} from '../../services/messageService';
import { useSearch } from '../../context/SearchContext';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('Inbox');
  const { searchQuery: searchTerm, setSearchQuery: setSearchTerm } = useSearch();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Message Form Fields
  const [toField, setToField] = useState('');
  const [subjectField, setSubjectField] = useState('');
  const [bodyField, setBodyField] = useState('');

  // Load messages from backend API on mount
  useEffect(() => {
    loadAllMessages();
  }, []);

  const loadAllMessages = async () => {
    setLoading(true);
    const data = await fetchMessages();
    setMessages(data);
    setLoading(false);
    
    // Select the first message in the Inbox folder initially if available
    const initialInbox = data.find(m => m.folder === 'Inbox');
    if (initialInbox) {
      setSelectedMessage(initialInbox);
    }
  };

  // Handle message click - mark as Read in API and UI
  const handleMessageClick = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'Unread') {
      const updated = await markMessageAsRead(msg.id);
      if (!updated.error) {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'Read' } : m));
      }
    }
  };

  // Compose Message Submit (POST)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!toField || !subjectField || !bodyField) return;

    const messageData = {
      sender: 'Me',
      email: toField,
      subject: subjectField,
      content: bodyField,
      folder: 'Sent',
      date_str: 'Just now'
    };

    const result = await createMessage(messageData);
    if (!result.error) {
      setMessages(prev => [result, ...prev]);
      setModalOpen(false);
      
      // Reset fields
      setToField('');
      setSubjectField('');
      setBodyField('');
    } else {
      alert('Failed to send message.');
    }
  };

  // Get counts for sidebar folders dynamically
  const getFolderCount = (folderName) => {
    return messages.filter(m => m.folder === folderName).length;
  };

  // Filter messages based on active folder and search term
  const filteredMessages = messages.filter(msg => {
    const matchesFolder = msg.folder === currentFolder;
    const matchesSearch = 
      (msg.sender || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <DashboardLayout title="Messages">
      <div className="messages-container animate-fade-in">
        {/* Left Column: Folders & Compose Button */}
        <div className="messages-sidebar">
          <button className="new-message-btn" onClick={() => {
            setToField('');
            setSubjectField('');
            setBodyField('');
            setIsReply(false);
            setModalOpen(true);
          }}>
            <Plus size={18} />
            <span>New Message</span>
          </button>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div className="folder-list">
              <div 
                className={`folder-item ${currentFolder === 'Inbox' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolder('Inbox');
                  const inboxMsg = messages.find(m => m.folder === 'Inbox');
                  setSelectedMessage(inboxMsg || null);
                }}
              >
                <div className="folder-info">
                  <Inbox size={16} />
                  <span>Inbox</span>
                </div>
                <span className="folder-count">{getFolderCount('Inbox')}</span>
              </div>

              <div 
                className={`folder-item ${currentFolder === 'Sent' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolder('Sent');
                  const sentMsg = messages.find(m => m.folder === 'Sent');
                  setSelectedMessage(sentMsg || null);
                }}
              >
                <div className="folder-info">
                  <Send size={16} />
                  <span>Sent</span>
                </div>
                <span className="folder-count">{getFolderCount('Sent')}</span>
              </div>

              <div 
                className={`folder-item ${currentFolder === 'Drafts' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolder('Drafts');
                  const draftMsg = messages.find(m => m.folder === 'Drafts');
                  setSelectedMessage(draftMsg || null);
                }}
              >
                <div className="folder-info">
                  <FileText size={16} />
                  <span>Drafts</span>
                </div>
                <span className="folder-count">{getFolderCount('Drafts')}</span>
              </div>

              <div 
                className={`folder-item ${currentFolder === 'Trash' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolder('Trash');
                  const trashMsg = messages.find(m => m.folder === 'Trash');
                  setSelectedMessage(trashMsg || null);
                }}
              >
                <div className="folder-info">
                  <Trash size={16} />
                  <span>Trash</span>
                </div>
                <span className="folder-count">{getFolderCount('Trash')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Message List & Detail View */}
        <div className="glass-panel messages-main-panel">
          {/* Middle Column: List of Messages */}
          <div className="message-list-pane">
            <div className="search-bar-container">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search Messages" 
                  className="search-input" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="message-items">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading messages...
                </div>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`message-item ${selectedMessage?.id === msg.id ? 'active' : ''} ${msg.status === 'Unread' ? 'unread' : ''}`}
                    onClick={() => handleMessageClick(msg)}
                  >
                    <div className="message-header">
                      <span className="message-sender">{msg.sender}</span>
                      <span className="message-date">{msg.date_str || msg.created_at}</span>
                    </div>
                    <div className="message-subject-line">{msg.subject}</div>
                    <div className="message-snippet">{msg.content}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <span className={`status-badge-inline ${msg.status === 'Unread' ? 'status-unread' : 'status-read'}`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No messages found
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Preview Pane */}
          <div className="preview-pane">
            {selectedMessage && selectedMessage.folder === currentFolder ? (
              <>
                <div className="preview-header">
                  <h3 className="preview-subject">{selectedMessage.subject}</h3>
                  <div className="preview-meta">
                    <div className="preview-sender-info">
                      <div className="preview-avatar">
                        {selectedMessage.sender.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="preview-sender-name">{selectedMessage.sender}</div>
                        <div className="preview-sender-email">{selectedMessage.email}</div>
                      </div>
                    </div>
                    <div className="preview-date">{selectedMessage.date_str || selectedMessage.created_at}</div>
                  </div>
                </div>

                <div className="preview-body">
                  <p>{selectedMessage.content}</p>
                </div>

                <div className="preview-actions">
                  <Button 
                    variant="primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => {
                      setToField(selectedMessage.email || '');
                      setSubjectField(selectedMessage.subject ? (selectedMessage.subject.startsWith('Re:') ? selectedMessage.subject : `Re: ${selectedMessage.subject}`) : '');
                      setBodyField('');
                      setIsReply(true);
                      setModalOpen(true);
                    }}
                  >
                    <Reply size={16} />
                    <span>Reply</span>
                  </Button>
                  
                  {selectedMessage.folder !== 'Trash' && (
                    <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={async () => {
                      const updated = await updateMessageFolder(selectedMessage.id, 'Trash');
                      if (!updated.error) {
                        setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, folder: 'Trash' } : m));
                        
                        // Pick next message in filtered view
                        const remaining = filteredMessages.filter(m => m.id !== selectedMessage.id);
                        setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
                      }
                    }}>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="preview-empty">
                <MailOpen size={48} strokeWidth={1} />
                <p>Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Composer Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isReply ? "Reply to Message" : "Compose New Message"}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <Input 
              label="To (Email)" 
              value={toField} 
              onChange={(e) => setToField(e.target.value)} 
              placeholder="recipient@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <Input 
              label="Subject" 
              value={subjectField} 
              onChange={(e) => setSubjectField(e.target.value)} 
              placeholder="Enter subject"
              required 
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea 
              className="form-textarea"
              value={bodyField} 
              onChange={(e) => setBodyField(e.target.value)} 
              placeholder="Type your message here..."
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} />
              <span>Send Message</span>
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
