import React, { useEffect } from 'react';
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
import {
    getLongRunningPoller,
    AnalyzeResultOperationOutput,
    isUnexpected,
  } from "@azure-rest/ai-document-intelligence";
import { AlertCircle } from 'lucide-react';


type PDFUploadProps = {
    disabled: boolean;
    onFileLoadingChange: (loading: boolean) => void;
    onPdfContentChange: (content: string | null) => void;
    onErrorChange: (error: string | null) => void;
    pdfContent: string | null;
    error: string | null;
};

const PDFUploadComponent = ( props: PDFUploadProps) => {

    const key = "8eb0debe07194c6e89ea6ed854d70b86";
    const endpoint = "https://docint-west-europe.cognitiveservices.azure.com/";

    function _arrayBufferToBase64( buffer: ArrayBuffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onFileLoadingChange(true);
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
        const client = DocumentIntelligence(endpoint, {key});
        
      try {
        const arrayBuffer = await file.arrayBuffer();
        const initialResponse = await client.path("/documentModels/{modelId}:analyze", "prebuilt-layout").post({
            contentType: "application/json",
            body: {
                base64Source: _arrayBufferToBase64(arrayBuffer),
              },
            queryParameters: { outputContentFormat: "markdown" },
          });

        if (isUnexpected(initialResponse)) {
            throw initialResponse.body.error;
        }
        const poller = await getLongRunningPoller(client, initialResponse);
        const result = (await poller.pollUntilDone()).body as AnalyzeResultOperationOutput;
        props.onPdfContentChange(result.analyzeResult?.content ?? null);
        props.onErrorChange(null);
        props.onFileLoadingChange(false);
      } catch (err) {
        console.error(err);
        // @ts-ignore
        props.onErrorChange(err.message);
        props.onPdfContentChange(null);
      }
    } else {
      props.onErrorChange('Please upload a valid PDF file.');
      props.onPdfContentChange(null);
    }
  };

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
      
      {props.error && (
        <div className="flex items-center text-red-600 text-sm font-semibold">
          <AlertCircle size={16} className="mr-2" />
          {props.error}
        </div>
      )}
    </div>
  );
};

export default PDFUploadComponent;