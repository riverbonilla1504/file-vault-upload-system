
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { listFiles, getDownloadUrl, downloadFile } from '@/services/fileService';
import { Download } from 'lucide-react';

const asignaturas = ["matematicas", "fisica", "quimica", "biologia", "historia"];

const FileList = () => {
  const [asignatura, setAsignatura] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (asignatura) {
      fetchFiles(asignatura);
    }
  }, [asignatura]);

  const fetchFiles = async (subject: string) => {
    try {
      setIsLoading(true);
      const fileList = await listFiles(subject);
      setFiles(fileList);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los archivos",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      setDownloadLoading(fileName);
      const downloadUrl = await getDownloadUrl(asignatura, fileName);
      
      toast({
        title: "Descargando",
        description: `Descargando ${fileName}...`
      });
      
      // Usar la nueva función para descargar directamente
      await downloadFile(downloadUrl, fileName);
      
      toast({
        title: "Éxito",
        description: `El archivo ${fileName} se ha descargado correctamente`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo descargar el archivo",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setDownloadLoading(null);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Archivos disponibles</CardTitle>
        <CardDescription>
          Selecciona una asignatura para ver los archivos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="asignatura-list">Asignatura</Label>
          <Select value={asignatura} onValueChange={setAsignatura}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una asignatura" />
            </SelectTrigger>
            <SelectContent>
              {asignaturas.map((asig) => (
                <SelectItem key={asig} value={asig}>
                  {asig.charAt(0).toUpperCase() + asig.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 border-4 border-primary border-r-transparent animate-spin rounded-full"></div>
          </div>
        ) : (
          <div className="mt-4">
            {files.length > 0 ? (
              <ul className="divide-y divide-gray-200 border rounded-md">
                {files.map((file) => (
                  <li key={file} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Download className="h-5 w-5 text-blue-500 mr-2" />
                      <span>{file}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(file)}
                      disabled={downloadLoading === file}
                    >
                      {downloadLoading === file ? (
                        <div className="h-4 w-4 border-2 border-r-transparent animate-spin rounded-full mr-2" />
                      ) : "Descargar"}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : asignatura ? (
              <div className="text-center py-8 text-gray-500">
                No hay archivos disponibles para esta asignatura
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Selecciona una asignatura para ver los archivos
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileList;
