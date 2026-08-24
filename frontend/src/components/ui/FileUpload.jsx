import React, { useRef, useState } from "react";
import { ArrowUpTrayIcon, XMarkIcon, InformationCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

/**
 * FileUpload — Componente fiel al diseño para subir imágenes.
 */
export default function FileUpload({
  maxFiles = 3,
  maxSizeMB = 5,
  onFilesChange,
  className = "",
}) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (newFiles) => {
    let validFiles = [...files];
    let hasError = false;

    newFiles.forEach((file) => {
      if (validFiles.length >= maxFiles) return;
      if (!file.type.match("image/(jpeg|png|webp)")) {
        alert(`Formato no permitido: ${file.name}`);
        hasError = true;
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`El archivo es muy pesado (máximo ${maxSizeMB}MB): ${file.name}`);
        hasError = true;
        return;
      }
      // Assign a temporary preview URL for the thumbnail
      Object.assign(file, { preview: URL.createObjectURL(file) });
      validFiles.push(file);
    });

    setFiles(validFiles);
    if (onFilesChange) onFilesChange(validFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Upload Zone (Left) */}
        <div className="flex-1 w-full">
          <div
            className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#555] rounded-[12px] bg-[#292929] hover:bg-[#333] transition-colors cursor-pointer text-center h-full"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="bg-[#3f3f3f] p-3 rounded-full mb-4">
              <ArrowUpTrayIcon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Arrastrá tus fotos aquí</p>
            <p className="text-xs text-[#A8A8AA] mb-4">o seleccioná archivos de tu computadora</p>
            <button
              type="button"
              className="text-xs font-semibold bg-[#3f3f3f] text-white px-6 py-2.5 rounded-[8px] hover:bg-[#4f4f4f] transition-colors"
            >
              Subir imágenes
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#A8A8AA]">
              <InformationCircleIcon className="h-4 w-4 text-[#F78736]" />
              <span>Máximo {maxSizeMB} MB por imagen. Formatos: JPG, PNG, WEBP</span>
            </div>
            <div className="font-semibold">
              <span className="text-[#F78736]">{files.length}/{maxFiles}</span>
              <span className="text-white ml-1">imágenes</span>
            </div>
          </div>
        </div>

        {/* Previews Zone (Right) */}
        {files.length > 0 && (
          <div className="w-full md:w-32 flex flex-col gap-3 shrink-0">
            {files.map((file, idx) => (
              <div key={idx} className="w-32 h-20 rounded-[8px] overflow-hidden border border-[#3f3f3f] relative bg-[#202020]">
                <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            ))}
            {/* Si faltan imágenes para llegar al límite, podríamos mostrar un "loading" falso como en la imagen, pero depende del diseño de interacción. Solo mostramos los subidos. */}
            {files.length < maxFiles && files.length > 0 && (
              <div className="w-32 h-20 rounded-[8px] border border-[#F78736] bg-[#292929] flex flex-col items-center justify-center">
                <ArrowPathIcon className="h-5 w-5 text-[#F78736] animate-spin mb-1" />
                <span className="text-[9px] font-bold text-[#F78736] uppercase tracking-wider">Loading...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subidos Pills */}
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-white mb-3">Archivos subidos ({files.length}/{maxFiles})</p>
          <div className="flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[#292929] border border-[#3f3f3f] rounded-[6px] px-3 py-1.5">
                <div className="bg-[#3f3f3f] p-1 rounded">
                  <ArrowUpTrayIcon className="h-3 w-3 text-white transform rotate-180" /> 
                  {/* El ícono de clip no está en heroicons por defecto, uso otro que parece un archivo */}
                </div>
                <span className="text-xs text-white max-w-[120px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-[#A8A8AA] hover:text-white ml-1"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
