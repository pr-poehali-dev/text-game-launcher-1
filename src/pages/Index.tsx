import { useState, useRef, useEffect } from 'react';
import { GameState, Task, LEVELS } from '../types/game';
import { tasks } from '../data/tasks';

const Index = () => {
  const [output, setOutput] = useState<string[]>(['=== Школьный Сисадмин — Москва ===', 'Добро пожаловать в игру!', 'Выберите уровень сложности:', '1. Новичок', '2. Опытный', '3. Профессионал', 'Введите номер уровня...']);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: null,
    currentTask: null,
    score: 0,
    isGameStarted: false,
    showingHint: false
  });
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

  const getRandomTask = (level: number): Task => {
    const levelTasks = tasks.filter(task => task.level === level);
    return levelTasks[Math.floor(Math.random() * levelTasks.length)];
  };

  const processCommand = (command: string) => {
    const choice = parseInt(command.trim());

    // Выбор уровня сложности
    if (!gameState.currentLevel) {
      if ([1, 2, 3].includes(choice)) {
        const level = choice;
        const levelName = LEVELS[level as keyof typeof LEVELS];
        setGameState(prev => ({ ...prev, currentLevel: level, isGameStarted: true }));
        setOutput(prev => [...prev, `Вы выбрали уровень: ${levelName}`, '']);
        
        // Показываем первую задачу
        const task = getRandomTask(level);
        setGameState(prev => ({ ...prev, currentTask: task }));
        showTask(task);
        return;
      } else {
        setOutput(prev => [...prev, 'Введите 1, 2 или 3 для выбора уровня.']);
        return;
      }
    }

    // Игровой процесс
    if (gameState.currentTask) {
      if (choice === 0) {
        // Показать подсказку
        setOutput(prev => [...prev, `Подсказка: ${gameState.currentTask!.hint}`, '']);
        setGameState(prev => ({ ...prev, showingHint: true }));
        return;
      }

      if (choice >= 1 && choice <= gameState.currentTask.options.length) {
        if (choice === gameState.currentTask.solution) {
          setOutput(prev => [...prev, '✅ Правильно! Задача решена.', '']);
          setGameState(prev => ({ ...prev, score: prev.score + 1 }));
          
          // Показываем следующую задачу
          setTimeout(() => {
            const nextTask = getRandomTask(gameState.currentLevel!);
            setGameState(prev => ({ ...prev, currentTask: nextTask, showingHint: false }));
            showTask(nextTask);
          }, 1500);
        } else {
          setOutput(prev => [...prev, '❌ Неверно, попробуйте снова.', '']);
        }
      } else {
        setOutput(prev => [...prev, 'Введите номер варианта ответа или 0 для подсказки.']);
      }
      return;
    }

    // Команды общего назначения
    const lowerCommand = command.toLowerCase();
    if (lowerCommand === 'restart' || lowerCommand === 'заново') {
      setGameState({
        currentLevel: null,
        currentTask: null,
        score: 0,
        isGameStarted: false,
        showingHint: false
      });
      setOutput(['=== Школьный Сисадмин — Москва ===', 'Выберите уровень сложности:', '1. Новичок', '2. Опытный', '3. Профессионал', 'Введите номер уровня...']);
    } else if (lowerCommand === 'score' || lowerCommand === 'счет') {
      setOutput(prev => [...prev, `Ваш счет: ${gameState.score} правильных ответов`]);
    } else {
      setOutput(prev => [...prev, 'Команды: restart (заново), score (счет)']);
    }
  };

  const showTask = (task: Task) => {
    const taskOutput = [
      `=== ${task.title} ===`,
      task.description,
      ''
    ];
    
    task.options.forEach((option, index) => {
      taskOutput.push(`${index + 1}. ${option}`);
    });
    
    taskOutput.push('0. Показать подсказку');
    taskOutput.push('');
    taskOutput.push('Ваш выбор:');
    
    setOutput(prev => [...prev, ...taskOutput]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Заголовок терминала */}
        <div className="border-b border-gray-700 pb-2 mb-4">
          <h1 className="text-xl font-bold text-white">Школьный Сисадмин — Москва</h1>
          <p className="text-gray-400 text-sm">
            {gameState.currentLevel ? `Уровень: ${LEVELS[gameState.currentLevel as keyof typeof LEVELS]} | Счет: ${gameState.score}` : 'Выберите уровень сложности'}
          </p>
        </div>

        {/* Область вывода */}
        <div 
          ref={outputRef}
          className="flex-1 overflow-y-auto space-y-2 mb-6 p-6 bg-gray-800 rounded-lg border border-gray-600 shadow-inner"
        >
          {output.map((line, index) => {
            const isHeader = line.startsWith('===');
            const isOption = /^\d+\../.test(line);
            const isSuccess = line.includes('✅');
            const isError = line.includes('❌');
            const isHint = line.startsWith('Подсказка:');
            const isCommand = line.startsWith('>');
            
            return (
              <div key={index} className={`whitespace-pre-wrap ${
                isHeader ? 'text-blue-300 font-bold text-lg border-b border-gray-600 pb-1 mb-2' :
                isOption ? 'text-cyan-300 hover:text-cyan-200 cursor-default pl-2' :
                isSuccess ? 'text-green-400 font-semibold' :
                isError ? 'text-red-400 font-semibold' :
                isHint ? 'text-yellow-300 italic bg-gray-700 p-3 rounded border-l-4 border-yellow-500' :
                isCommand ? 'text-purple-300 font-medium' :
                'text-gray-200'
              }`}>
                {line}
              </div>
            );
          })}
          {isLoading && (
            <div className="text-gray-400">
              <span className="animate-pulse">Обработка команды...</span>
            </div>
          )}
        </div>

        {/* Область ввода */}
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-4 shadow-lg">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold text-lg">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white caret-cyan-400 text-lg font-medium"
              placeholder="Введите команду..."
              disabled={isLoading}
            />
          </form>
        </div>

        {/* Статус */}
        <div className="text-xs text-gray-500">
          {gameState.isGameStarted ? 'Решайте задачи IT-поддержки московских школ' : 'Игра готова к запуску'}
        </div>
      </div>
    </div>
  );
};

export default Index;