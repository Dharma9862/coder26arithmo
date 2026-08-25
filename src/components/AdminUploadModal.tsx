import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { AptitudeQuestion, ImportedQuestionDraft } from '../types';

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (questions: AptitudeQuestion[]) => void;
}

export const AdminUploadModal: React.FC<AdminUploadModalProps> = ({
  isOpen,
  onClose,
  onImportQuestions,
}) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [draftQuestions, setDraftQuestions] = useState<ImportedQuestionDraft[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Download Sample Excel Template (.xlsx)
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        Question: 'What is the sum of the first 20 odd natural numbers?',
        'Option A': '360',
        'Option B': '380',
        'Option C': '400',
        'Option D': '420',
        'Correct Answer': 'Option C', // Or '400' or 'C'
        Explanation: 'Formula: Sum of first n odd numbers = n². For n = 20, Sum = 20² = 400.',
        Category: 'Number Systems',
        Difficulty: 'Easy',
        Tags: 'Formula, SSC, CAT',
        'Image URL': '',
      },
      {
        Question: 'A train 150m long is moving at 54 km/h. How much time will it take to cross a telephone pole?',
        'Option A': '8 seconds',
        'Option B': '10 seconds',
        'Option C': '12 seconds',
        'Option D': '15 seconds',
        'Correct Answer': 'Option B',
        Explanation: 'Speed in m/s = 54 × (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
        Category: 'Time, Speed & Distance',
        Difficulty: 'Easy',
        Tags: 'Trains, Speed, Banking',
        'Image URL': '',
      },
      {
        Question: 'If 6 men can complete a job in 12 days, in how many days can 9 men complete the same job?',
        'Option A': '6 days',
        'Option B': '8 days',
        'Option C': '9 days',
        'Option D': '10 days',
        'Correct Answer': 'Option B',
        Explanation: 'Total work = 6 × 12 = 72 man-days. Time for 9 men = 72 / 9 = 8 days.',
        Category: 'Time & Work',
        Difficulty: 'Medium',
        Tags: 'Work, Inverse Ratio',
        'Image URL': '',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AptitudeQuestions');
    XLSX.writeFile(workbook, 'NumberSprint_Question_Import_Template.xlsx');
  };

  // Process File Upload (.xlsx, .xls, .csv, .txt)
  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setImportSuccess(false);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        const validatedDrafts = validateImportData(jsonData);
        setDraftQuestions(validatedDrafts);
      } catch (err) {
        alert('Failed to parse file. Please ensure it is a valid Excel (.xlsx, .xls) or CSV file.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Pre-import Validation Engine
  const validateImportData = (rows: any[]): ImportedQuestionDraft[] => {
    return rows.map((row, index) => {
      const errors: string[] = [];
      const questionText = row['Question'] || row['question'] || row['QUESTION'] || '';
      const optA = String(row['Option A'] || row['option_a'] || row['A'] || '').trim();
      const optB = String(row['Option B'] || row['option_b'] || row['B'] || '').trim();
      const optC = String(row['Option C'] || row['option_c'] || row['C'] || '').trim();
      const optD = String(row['Option D'] || row['option_d'] || row['D'] || '').trim();
      const options = [optA, optB, optC, optD].filter(Boolean);

      const rawAnswer = String(row['Correct Answer'] || row['correct_answer'] || row['Answer'] || '').trim();
      const explanation = String(row['Explanation'] || row['explanation'] || '').trim();
      const category = String(row['Category'] || row['category'] || 'General Quantitative').trim();
      const rawDifficulty = String(row['Difficulty'] || row['difficulty'] || 'Medium').trim();
      const tagsStr = String(row['Tags'] || row['tags'] || '').trim();
      const imageUrl = String(row['Image URL'] || row['imageUrl'] || '').trim();

      if (!questionText) errors.push('Missing question text');
      if (options.length < 2) errors.push('At least 2 options required (A and B)');

      // Resolve correct answer index
      let correctIndex = -1;
      const lowerRaw = rawAnswer.toLowerCase();
      if (lowerRaw === 'a' || lowerRaw === 'option a' || lowerRaw === '1') correctIndex = 0;
      else if (lowerRaw === 'b' || lowerRaw === 'option b' || lowerRaw === '2') correctIndex = 1;
      else if (lowerRaw === 'c' || lowerRaw === 'option c' || lowerRaw === '3') correctIndex = 2;
      else if (lowerRaw === 'd' || lowerRaw === 'option d' || lowerRaw === '4') correctIndex = 3;
      else {
        // match exact value
        const found = options.findIndex((opt) => opt.toLowerCase() === lowerRaw);
        if (found !== -1) correctIndex = found;
        else errors.push(`Could not map correct answer "${rawAnswer}" to any option`);
      }

      const validDifficulty: 'Easy' | 'Medium' | 'Hard' = 
        ['Easy', 'Medium', 'Hard'].includes(rawDifficulty) ? (rawDifficulty as any) : 'Medium';

      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : ['Custom Import'];

      return {
        id: `import_draft_${index}_${Date.now()}`,
        question: questionText,
        options,
        correctAnswer: rawAnswer,
        correctAnswerIndex: correctIndex,
        explanation: explanation || 'Standard formula solution.',
        category,
        difficulty: validDifficulty,
        tags,
        imageUrl: imageUrl || undefined,
        errors,
        isValid: errors.length === 0,
      };
    });
  };

  // Commit valid questions to Supabase / Local database
  const handleCommitImport = () => {
    const validOnes = draftQuestions.filter((d) => d.isValid);
    if (validOnes.length === 0) {
      alert('No valid questions found to import.');
      return;
    }

    const transformed: AptitudeQuestion[] = validOnes.map((d, idx) => ({
      id: `imported_q_${Date.now()}_${idx}`,
      categoryId: d.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      categoryName: d.category,
      questionText: d.question,
      options: d.options,
      correctAnswerIndex: d.correctAnswerIndex,
      explanation: d.explanation,
      difficulty: d.difficulty,
      examTags: d.tags,
      imageUrl: d.imageUrl,
    }));

    onImportQuestions(transformed);
    setImportSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const validCount = draftQuestions.filter((d) => d.isValid).length;
  const errorCount = draftQuestions.filter((d) => !d.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                Admin Question Upload Center
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Bulk import quantitative aptitude & competitive exam questions via Excel (.xlsx, .csv) with schema validation
              </p>
            </div>
          </div>
          <button
            id="close-admin-upload-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Top Actions: Template Download & Format Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center justify-between gap-3 shadow-md">
              <div>
                <p className="font-black uppercase tracking-tight text-xs text-white">Excel Import Template</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Pre-formatted columns with sample formulas</p>
              </div>
              <button
                id="download-template-btn"
                onClick={handleDownloadTemplate}
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download .XLSX</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-start gap-3 text-xs text-slate-300 shadow-md">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black uppercase tracking-tight text-white block mb-0.5">Document Parsing Notice:</span>
                <span className="font-medium text-slate-400">Supports .xlsx, .xls, .csv and structured text. For scanned PDFs, please export text or use OCR first before uploading.</span>
              </div>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-sky-500 bg-sky-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-slate-600 bg-slate-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <FileSpreadsheet className="w-12 h-12 text-sky-400 mx-auto mb-3" />
            <p className="font-black uppercase tracking-tight text-base text-white">
              {fileName ? fileName : 'Drag & drop Excel or CSV file here, or click to browse'}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Supports .xlsx, .xls, .csv with Question, Option A-D, Answer, Explanation, Category, Tags
            </p>
          </div>

          {/* Validation & Preview Section */}
          {draftQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-black uppercase tracking-wider text-white">Parsed Rows: {draftQuestions.length}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {validCount} Valid
                  </span>
                  {errorCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errorCount} with Errors
                    </span>
                  )}
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900 overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 sticky top-0 border-b border-slate-700/60 text-slate-400 font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Question</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Options</th>
                      <th className="p-3">Answer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40 font-medium">
                    {draftQuestions.map((q, idx) => (
                      <tr key={idx} className={q.isValid ? 'hover:bg-slate-800/50' : 'bg-rose-950/20'}>
                        <td className="p-3">
                          {q.isValid ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> OK
                            </span>
                          ) : (
                            <div className="text-rose-400 text-[10px]" title={q.errors.join(', ')}>
                              <AlertCircle className="w-3.5 h-3.5 mb-0.5" />
                              {q.errors[0]}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-bold text-white max-w-xs truncate">{q.question}</td>
                        <td className="p-3 text-slate-400 truncate">{q.category}</td>
                        <td className="p-3 text-slate-400 font-mono-math">{q.options.length} choices</td>
                        <td className="p-3 text-sky-400 font-mono-math font-black">
                          {q.correctAnswerIndex >= 0 ? `Opt ${String.fromCharCode(65 + q.correctAnswerIndex)}` : 'Error'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer CTA */}
        <div className="p-5 sm:p-6 border-t border-slate-700/60 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            id="cancel-admin-btn"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 font-black uppercase tracking-wider text-xs hover:bg-slate-700 transition-colors"
          >
            Close
          </button>

          <button
            id="commit-import-btn"
            disabled={validCount === 0 || importSuccess}
            onClick={handleCommitImport}
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-40 active:scale-95 transition-all"
          >
            {importSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully Imported!</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>Import {validCount} Valid Questions</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
