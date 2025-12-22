import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { messageService } from '../services/messageService'
import { userService } from '../services/userService'
import { format } from 'date-fns'
import './MessagesPage.css'

const MessagesPage = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.uid)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (uid) => {
    try {
      const data = await messageService.getMessages(uid)
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      const results = await userService.search(query)
      setSearchResults(results.filter(u => u.uid !== user.uid))
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const selectConversation = (conv) => {
    // Clear messages immediately when switching conversations
    setMessages([])
    setSelectedUser({
      uid: conv.other_uid,
      username: conv.username,
      name: conv.name,
      profile_picture: conv.profile_picture
    })
    setSearchQuery('')
    setSearchResults([])
  }

  const startNewConversation = (searchUser) => {
    // Clear messages immediately when starting new conversation
    setMessages([])
    setSelectedUser({
      uid: searchUser.uid,
      username: searchUser.username,
      name: searchUser.name,
      profile_picture: searchUser.profile_picture
    })
    setSearchQuery('')
    setSearchResults([])
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    const messageText = newMessage
    setNewMessage('') // Clear input immediately

    // Optimistic update - add message to UI immediately
    const optimisticMessage = {
      mid: Date.now(), // Temporary ID
      from_uid: user.uid,
      to_uid: selectedUser.uid,
      contents: messageText,
      post_time: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMessage])

    try {
      await messageService.sendMessage(selectedUser.uid, messageText)
      // Reload to get the real message with proper ID
      await loadMessages(selectedUser.uid)
      await loadConversations()
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.mid !== optimisticMessage.mid))
      setNewMessage(messageText) // Restore the message
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'h:mm a')
    } catch {
      return ''
    }
  }

  return (
    <div className="messages-page">
      <div className="messages-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="form-control"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="search-results-list">
            {searchResults.map(u => (
              <div
                key={u.uid}
                className="conversation-item"
                onClick={() => startNewConversation(u)}
              >
                <img
                  src={u.profile_picture || '/uploads/default-avatar.png'}
                  alt={u.username}
                  className="conv-avatar"
                />
                <div className="conv-info">
                  <span className="conv-name">{u.name}</span>
                  <span className="conv-username">@{u.username}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.other_uid}
              className={`conversation-item ${selectedUser?.uid === conv.other_uid ? 'active' : ''}`}
              onClick={() => selectConversation(conv)}
            >
              <img
                src={conv.profile_picture || '/uploads/default-avatar.png'}
                alt={conv.username}
                className="conv-avatar"
              />
              <div className="conv-info">
                <span className="conv-name">{conv.name}</span>
                <span className="conv-last-message">{conv.last_message}</span>
              </div>
              {conv.unread_count > 0 && (
                <span className="unread-badge">{conv.unread_count}</span>
              )}
            </div>
          ))}

          {conversations.length === 0 && !loading && (
            <div className="no-conversations">
              No conversations yet. Search for users to start chatting!
            </div>
          )}
        </div>
      </div>

      <div className="messages-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <img
                src={selectedUser.profile_picture || '/uploads/default-avatar.png'}
                alt={selectedUser.username}
                className="chat-avatar"
              />
              <div>
                <span className="chat-name">{selectedUser.name}</span>
                <span className="chat-username">@{selectedUser.username}</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg.mid}
                  className={`message ${msg.from_uid === user.uid ? 'from-me' : 'from-them'}`}
                >
                  <div className="message-content">{msg.contents}</div>
                  <span className="message-time">{formatTime(msg.post_time)}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="form-control"
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation or search for a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesPage
