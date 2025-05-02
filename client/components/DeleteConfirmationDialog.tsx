/**
 * DeleteConfirmationDialog Component
 * 
 * Purpose: 
 * Provides a modal dialog for confirming dataset deletion with validation.
 * 
 * Used in:
 * - Dataset detail pages
 * - Any place where permanent deletion needs confirmation
 * 
 * Features:
 * - Type-to-confirm validation (requires exact dataset name match)
 * - Copy to clipboard functionality
 * - Error display
 * - Loading state handling
 * - Accessible modal dialog
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

/**
 * Props for DeleteConfirmationDialog
 * @property {boolean} isOpen - Controls dialog visibility
 * @property {function} onClose - Handler for closing the dialog
 * @property {function} onConfirm - Handler for confirming the deletion
 * @property {string} datasetName - Name of the dataset to be deleted
 * @property {boolean} isDeleting - Loading state for deletion in progress
 * @property {string|null} error - Error message to display if deletion fails
 */
interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  datasetName: string;
  isDeleting?: boolean;
  error?: string | null;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  datasetName,
  isDeleting = false,
  error = null,
}: DeleteConfirmationDialogProps) {
  // State for tracking user input in confirmation field
  const [confirmText, setConfirmText] = useState('');
  // State for tracking clipboard copy action
  const [copied, setCopied] = useState(false);

  /**
   * Reset state when dialog opens
   * Ensures a clean slate for each deletion confirmation
   */
  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setCopied(false);
    }
  }, [isOpen]);

  /**
   * Copy dataset name to clipboard
   * Provides visual feedback with temporary "Copied" message
   */
  const handleCopyDatasetName = () => {
    navigator.clipboard.writeText(datasetName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Disable confirm button if text doesn't match or deletion is in progress
  const isConfirmDisabled = confirmText !== datasetName || isDeleting;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-3">
          {/* Warning message */}
          <p className="text-sm text-gray-300 mb-4">
            This action cannot be undone. This will permanently delete the {datasetName} project and all associated data.
          </p>
          
          {/* Dataset name with copy button */}
          <div className="flex justify-between items-center bg-[#121212] p-2 rounded mb-4">
            <code className="text-sm">{datasetName}</code>
            <button 
              onClick={handleCopyDatasetName}
              className="p-1 rounded hover:bg-[#2a2a2a] transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          {/* Copy confirmation message */}
          {copied && (
            <div className="text-xs text-green-400 mb-2">
              Copied to clipboard!
            </div>
          )}
          
          {/* Error message display */}
          {error && (
            <div className="text-xs text-red-400 mb-2 p-2 bg-red-900/20 border border-red-900/30 rounded">
              Error: {error}
            </div>
          )}
          
          {/* Confirmation input field */}
          <div className="mb-4">
            <label htmlFor="confirm" className="block text-xs text-gray-400 mb-1">
              To confirm, type {datasetName} below:
            </label>
            <input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3a3a3a]"
              placeholder={`Type ${datasetName} to confirm`}
              disabled={isDeleting}
            />
          </div>
        </div>
        
        {/* Dialog action buttons */}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border-[#2a2a2a] text-white"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="bg-red-900 hover:bg-red-800 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 