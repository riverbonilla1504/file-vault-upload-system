
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, FileUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { createFileSpace, uploadFile } from '@/services/fileService';

const asignaturas = ["matematicas", "fisica", "quimica", "biologia", "historia"];

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [asignatura, setAsignatura] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !asignatura) {
      toast({
        title: "Error",
        description: "Debes seleccionar un archivo y una asignatura",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Solo permitimos PDF por ahora
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Solo se permiten archivos PDF",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Procesando",
        description: "Creando espacio para el archivo..."
      });

      // Paso 1: Crear espacio para el archivo
      const uploadUrl = await createFileSpace(
        asignatura,
        selectedFile.name,
        selectedFile.type
      );
      
      toast({
        title: "Procesando",
        description: "Subiendo archivo..."
      });
      
      // Paso 2: Subir el archivo
      await uploadFile(uploadUrl, selectedFile, selectedFile.type);
      
      toast({
        title: "Éxito",
        description: `El archivo ${selectedFile.name} se subió correctamente a ${asignatura}`,
      });
      
      // Limpiar el formulario
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Error completo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo subir el archivo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Subir archivo</CardTitle>
        <CardDescription>
          Sube un archivo PDF para la asignatura seleccionada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="asignatura">Asignatura</Label>
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
        
        <div className="space-y-2">
          <Label htmlFor="file-upload">Archivo</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileUp className="h-10 w-10 text-gray-400" />
              <div className="text-sm text-gray-500">
                {selectedFile ? (
                  <span className="font-medium text-primary">{selectedFile.name}</span>
                ) : (
                  <span>Arrastra un archivo aquí o haz clic para seleccionarlo</span>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Seleccionar archivo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !asignatura || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-4 w-4 border-2 border-r-transparent animate-spin rounded-full mr-2" />
              Subiendo...
            </div>
          ) : (
            <div className="flex items-center">
              <Upload className="mr-2 h-4 w-4" /> Subir archivo
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
