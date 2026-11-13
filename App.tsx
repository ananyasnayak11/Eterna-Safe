
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  ShieldCheck, LayoutDashboard, WalletCards, FolderLock, Users, HeartPulse,
  KeyRound, Bell, Search, Plus, ChevronDown, ArrowUpRight, FileText, Clock3,
  ShieldAlert, CheckCircle2, MoreHorizontal, Landmark, Umbrella, Home,
  Activity, Settings, HelpCircle, Menu, X, LockKeyhole, UploadCloud,
  CalendarDays, CircleCheck, AlertTriangle, Eye, Download, Fingerprint
} from 'lucide-react'

type Page =
  | 'Overview'
  | 'My assets'
  | 'Secure vault'
  | 'Guardians'
  | 'Emergency access'
  | 'Legacy access'
  | 'Activity log'

type Asset = {
  name: string
  type: string
  institution: string
  value: string
  nominee: string
  icon: 'bank' | 'insurance' | 'home'
  color: string
}

type UploadedDoc = {
  id: string
  name: string
  type: string
  size: number
  folder: string
  file: File
}

const initialAssets: Asset[] = [
  {
    name: 'Savings account',
    type: 'Bank account',
    institution: 'HDFC Bank',
    value: '•••• 4821',
    nominee: 'Priya Sharma',
    icon: 'bank',
    color: 'blue'
  },
  {
    name: 'Fixed Deposit',
    type: 'Fixed deposit',
    institution: 'State Bank of India',
    value: '₹5,00,000',
    nominee: 'Arjun Sharma',
    icon: 'bank',
    color: 'violet'
  },
  {
    name: 'Family health cover',
    type: 'Insurance',
    institution: 'Star Health',
    value: 'Policy •• 9032',
    nominee: 'Priya Sharma',
    icon: 'insurance',
    color: 'mint'
  },
  {
    name: 'Residential property',
    type: 'Property',
    institution: 'Property documents',
    value: '1 document',
    nominee: 'Not set',
    icon: 'home',
    color: 'amber'
  }
]

const nav: { name: Page; icon: any }[] = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'My assets', icon: WalletCards },
  { name: 'Secure vault', icon: FolderLock },
  { name: 'Guardians', icon: Users },
  { name: 'Emergency access', icon: HeartPulse },
  { name: 'Legacy access', icon: KeyRound },
  { name: 'Activity log', icon: Activity }
]

function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [assets, setAssets] = useState(initialAssets)

  const [showAsset, setShowAsset] = useState(false)
  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState('Bank account')

  const [notice, setNotice] = useState('')
  const [emergencyRequested, setEmergencyRequested] = useState(false)
  const [legacyVerified, setLegacyVerified] = useState(false)

  const [search, setSearch] = useState('')
  const [expandedFolder, setExpandedFolder] = useState('Insurance')

  const [activity, setActivity] = useState([
    'You signed in to Eterna Safe',
    'Insurance folder permissions reviewed',
    'Priya Sharma was added as a guardian'
  ])

  // File upload states
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])
  const [uploadFolder, setUploadFolder] = useState('Insurance')
  const [uploading, setUploading] = useState(false)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)

  const filteredAssets = useMemo(
    () =>
      assets.filter(a =>
        `${a.name} ${a.type} ${a.institution}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [assets, search]
  )

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(''), 2800)
  }

  const addActivity = (s: string) => {
    setActivity(prev => [s, ...prev])
  }

  const addAsset = () => {
    if (!assetName.trim()) {
      flash('Please enter an asset name')
      return
    }

    const newAsset: Asset = {
      name: assetName,
      type: assetType,
      institution: 'Added manually',
      value: 'Details pending',
      nominee: 'Not set',
      icon: assetType === 'Insurance' ? 'insurance' : 'bank',
      color: 'blue'
    }

    setAssets(prev => [newAsset, ...prev])
    addActivity(`Added ${assetName} to My assets`)

    setAssetName('')
    setShowAsset(false)
    flash('Asset added to your registry')
  }

  // Open the actual device file picker
  const openFilePicker = (folder: string) => {
    setUploadFolder(folder)

    if (uploadInputRef.current) {
      uploadInputRef.current.value = ''
      uploadInputRef.current.click()
    }
  }

  // Handle selected files
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const files = Array.from(input.files || [])

    if (files.length === 0) return

    // Clear the input so the same file can be selected again later
    input.value = ''

    setUploading(true)
    flash('Uploading document...')

    // Small delay for the upload demonstration
    window.setTimeout(() => {
      if (uploadFolder === 'Emergency evidence') {
        const selectedFile = files[0]

        setEvidenceFile(selectedFile)
        addActivity(`Emergency evidence attached: ${selectedFile.name}`)
      } else {
        const newDocs: UploadedDoc[] = files.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          name: file.name,
          type: file.type || 'Unknown file',
          size: file.size,
          folder: uploadFolder,
          file
        }))

        setUploadedDocs(prev => [...newDocs, ...prev])

        addActivity(
          `${files.length} file(s) uploaded to ${uploadFolder}`
        )
      }

      setUploading(false)
      flash('File uploaded successfully!')
    }, 700)
  }

  // Remove an uploaded file
  const removeUploadedFile = (id: string) => {
    const documentToRemove = uploadedDocs.find(doc => doc.id === id)

    setUploadedDocs(prev => prev.filter(doc => doc.id !== id))

    if (documentToRemove) {
      addActivity(`Removed ${documentToRemove.name} from ${documentToRemove.folder}`)
    }

    flash('File removed successfully')
  }

  // Preview an uploaded document
  const previewUploadedFile = (file: File) => {
    const url = URL.createObjectURL(file)
    window.open(url, '_blank', 'noopener,noreferrer')

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 60000)
  }

  const pageTitle =
    page === 'Overview' ? 'Good morning, Ananya' : page

  const pageSubtitle =
    page === 'Overview'
      ? 'Here’s what’s happening with your family vault today.'
      : ({
          'My assets':
            'Keep track of the financial and important assets you have registered.',
          'Secure vault':
            'Your important documents, organised and protected.',
          Guardians:
            'People you trust, with access you control.',
          'Emergency access':
            'A carefully verified path for urgent situations.',
          'Legacy access':
            'A structured process for your family after official verification.',
          'Activity log':
            'A transparent record of important vault activity.'
        } as Record<string, string>)[page]

  const iconFor = (a: Asset) =>
    a.icon === 'insurance' ? (
      <Umbrella />
    ) : a.icon === 'home' ? (
      <Home />
    ) : (
      <Landmark />
    )

  return (
    <div className="app-shell">

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={22} />
          </div>

          <div>
            <strong>eterna<span>safe</span></strong>
            <small>YOUR FAMILY. YOUR PEACE.</small>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav>
          {nav.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${page === item.name ? 'active' : ''}`}
                onClick={() => {
                  setPage(item.name)
                  setMobileOpen(false)
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>

                {item.name === 'Emergency access' && (
                  <i className="nav-dot" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <div className="security-icon">
              <LockKeyhole size={17} />
            </div>

            <strong>Your vault is protected</strong>
            <p>Documents are encrypted before storage.</p>

            <div className="security-status">
              <span /> Security status: active
            </div>
          </div>

          <button className="nav-item">
            <Settings size={18} />Settings
          </button>

          <button className="nav-item">
            <HelpCircle size={18} />Help & support
          </button>

          <div className="profile">
            <div className="avatar">AS</div>

            <div className="profile-text">
              <strong>Ananya Sharma</strong>
              <small>Vault owner</small>
            </div>

            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>

          <div className="crumb">
            Workspace <span>/</span> <b>{page}</b>
          </div>

          <div className="top-actions">
            <div className="secure-pill">
              <span /> End-to-end protection
            </div>

            <button
              className="icon-button"
              onClick={() => flash('You’re all caught up!')}
            >
              <Bell size={18} />
              <i />
            </button>

            <div className="top-avatar">AS</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">ETERNA SAFE WORKSPACE</div>

              <h1>
                {pageTitle}
                {page === 'Overview' && (
                  <span className="wave"> ✨</span>
                )}
              </h1>

              <p>{pageSubtitle}</p>
            </div>

            {page === 'My assets' && (
              <button
                className="primary-btn"
                onClick={() => setShowAsset(true)}
              >
                <Plus size={17} /> Add an asset
              </button>
            )}
          </div>

          {page === 'Overview' && (
            <Overview
              assets={assets}
              setPage={setPage}
              flash={flash}
            />
          )}

          {page === 'My assets' && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Registered assets</h2>
                  <p>
                    Information you’ve chosen to keep in your vault.
                  </p>
                </div>

                <div className="searchbox">
                  <Search size={16} />

                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search assets"
                  />
                </div>
              </div>

              <div className="asset-list">
                {filteredAssets.map((a, i) => (
                  <div className="asset-row" key={a.name + i}>
                    <div className={`asset-icon ${a.color}`}>
                      {iconFor(a)}
                    </div>

                    <div className="asset-main">
                      <strong>{a.name}</strong>
                      <small>
                        {a.institution} · {a.type}
                      </small>
                    </div>

                    <div className="asset-value">
                      <strong>{a.value}</strong>
                      <small>Reference</small>
                    </div>

                    <div className="asset-nominee">
                      <strong>{a.nominee}</strong>
                      <small>Nominee</small>
                    </div>

                    <span className="status-chip">
                      <span /> Registered
                    </span>

                    <button
                      className="dots"
                      onClick={() =>
                        flash('Asset details opened in demo mode')
                      }
                    >
                      <MoreHorizontal />
                    </button>
                  </div>
                ))}
              </div>

              <div className="panel-foot">
                <span>
                  Showing {filteredAssets.length} of {assets.length} assets
                </span>

                <span>
                  Keep your details up to date <ArrowUpRight size={14} />
                </span>
              </div>
            </section>
          )}

          {page === 'Secure vault' && (
            <Vault
              expandedFolder={expandedFolder}
              setExpandedFolder={setExpandedFolder}
              flash={flash}
              uploadedDocs={uploadedDocs}
              onUpload={openFilePicker}
              onRemove={removeUploadedFile}
              onPreview={previewUploadedFile}
              uploading={uploading}
            />
          )}

          {page === 'Guardians' && (
            <Guardians
              flash={flash}
              addActivity={addActivity}
            />
          )}

          {page === 'Emergency access' && (
            <Emergency
              requested={emergencyRequested}
              setRequested={setEmergencyRequested}
              flash={flash}
              addActivity={addActivity}
              onUpload={() => openFilePicker('Emergency evidence')}
              evidenceFile={evidenceFile}
            />
          )}

          {page === 'Legacy access' && (
            <Legacy
              verified={legacyVerified}
              setVerified={setLegacyVerified}
              flash={flash}
              addActivity={addActivity}
            />
          )}

          {page === 'Activity log' && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Recent activity</h2>
                  <p>
                    Actions performed in your Eterna Safe workspace.
                  </p>
                </div>

                <span className="status-chip">
                  <span /> Live demo log
                </span>
              </div>

              <div className="timeline">
                {activity.map((a, i) => (
                  <div className="timeline-row" key={i}>
                    <div className="timeline-icon">
                      <Activity size={16} />
                    </div>

                    <div>
                      <strong>{a}</strong>
                      <small>
                        {i === 0 ? 'Just now' : `${i + 1} hours ago`}
                        {' · '}Ananya Sharma
                      </small>
                    </div>

                    <span className="log-check">
                      <CheckCircle2 size={16} />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="footer">
            <span>© 2025 Eterna Safe</span>

            <span>
              <ShieldCheck size={14} /> Privacy first. Always.
            </span>

            <span>Prototype demonstration · Sample data</span>
          </footer>
        </div>
      </main>

      {/* Hidden file input used by the upload buttons */}
      <input
        ref={uploadInputRef}
        type="file"
        hidden
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
        onChange={handleFileUpload}
      />

      {showAsset && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAsset(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-x"
              onClick={() => setShowAsset(false)}
            >
              <X />
            </button>

            <div className="modal-icon">
              <WalletCards />
            </div>

            <h2>Add a new asset</h2>
            <p>Add a record to your private asset registry.</p>

            <label>Asset name</label>

            <input
              value={assetName}
              onChange={e => setAssetName(e.target.value)}
              placeholder="e.g. Retirement savings account"
            />

            <label>Asset category</label>

            <select
              value={assetType}
              onChange={e => setAssetType(e.target.value)}
            >
              <option>Bank account</option>
              <option>Fixed deposit</option>
              <option>Insurance</option>
              <option>Property</option>
              <option>Investment</option>
            </select>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowAsset(false)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={addAsset}
              >
                Add asset
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}
    </div>
  )
}

function Overview({
  assets,
  setPage,
  flash
}: {
  assets: Asset[]
  setPage: (p: Page) => void
  flash: (s: string) => void
}) {
  return (
    <>
      <div className="hero-banner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <ShieldCheck size={14} /> YOUR LEGACY, SAFEGUARDED
          </div>

          <h2>
            Peace of mind starts
            <br />
            with being prepared.
          </h2>

          <p>
            Your important information, thoughtfully organised and shared
            only when it should be.
          </p>

          <button
            className="hero-btn"
            onClick={() => setPage('Secure vault')}
          >
            Explore your secure vault <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="hero-art">
          <div className="orb orb-one" />
          <div className="orb orb-two" />

          <div className="shield-illustration">
            <ShieldCheck size={62} />
            <div className="shield-glow" />
          </div>

          <div className="floating-tag">
            <LockKeyhole size={14} /> Encrypted vault
          </div>

          <div className="floating-check">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      <div className="section-title">
        <div>
          <h2>Your vault at a glance</h2>
          <p>A clear picture of what you’ve organised.</p>
        </div>

        <button
          className="text-link"
          onClick={() => setPage('My assets')}
        >
          View all assets <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="stats-grid">
        <Stat
          icon={<WalletCards />}
          label="Registered assets"
          value={String(assets.length).padStart(2, '0')}
          note="Across your records"
          tone="blue"
        />

        <Stat
          icon={<FolderLock />}
          label="Vault documents"
          value="12"
          note="Across 4 folders"
          tone="purple"
        />

        <Stat
          icon={<Users />}
          label="Trusted guardians"
          value="02"
          note="Access configured"
          tone="green"
        />

        <Stat
          icon={<ShieldCheck />}
          label="Security status"
          value="Active"
          note="Protection enabled"
          tone="gold"
        />
      </div>

      <div className="overview-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Important reminders</h2>
              <p>Stay ahead of upcoming dates.</p>
            </div>

            <button
              className="dots"
              onClick={() => flash('Reminder preferences opened')}
            >
              <MoreHorizontal />
            </button>
          </div>

          <div className="reminder">
            <div className="reminder-date">
              <b>18</b>
              <small>JUN</small>
            </div>

            <div className="reminder-info">
              <strong>Fixed Deposit maturity</strong>
              <small>State Bank of India · FD •• 2048</small>
            </div>

            <span className="due-chip">In 12 days</span>
          </div>

          <div className="reminder">
            <div className="reminder-date pale">
              <b>02</b>
              <small>JUL</small>
            </div>

            <div className="reminder-info">
              <strong>Health policy renewal</strong>
              <small>Star Health · Policy •• 9032</small>
            </div>

            <span className="due-chip neutral">In 26 days</span>
          </div>

          <button
            className="panel-link"
            onClick={() => flash('All reminders displayed in this demo')}
          >
            See all reminders <ArrowUpRight size={14} />
          </button>
        </section>

        <section className="panel guardian-panel">
          <div className="panel-head">
            <div>
              <h2>Your guardians</h2>
              <p>Your trusted circle.</p>
            </div>

            <button
              className="text-link"
              onClick={() => setPage('Guardians')}
            >
              Manage <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="guardian-mini">
            <div className="guardian-avatar coral">PS</div>

            <div className="guardian-details">
              <strong>Priya Sharma</strong>
              <small>Sister · Insurance, Medical</small>
            </div>

            <span className="verified-label">
              <CheckCircle2 size={14} /> Verified
            </span>
          </div>

          <div className="guardian-mini">
            <div className="guardian-avatar bluebg">AS</div>

            <div className="guardian-details">
              <strong>Arjun Sharma</strong>
              <small>Brother · Property, Finance</small>
            </div>

            <span className="verified-label">
              <CheckCircle2 size={14} /> Verified
            </span>
          </div>

          <div className="guardian-note">
            <LockKeyhole size={15} />
            Guardians can only access folders you permit.
          </div>
        </section>
      </div>

      <div className="bottom-callout">
        <div className="callout-icon">
          <Fingerprint size={22} />
        </div>

        <div>
          <strong>Your privacy stays in your hands.</strong>
          <p>
            Access is permission-based, and important actions are recorded.
          </p>
        </div>

        <button onClick={() => setPage('Guardians')}>
          Review permissions <ArrowUpRight size={15} />
        </button>
      </div>
    </>
  )
}

function Stat({
  icon,
  label,
  value,
  note,
  tone
}: {
  icon: any
  label: string
  value: string
  note: string
  tone: string
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  )
}

// SECURE VAULT WITH WORKING FILE UPLOADS
function Vault({
  expandedFolder,
  setExpandedFolder,
  flash,
  uploadedDocs,
  onUpload,
  onRemove,
  onPreview,
  uploading
}: {
  expandedFolder: string
  setExpandedFolder: (s: string) => void
  flash: (s: string) => void
  uploadedDocs: UploadedDoc[]
  onUpload: (folder: string) => void
  onRemove: (id: string) => void
  onPreview: (file: File) => void
  uploading: boolean
}) {
  const folders = [
    {
      name: 'Insurance',
      desc: 'Policies, claims and coverage',
      count: 4,
      icon: <Umbrella />,
      tone: 'mint',
      docs: [
        'Health Insurance Policy.pdf',
        'Life Cover Certificate.pdf',
        'Premium Receipt 2025.pdf'
      ]
    },
    {
      name: 'Medical',
      desc: 'Health records and medical documents',
      count: 3,
      icon: <HeartPulse />,
      tone: 'rose',
      docs: [
        'Medical Summary.pdf',
        'Emergency Contact.pdf'
      ]
    },
    {
      name: 'Finance',
      desc: 'Bank, FD and investment records',
      count: 3,
      icon: <Landmark />,
      tone: 'blue',
      docs: [
        'FD Advice.pdf',
        'Savings Account Details.pdf'
      ]
    },
    {
      name: 'Property',
      desc: 'Ownership and legal documents',
      count: 2,
      icon: <Home />,
      tone: 'amber',
      docs: [
        'Property Deed.pdf',
        'Tax Receipt.pdf'
      ]
    }
  ]

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="vault-layout">
      <section className="panel folder-panel">
        <div className="panel-head">
          <div>
            <h2>Your folders</h2>
            <p>Choose a folder to view its documents.</p>
          </div>

          <button
            className="primary-btn"
            disabled={!expandedFolder || uploading}
            onClick={() => onUpload(expandedFolder)}
          >
            <UploadCloud size={16} />
            {uploading ? 'Uploading...' : 'Upload file'}
          </button>
        </div>

        {folders.map(f => {
          const folderUploads = uploadedDocs.filter(
            doc => doc.folder === f.name
          )

          return (
            <div key={f.name}>
              <button
                className={`folder-row ${
                  expandedFolder === f.name ? 'selected' : ''
                }`}
                onClick={() =>
                  setExpandedFolder(
                    expandedFolder === f.name ? '' : f.name
                  )
                }
              >
                <div className={`folder-icon ${f.tone}`}>
                  {f.icon}
                </div>

                <div className="folder-info">
                  <strong>{f.name}</strong>
                  <small>{f.desc}</small>
                </div>

                <span className="folder-count">
                  {f.count + folderUploads.length} files
                </span>

                <ChevronDown
                  className={
                    expandedFolder === f.name ? 'rotated' : ''
                  }
                  size={17}
                />
              </button>

              {expandedFolder === f.name && (
                <div className="folder-docs">
                  {f.docs.map(d => (
                    <div className="doc-row" key={d}>
                      <div className="doc-icon">
                        <FileText size={17} />
                      </div>

                      <div>
                        <strong>{d}</strong>
                        <small>
                          Sample document · Demo view
                        </small>
                      </div>

                      <button
                        className="dots"
                        title="Sample document"
                        onClick={() =>
                          flash('This is a sample document in the prototype')
                        }
                      >
                        <Eye size={17} />
                      </button>
                    </div>
                  ))}

                  {folderUploads.map(doc => (
                    <div className="doc-row uploaded-doc" key={doc.id}>
                      <div className="doc-icon">
                        <FileText size={17} />
                      </div>

                      <div>
                        <strong>{doc.name}</strong>
                        <small>
                          Uploaded document · {formatSize(doc.size)}
                        </small>
                      </div>

                      <button
                        className="dots"
                        title="Preview document"
                        onClick={() => onPreview(doc.file)}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="dots"
                        title="Remove document"
                        onClick={() => onRemove(doc.id)}
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}

                  {folderUploads.length > 0 && (
                    <div className="upload-demo">
                      <CheckCircle2 size={15} />
                      {folderUploads.length} uploaded document(s)
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </section>

      <aside className="vault-side">
        <div className="vault-info-card">
          <div className="vault-info-icon">
            <LockKeyhole />
          </div>

          <h3>Private by design</h3>

          <p>
            Your documents are intended to be encrypted on your device
            before they are stored.
          </p>

          <div className="mini-line">
            <CheckCircle2 size={15} /> Client-side encryption design
          </div>

          <div className="mini-line">
            <CheckCircle2 size={15} /> Folder-level permissions
          </div>

          <div className="mini-line">
            <CheckCircle2 size={15} /> Access activity records
          </div>
        </div>

        <div className="hint-card">
          <ShieldAlert size={18} />
          <strong>Remember</strong>
          <p>
            Only upload documents you are comfortable storing in your
            personal vault.
          </p>
        </div>
      </aside>
    </div>
  )
}

function Guardians({
  flash,
  addActivity
}: {
  flash: (s: string) => void
  addActivity: (s: string) => void
}) {
  const [added, setAdded] = useState(false)

  return (
    <div className="guardian-page-grid">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Trusted guardians</h2>
            <p>People who may request access under your rules.</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setAdded(true)
              addActivity('A guardian invitation was created')
              flash('Demo guardian invitation created')
            }}
          >
            <Plus size={16} /> Add guardian
          </button>
        </div>

        <div className="guardian-card">
          <div className="guardian-avatar coral large">PS</div>

          <div className="guardian-details">
            <strong>Priya Sharma</strong>
            <small>priya.sharma@email.com · Sister</small>

            <span className="verified-label">
              <CheckCircle2 size={14} /> Identity verified (demo)
            </span>
          </div>

          <div className="permission-block">
            <b>Permitted folders</b>

            <div className="permission-tags">
              <span>Insurance</span>
              <span>Medical</span>
            </div>
          </div>

          <button
            className="dots"
            onClick={() =>
              flash('Guardian settings opened in demo mode')
            }
          >
            <MoreHorizontal />
          </button>
        </div>

        <div className="guardian-card">
          <div className="guardian-avatar bluebg large">AS</div>

          <div className="guardian-details">
            <strong>Arjun Sharma</strong>
            <small>arjun.sharma@email.com · Brother</small>

            <span className="verified-label">
              <CheckCircle2 size={14} /> Identity verified (demo)
            </span>
          </div>

          <div className="permission-block">
            <b>Permitted folders</b>

            <div className="permission-tags">
              <span>Property</span>
              <span>Finance</span>
            </div>
          </div>

          <button
            className="dots"
            onClick={() =>
              flash('Guardian settings opened in demo mode')
            }
          >
            <MoreHorizontal />
          </button>
        </div>

        {added && (
          <div className="inline-success">
            <CheckCircle2 size={16} />
            Invitation created. Connect an identity provider to send it
            in a real deployment.
          </div>
        )}
      </section>

      <aside className="panel permission-summary">
        <div className="summary-shield">
          <ShieldCheck size={26} />
        </div>

        <h3>You’re in control</h3>

        <p>
          Adding someone as a guardian does not give them automatic
          access to your entire vault.
        </p>

        <div className="summary-rule">
          <LockKeyhole size={16} />
          <span>Access is limited by folder permissions.</span>
        </div>

        <div className="summary-rule">
          <Clock3 size={16} />
          <span>Emergency access follows a separate approval flow.</span>
        </div>

        <div className="summary-rule">
          <Activity size={16} />
          <span>Important actions are recorded.</span>
        </div>
      </aside>
    </div>
  )
}

// EMERGENCY ACCESS WITH SUPPORTING DOCUMENT UPLOAD
function Emergency({
  requested,
  setRequested,
  flash,
  addActivity,
  onUpload,
  evidenceFile
}: {
  requested: boolean
  setRequested: (b: boolean) => void
  flash: (s: string) => void
  addActivity: (s: string) => void
  onUpload: () => void
  evidenceFile: File | null
}) {
  const [reason, setReason] = useState('Medical emergency')

  const submitRequest = () => {
    if (!evidenceFile) {
      flash('Please attach a supporting document first')
      return
    }

    setRequested(true)

    addActivity(
      `Emergency access request submitted: ${reason}`
    )

    flash('Emergency request submitted for review')
  }

  return (
    <div className="workflow-grid">
      <section className="panel workflow-main">
        <div className="workflow-banner emergency-banner">
          <div className="workflow-banner-icon">
            <HeartPulse />
          </div>

          <div>
            <span className="eyebrow">
              OWNER-ALIVE EMERGENCY PROCESS
            </span>

            <h2>Emergency access request</h2>

            <p>
              A controlled process for situations where the owner may
              be unable to manage their information.
            </p>
          </div>
        </div>

        <div className="workflow-steps">
          <div className="step done">
            <span>1</span>
            <div>
              <b>Guardian submits request</b>
              <small>
                Choose permitted folders and provide supporting evidence.
              </small>
            </div>
          </div>

          <div className="step">
            <span>2</span>
            <div>
              <b>Two independent verifiers review</b>
              <small>
                Both pre-designated verifiers must approve the request.
              </small>
            </div>
          </div>

          <div className="step">
            <span>3</span>
            <div>
              <b>Owner is notified</b>
              <small>
                The owner can object if they are able to respond.
              </small>
            </div>
          </div>

          <div className="step">
            <span>4</span>
            <div>
              <b>Limited access may be released</b>
              <small>
                Only if all policy conditions are satisfied.
              </small>
            </div>
          </div>
        </div>

        <div className="request-box">
          <label>Request category</label>

          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            <option>Medical emergency</option>
            <option>Temporary incapacity</option>
            <option>Urgent family assistance</option>
          </select>

          <label>Supporting evidence</label>

          <button
            className="upload-demo"
            onClick={onUpload}
          >
            <UploadCloud size={18} />

            {evidenceFile
              ? evidenceFile.name
              : 'Attach supporting document'}

            <span>
              {evidenceFile ? 'Attached' : 'PDF, JPG, PNG'}
            </span>
          </button>

          {evidenceFile && (
            <div className="inline-success">
              <CheckCircle2 size={16} />
              Supporting document selected successfully.
            </div>
          )}

          <button
            className="primary-btn full-btn"
            onClick={submitRequest}
          >
            Submit demo request <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <aside className="workflow-aside">
        <div className="status-panel">
          <div className="status-top">
            <span>REQUEST STATUS</span>

            <span
              className={`status-pill ${
                requested ? 'pending' : 'ready'
              }`}
            >
              {requested ? 'Pending review' : 'Not started'}
            </span>
          </div>

          <div className="status-graphic">
            <ShieldCheck size={35} />
          </div>

          <h3>
            {requested
              ? 'Request is awaiting review'
              : 'Your emergency policy is ready'}
          </h3>

          <p>
            {requested
              ? 'The demo request has been created. Verifier approval is not simulated as a real identity check.'
              : 'Your selected guardians and folder permissions are configured in this sample workspace.'}
          </p>
        </div>

        <div className="warning-note">
          <AlertTriangle size={18} />

          <div>
            <b>Important safeguard</b>

            <p>
              Owner silence alone is never treated as proof of
              incapacity or automatic approval.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

function Legacy({
  verified,
  setVerified,
  flash,
  addActivity
}: {
  verified: boolean
  setVerified: (b: boolean) => void
  flash: (s: string) => void
  addActivity: (s: string) => void
}) {
  return (
    <div className="workflow-grid">
      <section className="panel workflow-main">
        <div className="workflow-banner legacy-banner">
          <div className="workflow-banner-icon">
            <KeyRound />
          </div>

          <div>
            <span className="eyebrow">
              DEATH-RELATED LEGACY PROCESS
            </span>

            <h2>Verified legacy release</h2>

            <p>
              A separate, policy-based workflow for authorised access
              after official death registration.
            </p>
          </div>
        </div>

        <div className="mock-label">
          <span className="mock-dot" />
          PROTOTYPE SIMULATION · MOCK REGISTRAR PORTAL
        </div>

        <div className="registrar-box">
          <div className="registrar-head">
            <div className="registrar-seal">
              <Landmark />
            </div>

            <div>
              <b>Registrar event simulator</b>
              <small>
                Demonstration only — not connected to a government database
              </small>
            </div>
          </div>

          <div className="field-grid">
            <div>
              <label>Owner reference</label>
              <input value="ETN-OWNER-1042" readOnly />
            </div>

            <div>
              <label>Event reference</label>
              <input value="REG-DEMO-2025-018" readOnly />
            </div>
          </div>

          <div className="event-description">
            <ShieldCheck size={18} />

            <span>
              Simulate an official death-registration event to
              demonstrate the proposed verification flow.
            </span>
          </div>

          <button
            className="primary-btn full-btn"
            onClick={() => {
              setVerified(true)
              addActivity(
                'Mock registrar event submitted for validation'
              )
              flash('Demo registrar event validated')
            }}
          >
            Simulate verified registrar event <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="workflow-steps compact">
          <div className={`step ${verified ? 'done' : ''}`}>
            <span>1</span>
            <div>
              <b>Registrar event received</b>
              <small>
                Authenticated source in a future production integration.
              </small>
            </div>
          </div>

          <div className={`step ${verified ? 'done' : ''}`}>
            <span>2</span>
            <div>
              <b>Event and owner reference checked</b>
              <small>
                Validate source, status, policy and duplicate event ID.
              </small>
            </div>
          </div>

          <div className={`step ${verified ? 'done' : ''}`}>
            <span>3</span>
            <div>
              <b>Permitted guardian access</b>
              <small>
                Release only the folders allowed by the owner's policy.
              </small>
            </div>
          </div>
        </div>
      </section>

      <aside className="workflow-aside">
        <div className="status-panel">
          <div className="status-top">
            <span>LEGACY STATUS</span>

            <span
              className={`status-pill ${
                verified ? 'ready' : 'pending'
              }`}
            >
              {verified ? 'Demo validated' : 'Awaiting event'}
            </span>
          </div>

          <div className="status-graphic">
            <KeyRound size={34} />
          </div>

          <h3>
            {verified
              ? 'Event accepted in demo'
              : 'Your legacy policy is prepared'}
          </h3>

          <p>
            {verified
              ? 'The simulated event passed the prototype checks. No real document or financial access has been released.'
              : 'A real release would require an authorised, authenticated registrar integration and policy validation.'}
          </p>
        </div>

        <div className="warning-note">
          <AlertTriangle size={18} />

          <div>
            <b>Prototype limitation</b>

            <p>
              This portal simulates the proposed integration. It does
              not verify real death records or contact banks.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default App
