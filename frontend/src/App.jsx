import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'other',
    description: '',
    location: ''
  })

  // Since it's a prototype, we'll connect to the simple Flask backend.
  const API_URL = 'http://127.0.0.1:5000/api/issues'

  const fetchIssues = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      // Reverse to show latest first
      setIssues(data.reverse())
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormData({ title: '', category: 'other', description: '', location: '' })
        fetchIssues() // Refresh list
      }
    } catch (error) {
      console.error('Error reporting issue:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">UrbanEye</h1>
        <p className="subtitle">AI-Powered Civic Infrastructure Management</p>
      </header>

      <main className="dashboard">
        <section className="report-section">
          <div className="glass-card">
            <h2>Report an Issue</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Issue Title</label>
                <input 
                  type="text" 
                  name="title"
                  className="form-control" 
                  placeholder="e.g. Large Pothole"
                  value={formData.title}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select 
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="road">Road & Street</option>
                  <option value="utility">Utilities (Water, Power)</option>
                  <option value="sanitation">Sanitation & Waste</option>
                  <option value="other">Other Infrastructure</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location"
                  className="form-control" 
                  placeholder="Street name or landmark"
                  value={formData.location}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  className="form-control" 
                  placeholder="Provide more details..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required 
                ></textarea>
              </div>

              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? <span className="loader"></span> : 'Submit Report'}
              </button>
            </form>
          </div>
        </section>

        <section className="feed-section">
          <div className="glass-card">
            <h2>Live Issue Feed</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="loader" style={{ borderColor: 'rgba(56,189,248,0.3)', borderTopColor: '#38bdf8' }}></span>
              </div>
            ) : issues.length === 0 ? (
               <p style={{ color: 'var(--text-secondary)' }}>No issues reported yet.</p>
            ) : (
              <div className="issues-list">
                {issues.map(issue => (
                  <div key={issue.id} className={`issue-item ${issue.category}`}>
                    <div className="issue-header">
                      <h3 className="issue-title">{issue.title}</h3>
                      <span className={`badge badge-${issue.category}`}>{issue.category}</span>
                    </div>
                    <p className="issue-body">{issue.description}</p>
                    <div className="ai-prediction">
                      <span className="ai-icon">✨</span>
                      <div>
                        <strong>UrbanAI Analysis</strong>
                        <div style={{ marginTop: '4px' }}>{issue.ai_prediction}</div>
                      </div>
                    </div>
                    <div className="issue-footer">
                      <span>📍 {issue.location}</span>
                      <span>{formatDate(issue.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
