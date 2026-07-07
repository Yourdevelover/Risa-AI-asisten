import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'

let cachedPuter = null
const getPuter = async () => {
  if (cachedPuter) return cachedPuter
  const { puter } = await import('@heyputer/puter.js')
  cachedPuter = puter
  return puter
}

const SYSTEM_PROMPT = "Berperanlah sebagai Risa, asisten pribadi Rivaldo. Jawablah pertanyaan orang lain dengan sopan dan informatif. Aturan:\n\n- Jika ditanya 'Apa yang bisa saya bantu?' → Tawarkan informasi tentang Rivaldo.\n- Jika ditanya 'Apakah ingin melihat karya Rivaldo?' atau 'Project Rivaldo?' → Arahkan ke link: https://github.com/Yourdevelover/PortfolioRivaldo\n- Jika ditanya 'Siapa itu Rivaldo?' → Jelaskan biodata sederhana: Mahasiswa Sistem Informasi Universitas Pamulang, semester 5, minat React, Laravel, SQL, GitHub.\n- Jika ditanya 'Bagaimana ia berkembang?' → Ceritakan perkembangan Rivaldo dalam belajar coding, desain, database, dan deployment.\n\nGunakan bahasa sopan, jelas, dan ramah. Jangan pernah mengaku sebagai model dari Google."

const QUICK_QUESTIONS = [
  { text: 'Perkenalkan siapa Rivaldo', query: 'siapa anda' },
  { text: 'Tampilkan karya terbaik', query: 'project apa saja yang pernah dikerjakan?' },
  { text: 'Apa yang bisa Risa bantu?', query: 'apa yang bisa saya bantu?' },
]

const SIDEBAR_ACTIONS = [
  { label: 'Lihat Risa', action: 'siapa anda' },
  { label: 'Kirim pesan ke Risa', action: 'focus' },
]

const TAB_BUTTONS = [
  { value: 'chat', label: 'Chat', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { value: 'history', label: 'Riwayat', icon: 'M12 6v6l4 2M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z' },
]

function App() {
  const [messages, setMessages] = useState([
    {
      id: 'init',
      role: 'ai',
      author: 'Risa',
      text: 'Hai, ada yang bisa saya bantu?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('risa-theme') || 'light'
    }
    return 'light'
  })
  const chatBoxRef = useRef(null)
  const inputRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('risa-theme', theme)
  }, [theme])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, loading, tab])

  const escapeHtml = useCallback((text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }, [])

  const sendMessage = useCallback(async () => {
    const message = input.trim()
    if (!message || loading) return

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      author: 'Anda',
      text: message,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const puter = await getPuter()
      const promptWithContext = SYSTEM_PROMPT + '\n\nUser: ' + message + '\nRisa:'
      const responseText = await puter.ai.chat(promptWithContext, {
        model: 'gemini-3-flash-preview',
      })

      const aiMsg = {
        id: `a-${Date.now()}`,
        role: 'ai',
        author: 'Risa',
        text: responseText,
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const errorMsg = {
        id: `e-${Date.now()}`,
        role: 'error',
        text: 'Gagal terhubung ke Risa. Periksa koneksi Anda dan coba lagi.',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }, [input])

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const sendSuggestion = useCallback(async (text) => {
    setInput(text)
    await new Promise((resolve) => setTimeout(resolve, 0))
    sendMessage()
  }, [sendMessage])

  const handleSidebarAction = useCallback((action) => {
    if (action === 'focus') {
      focusInput()
    } else {
      sendSuggestion(action)
    }
    setSidebarOpen(false)
  }, [focusInput, sendSuggestion])

  const switchTab = useCallback((next) => {
    setTab(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className="app-shell">
      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app-layout"
      >
        <aside className={`panel panel-left ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <button 
            type="button" 
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Tutup sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="panel-content">
            <div className="brand-block">
              <div className="brand-badge">R</div>
              <div>
                <p className="eyebrow">Risa AI</p>
                <h2>Asisten cerdas Rivaldo</h2>
              </div>
            </div>

            <p className="brand-description">
              Temukan jawaban cepat dan rekomendasi proyek Rivaldo, dikemas dalam UI modern yang bersih dan penuh karakter.
            </p>

            <div className="quick-panel">
              <p className="quick-title">Pertanyaan cepat</p>
              <div className="quick-list">
                {QUICK_QUESTIONS.map((item) => (
                  <button key={item.query} type="button" onClick={() => { sendSuggestion(item.query); closeSidebar() }} className="quick-item">
                    <span>{item.text}</span>
                    <span className="quick-arrow">↗</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-actions">
              <p className="quick-title">Aksi cepat</p>
              <div className="sidebar-action-list">
                {SIDEBAR_ACTIONS.map((item) => (
                  <button key={item.label} type="button" onClick={() => handleSidebarAction(item.action)} className="sidebar-action-item">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <footer className="panel-footer">
            <span>Dibuat oleh Rivaldo untuk pengalaman asisten yang elegan.</span>
            <a href="https://github.com/Yourdevelover/PortfolioRivaldo" target="_blank" rel="noopener" className="link-accent">Lihat portfolio</a>
          </footer>
        </aside>

        <main className="panel panel-right">
          <header className="chat-header">
            <div className="header-top-row">
              <motion.button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="mobile-sidebar-toggle"
                aria-label="Buka sidebar"
                whileTap={{ scale: 0.9 }}
              >
                <span className="sidebar-icon-wrapper">
                  <span className="sidebar-icon-dot" />
                  <span className="sidebar-icon-dot" />
                  <span className="sidebar-icon-dot" />
                </span>
              </motion.button>
              <div>
                <p className="eyebrow accent">Risa Assistant</p>
                <h1 className="chat-title">Asisten AI Rivaldo</h1>
              </div>
            </div>
            <button type="button" onClick={toggleTheme} className="theme-toggle" title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}>
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>
          </header>

          <div className="chat-panel">
            <div className="chat-window">
              <section className={`chat-body ${tab === 'chat' ? 'active' : 'hidden'}`} ref={chatBoxRef} role="log" aria-label="Percakapan dengan Risa">
                {messages.map((msg) => {
                  if (msg.role === 'user') {
                    return (
                      <motion.article key={msg.id} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="message message-user">
                        <div className="message-meta">
                          <span>Anda</span>
                        </div>
                        <div className="message-text" dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }} />
                      </motion.article>
                    )
                  }

                  if (msg.role === 'ai') {
                    return (
                      <motion.article key={msg.id} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="message message-ai">
                        <div className="message-meta">
                          <span>Risa</span>
                        </div>
                        <div className="message-text" dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }} />
                      </motion.article>
                    )
                  }

                  return (
                    <motion.div key={msg.id} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="message message-error">
                      {msg.text}
                    </motion.div>
                  )
                })}

                {loading && (
                  <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="message message-ai message-loading">
                    <div className="message-meta"><span>Risa</span></div>
                    <div className="typing-indicator">
                      {[0, 1, 2].map((dot) => (
                        <motion.span key={dot} animate={reduceMotion ? {} : { y: [0, -6, 0] }} transition={{ duration: 0.7, delay: dot * 0.12, repeat: Infinity, ease: 'easeInOut' }} />
                      ))}
                      <span>Risa sedang mengetik...</span>
                    </div>
                  </motion.div>
                )}
              </section>

              <section className={`history-body ${tab === 'history' ? 'active' : 'hidden'}`}>
                {messages.filter((msg) => msg.role === 'user').length > 0 ? (
                  <div className="history-grid">
                    <div className="history-banner">
                      <p className="history-title">Riwayat percakapan</p>
                      <p className="history-copy">Berikut pesan terakhir yang telah Anda kirim. Kembali lagi kapan saja untuk melanjutkan obrolan.</p>
                    </div>
                    {messages
                      .filter((msg) => msg.role === 'user')
                      .slice(-6)
                      .reverse()
                      .map((msg) => (
                        <article key={msg.id} className="history-card">
                          <p className="history-question">{msg.text}</p>
                          <span className="history-note">Pesan terakhir Anda</span>
                        </article>
                      ))}
                  </div>
                ) : (
                  <div className="history-empty-card">
                    <div className="history-empty-icon">⌛</div>
                    <h2>Riwayat kosong</h2>
                    <p>Kirim pesan dan riwayat akan muncul di sini untuk membantu Anda mengingat percakapan penting.</p>
                  </div>
                )}
              </section>

              <nav className="chat-nav" aria-label="Tampilan percakapan">
                {TAB_BUTTONS.map((item) => (
                  <button key={item.value} type="button" onClick={() => switchTab(item.value)} className={tab === item.value ? 'tab-button active' : 'tab-button'} aria-pressed={tab === item.value}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon"><path d={item.icon} /></svg>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis pesan kamu..."
              aria-label="Pesan teks"
              className="chat-input"
            />
            <button type="submit" className="chat-submit" disabled={loading}>
              <span>Kirim</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="submit-icon"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </main>
      </motion.div>
    </div>
  )
}

export default App