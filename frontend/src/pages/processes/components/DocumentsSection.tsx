import React, { useState, useRef } from 'react';
import { FileText, Upload, X, Download, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useProcessesStore } from '../../../stores/processesStore';
import { DocumentType } from '../../../types';

interface DocumentsSectionProps {
  processId: string;
}

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'CPF', label: 'CPF' },
  { value: 'RG', label: 'RG' },
  { value: 'CNH', label: 'CNH' },
  { value: 'Certidao_Nascimento', label: 'Certidão de Nascimento' },
  { value: 'Certidao_Casamento', label: 'Certidão de Casamento' },
  { value: 'Comprovante_Residencia', label: 'Comprovante de Residência' },
  { value: 'Procuracao', label: 'Procuração' },
  { value: 'Contrato', label: 'Contrato' },
  { value: 'Peticao', label: 'Petição' },
  { value: 'Decisao', label: 'Decisão' },
  { value: 'Outros', label: 'Outros' },
];

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ processId }) => {
  const { uploadDocument, documents, isLoading } = useProcessesStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentInfo, setDocumentInfo] = useState({
    name: '',
    description: '',
    tags: '',
    documentType: '' as DocumentType,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentInfo(prev => ({ ...prev, name: file.name }));
      setShowForm(true);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !documentInfo.documentType) return;

    setIsUploading(true);
    try {
      await uploadDocument(
        processId,
        selectedFile,
        {
          ...documentInfo,
          name: `${documentInfo.documentType} - ${documentInfo.name}`,
        },
        (progress) => {
          setUploadProgress(progress);
        }
      );
      
      // Reset form
      setSelectedFile(null);
      setDocumentInfo({ name: '', description: '', tags: '', documentType: '' as DocumentType });
      setShowForm(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setIsUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-slate-900">Documents</h2>
          <label className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </label>
        </div>

        {showForm && selectedFile && (
          <div className="mb-6 bg-slate-50 p-4 rounded-lg">
            <form onSubmit={handleUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    File
                  </label>
                  <div className="mt-1 flex items-center">
                    <FileText className="h-5 w-5 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600">
                      {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setShowForm(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="ml-2 text-slate-400 hover:text-slate-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-slate-700">
                    Document Type *
                  </label>
                  <select
                    id="documentType"
                    required
                    value={documentInfo.documentType}
                    onChange={(e) => setDocumentInfo(prev => ({ 
                      ...prev, 
                      documentType: e.target.value as DocumentType 
                    }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Select document type</option>
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={documentInfo.name}
                    onChange={(e) => setDocumentInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={documentInfo.description}
                    onChange={(e) => setDocumentInfo(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-slate-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={documentInfo.tags}
                    onChange={(e) => setDocumentInfo(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="contract, agreement, draft"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setShowForm(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !documentInfo.documentType}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-75"
                  >
                    {isUploading ? `Uploading (${uploadProgress}%)` : 'Upload'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-100 rounded">
                    <FileText className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{doc.name}</h3>
                    {doc.description && (
                      <p className="mt-1 text-sm text-slate-500">{doc.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
                      <span className="font-medium text-slate-700">{
                        DOCUMENT_TYPES.find(t => t.value === doc.documentType)?.label || doc.documentType
                      }</span>
                    </div>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <a
                  href={doc.fileUrl}
                  download
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download
                </a>
              </div>
            </div>
          ))}

          {documents.length === 0 && !isLoading && (
            <div className="text-center py-6">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No documents</h3>
              <p className="mt-1 text-sm text-slate-500">
                Get started by uploading your first document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;