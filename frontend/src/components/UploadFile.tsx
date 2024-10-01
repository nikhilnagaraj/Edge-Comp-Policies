import React, { useEffect, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

type PDFUploadProps = {
    disabled: boolean;
    onPdfContentChange: (content: string | null) => void;
    onErrorChange: (error: string | null) => void;
    pdfContent: string | null;
    error: string | null;
};

type PageContents = {
    pageNumber: number;
    textContent: string;
}

const PDFUploadComponent = ( props: PDFUploadProps) => {

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const pages: PageContents[] = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          pages.push({
            pageNumber: i,
            textContent: textContent.items.map(item => {
              // Check if the item has 'str' property, otherwise use an empty string
              return 'str' in item ? item.str : '';
            }).join(' ')
          })
        }	
        const pdfString = pages.map(page => `Page Number: ${page.pageNumber}\n` + page.textContent).join(' ');
        props.onPdfContentChange(pdfString);
        props.onErrorChange(null);
      } catch (err) {
        // @ts-ignore
        props.onErrorChange(err.message);
        props.onPdfContentChange(null);
      }
    } else {
      props.onErrorChange('Please upload a valid PDF file.');
      props.onPdfContentChange(null);
    }
  };

  useEffect(() => {
    const loadWorker = async () => {
    // @ts-ignore
      const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
    };
    loadWorker();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8">
      <label className="block mb-4">
        <input
          type="file"
          className="text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={props.disabled}
        />
      </label>
      
      {/* {props.error && (
        <div className="flex items-center text-red-600 text-sm font-semibold">
          <AlertCircle size={16} className="mr-2" />
          {props.error}
        </div>
      )}
      
      {props.pdfContent && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">PDF Content:</h3>
          <p className="text-sm text-gray-600">{props.pdfContent}</p>
        </div>
      )} */}
    </div>
  );
};

export default PDFUploadComponent;