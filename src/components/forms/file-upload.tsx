"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { LuFile, LuImage, LuUpload, LuX } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface FileUploadProps {
  design?: DesignPreset;
  files?: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  dropzoneClassName?: string;
}

export function FileUpload({ design, files = [], onFilesChange, accept, maxSize = 10 * 1024 * 1024, multiple = false, disabled, label = "Selecciona archivos", description = "Arrastra archivos aquí o pulsa para explorar.", error, className, dropzoneClassName }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string>();

  function validate(incoming: File[]): File[] {
    const valid = incoming.filter((file) => {
      if (file.size > maxSize) {
        setValidationError(`${file.name} supera el tamaño máximo.`);
        return false;
      }
      return true;
    });
    if (valid.length === incoming.length) setValidationError(undefined);
    return multiple ? [...files, ...valid] : valid.slice(0, 1);
  }

  function receive(fileList: FileList | null): void {
    if (!fileList || disabled) return;
    onFilesChange(validate(Array.from(fileList)));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setDragging(false);
    receive(event.dataTransfer.files);
  }

  return (
    <div className={className}>
      <div
        onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn("grid min-h-44 place-items-center rounded-xl border border-dashed border-border bg-background p-5 text-center transition-colors", design && controlDesignStyles[design], dragging && "border-primary bg-primary/5", disabled && "cursor-not-allowed opacity-50", dropzoneClassName)}
      >
        <div>
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><LuUpload /></span>
          <p className="mt-3 text-sm font-extrabold text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted">{description}</p>
          <Button type="button" variant="outline" size="sm" className="mt-4" disabled={disabled} onClick={() => inputRef.current?.click()}>Explorar</Button>
          <input ref={inputRef} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} onChange={(event: ChangeEvent<HTMLInputElement>) => receive(event.target.files)} />
        </div>
      </div>
      {(error || validationError) && <p className="mt-2 text-xs text-danger">{error ?? validationError}</p>}
      {files.length > 0 && <ul className="mt-3 space-y-2">{files.map((file, index) => <li key={`${file.name}-${file.lastModified}`} className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:gap-3"><LuFile className="shrink-0 text-muted" /><span className="min-w-0 flex-1 truncate text-xs font-bold">{file.name}</span><span className="shrink-0 text-[10px] text-muted">{formatBytes(file.size)}</span><button type="button" className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-surface-hover sm:size-8" onClick={() => onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Eliminar ${file.name}`}><LuX /></button></li>)}</ul>}
    </div>
  );
}

export const Dropzone = FileUpload;

export interface ImageUploadProps extends Omit<FileUploadProps, "accept"> {
  previewFallback?: ReactNode;
}

export function ImageUpload({ files = [], previewFallback, ...props }: ImageUploadProps) {
  return (
    <div>
      <FileUpload {...props} files={files} accept="image/*" />
      {files.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{files.map((file) => <ImageFilePreview key={`${file.name}-${file.lastModified}`} file={file} fallback={previewFallback} />)}</div>}
    </div>
  );
}

function ImageFilePreview({ file, fallback = <LuImage /> }: { file: File; fallback?: ReactNode }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    const timer = window.setTimeout(() => setUrl(objectUrl), 0);
    return () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);
  return <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-border bg-background text-muted">{url ? <Image src={url} alt={file.name} fill unoptimized className="object-cover" /> : fallback}</div>;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
