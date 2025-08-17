import { useState, useRef, useEffect } from 'react';

const Index = () => {
  const [output, setOutput] = useState<string[]>(['Добро пожаловать в терминальную игру!', 'Введите команду для начала...']);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Автофокус на инпут
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const command = input.trim();
    setOutput(prev => [...prev, `> ${command}`]);
    setInput('');
    setIsLoading(true);

    // Здесь будет логика игры
    setTimeout(() => {
      processCommand(command);
      setIsLoading(false);
    }, 300);
  };

  const processCommand = (command: string) => {
    // Временная логика - заменится на твой код игры
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand === 'help' || lowerCommand === 'помощь') {
      setOutput(prev => [...prev, 'Доступные команды:', '• help - показать помощь', '• start - начать игру', '• clear - очистить экран']);
    } else if (lowerCommand === 'start' || lowerCommand === 'старт') {
      setOutput(prev => [...prev, 'Игра началась! Ожидаем интеграцию твоего кода...']);
    } else if (lowerCommand === 'clear' || lowerCommand === 'очистить') {
      setOutput(['Терминал очищен.']);
    } else {
      setOutput(prev => [...prev, `Неизвестная команда: ${command}`, 'Введите "help" для получения справки.']);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Заголовок терминала */}
        <div className="border-b border-green-800 pb-2 mb-4">
          <h1 className="text-xl font-bold">TERMINAL GAME v1.0</h1>
          <p className="text-green-600 text-sm">Ready for your game integration</p>
        </div>

        {/* Область вывода */}
        <div 
          ref={outputRef}
          className="flex-1 overflow-y-auto space-y-1 mb-4 p-4 bg-gray-900 rounded border border-green-800"
        >
          {output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          {isLoading && (
            <div className="text-green-600">
              <span className="animate-pulse">Обработка команды...</span>
            </div>
          )}
        </div>

        {/* Область ввода */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-green-600">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            placeholder="Введите команду..."
            disabled={isLoading}
          />
        </form>

        {/* Статус */}
        <div className="mt-2 text-xs text-green-700">
          Готов к интеграции вашего игрового кода
        </div>
      </div>
    </div>
  );
};

export default Index;