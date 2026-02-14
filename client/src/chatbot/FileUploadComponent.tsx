import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface UploadedDocument {
  filename: string;
  chunk_count: number;
  text_length: number;
  storage: string;
}

const FileUploadComponent: React.FC = () => {
  const { theme, colors } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const response = await fetch('http://localhost:8000/documents');
      const data = await response.json();
      const docs = data.documents || [];
      setDocuments(docs);
      console.log(`Fetched ${docs.length} documents from server`);
    } catch (error) {
      console.warn('Could not fetch documents:', error);
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setUploadStatus({ type: null, message: '' });
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Please select a PDF file',
        });
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file first',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'info', message: 'Uploading and processing PDF...' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('PDF uploaded successfully:', {
          filename: data.filename,
          chunks_created: data.chunks_created,
          text_length: data.text_length,
        });
        setUploadStatus({
          type: 'success',
          message: `Successfully uploaded "${data.filename}" with ${data.chunks_created} chunks`,
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh documents list
        await fetchDocuments();
      } else {
        throw new Error(data.detail || 'Upload failed');
      }
    } catch (error: any) {
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload PDF. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all uploaded documents? This action cannot be undone.')) {
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'info', message: 'Deleting all documents...' });

    try {
      const response = await fetch('http://localhost:8000/delete-all-data', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: 'All documents deleted successfully',
        });
        setDocuments([]);
      } else {
        throw new Error(data.detail || 'Delete failed');
      }
    } catch (error: any) {
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to delete documents. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    uploadCard: {
      background: colors.cardGradient,
      border: `1px solid ${colors.border}`,
      borderRadius: '20px',
      padding: '35px',
      marginBottom: '30px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
    },
    cardTitle: {
      marginTop: 0,
      marginBottom: '25px',
      color: colors.text,
      fontSize: '1.5rem',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    inputGroup: {
      marginBottom: '25px',
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      fontSize: '14px',
      fontWeight: '700',
      color: colors.text,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    fileInputWrapper: {
      position: 'relative' as const,
      width: '100%',
    },
    fileInput: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '15px',
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      outline: 'none',
      background: colors.cardBg,
      color: colors.text,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    selectedFileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '20px',
      background: colors.surfaceGlass,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      marginBottom: '20px',
    },
    fileIcon: {
      fontSize: '32px',
    },
    fileDetails: {
      flex: 1,
    },
    fileName: {
      margin: 0,
      fontSize: '15px',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '5px',
    },
    fileSize: {
      margin: 0,
      fontSize: '13px',
      color: colors.textSecondary,
    },
    removeButton: {
      padding: '10px 20px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
    },
    uploadButton: {
      width: '100%',
      padding: '16px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    },
    buttonDisabled: {
      background: '#6c757d',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    statusMessage: {
      padding: '14px 18px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '20px',
      border: '1px solid',
    },
    statusSuccess: {
      background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
      color: colors.success,
      borderColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
    },
    statusError: {
      background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
      color: colors.error,
      borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
    },
    statusInfo: {
      background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
      color: theme === 'dark' ? '#3b82f6' : '#2563eb',
      borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
    },
    documentsCard: {
      background: colors.surfaceGlass,
      border: `1px solid ${colors.border}`,
      borderRadius: '20px',
      padding: '35px',
      backdropFilter: 'blur(10px)',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      flexWrap: 'wrap' as const,
      gap: '15px',
    },
    refreshButton: {
      padding: '10px 20px',
      background: colors.cardGradient,
      color: colors.text,
      border: `2px solid ${colors.border}`,
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    loading: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.textSecondary,
      fontSize: '16px',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: colors.textSecondary,
    },
    emptyText: {
      margin: '0 0 10px 0',
      fontSize: '16px',
    },
    emptySubtext: {
      margin: 0,
      fontSize: '14px',
    },
    documentsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
      marginBottom: '25px',
    },
    documentCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      background: colors.cardBg,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
    },
    documentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    docIcon: {
      fontSize: '28px',
    },
    docDetails: {
      
    },
    docName: {
      margin: 0,
      fontSize: '15px',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '5px',
    },
    docMeta: {
      margin: 0,
      fontSize: '13px',
      color: colors.textSecondary,
      fontWeight: '600',
    },
    deleteAllButton: {
      width: '100%',
      padding: '16px',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    },
  };

  return (
    <div style={styles.container}>
      {/* Upload Section */}
      <div 
        style={styles.uploadCard}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 15px 40px rgba(59, 130, 246, 0.2)'
            : '0 15px 40px rgba(37, 99, 235, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <h3 style={styles.cardTitle}>
          <span>📄</span> Upload PDF Document
        </h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Select PDF File</label>
          <div style={styles.fileInputWrapper}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={isUploading}
              style={styles.fileInput}
            />
          </div>
        </div>

        {selectedFile && (
          <div style={styles.selectedFileCard}>
            <span style={styles.fileIcon}>📎</span>
            <div style={styles.fileDetails}>
              <p style={styles.fileName}>{selectedFile.name}</p>
              <p style={styles.fileSize}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={styles.removeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ✕ Remove
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          style={{
            ...styles.uploadButton,
            ...(!selectedFile || isUploading ? styles.buttonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (selectedFile && !isUploading) {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
          }}
        >
          {isUploading ? '⏳ Processing...' : '⬆️ Upload PDF'}
        </button>

        {uploadStatus.type && (
          <div
            style={{
              ...styles.statusMessage,
              ...(uploadStatus.type === 'success' && styles.statusSuccess),
              ...(uploadStatus.type === 'error' && styles.statusError),
              ...(uploadStatus.type === 'info' && styles.statusInfo),
            }}
          >
            {uploadStatus.type === 'success' && '✅ '}
            {uploadStatus.type === 'error' && '❌ '}
            {uploadStatus.type === 'info' && 'ℹ️ '}
            {uploadStatus.message}
          </div>
        )}
      </div>

      {/* Documents List Section */}
      <div 
        style={styles.documentsCard}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 15px 40px rgba(59, 130, 246, 0.2)'
            : '0 15px 40px rgba(37, 99, 235, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={styles.headerRow}>
          <h3 style={styles.cardTitle}>
            <span>📚</span> Uploaded Documents
          </h3>
          <button
            onClick={fetchDocuments}
            disabled={isLoadingDocs}
            style={styles.refreshButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isLoadingDocs ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {isLoadingDocs ? (
          <div style={styles.loading}>⏳ Loading documents...</div>
        ) : documents.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>📭 No documents uploaded yet</p>
            <p style={styles.emptySubtext}>Upload a PDF to get started</p>
          </div>
        ) : (
          <>
            <div style={styles.documentsList}>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  style={styles.documentCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme === 'dark' ? '#3b82f6' : '#2563eb';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={styles.documentInfo}>
                    <span style={styles.docIcon}>📄</span>
                    <div style={styles.docDetails}>
                      <p style={styles.docName}>{doc.filename}</p>
                      <p style={styles.docMeta}>
                        {doc.chunk_count} chunks • {(doc.text_length / 1024).toFixed(1)} KB • {doc.storage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleDeleteAll}
              disabled={isUploading}
              style={{
                ...styles.deleteAllButton,
                ...(isUploading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isUploading) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
              }}
            >
              🗑️ Delete All Documents
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;