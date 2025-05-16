
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Sistema de archivos académicos</h1>
          <p className="opacity-80">Gestiona los documentos de tus asignaturas</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-0">
        <Tabs defaultValue="list" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="list">Ver archivos</TabsTrigger>
            <TabsTrigger value="upload">Subir archivos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="flex justify-center">
            <FileList />
          </TabsContent>
          
          <TabsContent value="upload" className="flex justify-center">
            <FileUploader />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto py-4 bg-gray-100 border-t text-center text-sm text-gray-600">
        <div className="container mx-auto">
          Sistema de gestión de archivos académicos © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
