// src/app/contact/page.jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })

      if (res.ok) {
        setSuccess(true)
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
      } else {
        const err = await res.json()
        setError(err.error || 'Failed to dispatch message.')
      }
    } catch (err) {
      console.error(err)
      setError('Connection failure. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-pad section">
      <div className="max-w-xl mx-auto text-center mb-12">
        <span className="label justify-center">Get in Touch</span>
        <h1 className="section-title mt-2 text-white">Contact Us</h1>
        <p className="mt-4 text-muted text-base leading-relaxed">
          Have a question, feedback, or sponsorship opportunity? Send a message directly to the CS Society lead!
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-[var(--surface)] border border-border p-8 rounded-none">
        {success ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-2xl">
              ✓
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Message Dispatched!</h2>
            <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto">
              Your inquiry has been successfully transmitted using Resend to the CS Society lead. We will reach back to you shortly.
            </p>
            <div className="pt-4">
              <Link href="/" className="btn text-xs px-8">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-mono">
                ERROR: {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label mb-2 block">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                  placeholder="Abdullah Khan"
                />
              </div>
              <div>
                <label className="label mb-2 block">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="label mb-2 block">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white"
                placeholder="e.g., Sponsorship Inquiry / Workshop Question"
              />
            </div>

            <div>
              <label className="label mb-2 block">Message Details</label>
              <textarea
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-4 bg-black/40 border border-border focus:border-white outline-none transition-colors text-sm text-white min-h-[160px] leading-relaxed"
                placeholder="Write your message details here..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn w-full sm:w-auto px-16 cursor-pointer"
              >
                {loading ? 'SENDING...' : 'DISPATCH MESSAGE'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
