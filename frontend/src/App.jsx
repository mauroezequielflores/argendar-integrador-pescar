import ApiTest from './components/ApiTest';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Argendar Ecosistema
        </h1>
        <p className="text-gray-600 mt-2">Plantilla base de desarrollo colaborativo</p>
      </header>

      <main className="w-full">
        <ApiTest />
      </main>
    </div>
  );
}

export default App;