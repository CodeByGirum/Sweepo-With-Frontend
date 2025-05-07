/**
 * Export To PDF Component
 * Purpose: Converts HTML content to PDF format
 * Used in: Report exports, data analysis exports
 * Features:
 * - HTML to PDF conversion
 * - Customizable file name
 * - Element filtering
 * - High-quality output
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DropdownMenuItem } from './ui/dropdown-menu';

interface ExportToPDFProps {
  exportContentId: string;
  fileName?: string; 
}

/**
 * PDF export component
 * @param exportContentId - ID of the HTML element to export
 * @param fileName - Optional custom file name for the PDF
 */
const ExportToPDF: React.FC<ExportToPDFProps> = ({ exportContentId, fileName }) => {
  /**
   * Handles the PDF export process
   * - Captures HTML content
   * - Converts to canvas
   * - Creates and saves PDF
   */
  const handleExport = async () => {
    const content = document.getElementById(exportContentId);

    if (!content) {
      alert('Error: Content not found for export.');
      return;
    }

    // content.style.backgroundColor = '#121212';

    const canvas = await html2canvas(content, {
      ignoreElements: (element) => {
        
        return (
          element.tagName === 'BUTTON' ||
          element.classList.contains('shadcn-button') || 
          element.getAttribute('data-ignore') === 'true' 
        );
      },
    });
    

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName || 'report'}.pdf`);
  };

  return (
    <DropdownMenuItem  onClick={handleExport}>
      PDF
    </DropdownMenuItem>
    
  );
};

export default ExportToPDF;