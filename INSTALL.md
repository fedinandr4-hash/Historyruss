# 📥 Подробная инструкция по установке

## 📋 Требования

Для запуска проекта вам понадобится:
- **Node.js** версии 18 или выше
- **npm** (устанавливается вместе с Node.js)
- Современный веб-браузер (Chrome, Firefox, Safari, Edge)

---

## 🔧 Шаг 1: Установка Node.js

### Windows

1. Перейдите на официальный сайт: https://nodejs.org/
2. Скачайте **LTS версию** (рекомендуется) — кнопка "LTS"
3. Запустите скачанный файл `.msi`
4. Следуйте инструкциям установщика:
   - Примите лицензионное соглашение
   - Выберите путь установки (по умолчанию `C:\Program Files\nodejs\`)
   - Убедитесь, что отмечена опция "Add to PATH"
   - Нажмите "Install"
5. После установки откройте **Командную строку** (Win+R → `cmd`) и проверьте:
   ```bash
   node --version
   npm --version
   ```
   Должны отобразиться версии Node.js и npm

### macOS

**Вариант 1: Через официальный установщик**
1. Перейдите на https://nodejs.org/
2. Скачайте **LTS версию** для macOS
3. Откройте скачанный файл `.pkg`
4. Следуйте инструкциям установщика
5. Откройте **Терминал** и проверьте:
   ```bash
   node --version
   npm --version
   ```

**Вариант 2: Через Homebrew (рекомендуется для разработчиков)**
```bash
# Установка Homebrew (если не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установка Node.js
brew install node

# Проверка
node --version
npm --version
```

### Linux (Ubuntu/Debian)

```bash
# Обновление пакетов
sudo apt update

# Установка Node.js и npm
sudo apt install nodejs npm

# Проверка
node --version
npm --version
```

**Для последней версии Node.js:**
```bash
# Установка NodeSource репозитория
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Установка Node.js
sudo apt install -y nodejs

# Проверка
node --version
npm --version
```

---

## 📦 Шаг 2: Скачивание проекта

### Вариант 1: Скачать ZIP-архив

1. На странице проекта нажмите кнопку **"Code"** (зелёная кнопка)
2. Выберите **"Download ZIP"**
3. Распакуйте архив в удобное место (например, `C:\Projects\` или `~/Projects/`)

### Вариант 2: Клонировать через Git

Если у вас установлен Git:

```bash
# Откройте терминал/командную строку
# Перейдите в папку для проектов
cd ~/Projects  # или cd C:\Projects

# Клонируйте репозиторий
git clone <URL-репозитория>

# Перейдите в папку проекта
cd <название-папки>
```

---

## 🚀 Шаг 3: Установка зависимостей

1. Откройте **терминал** или **командную строку**
2. Перейдите в папку проекта:

**Windows:**
```bash
cd C:\путь\к\проекту
```

**macOS/Linux:**
```bash
cd ~/путь/к/проекту
```

3. Установите зависимости:
```bash
npm install
```

Эта команда:
- Создаст папку `node_modules` с необходимыми библиотеками
- Займёт 1-3 минуты в зависимости от скорости интернета
- Создаст файл `package-lock.json`

**Если возникли ошибки:**
- Убедитесь, что Node.js установлен корректно (`node --version`)
- Попробуйте очистить кэш: `npm cache clean --force`
- Удалите `node_modules` и `package-lock.json`, затем снова запустите `npm install`

---

## 💻 Шаг 4: Запуск проекта

### Режим разработки (с автоматическим обновлением)

```bash
npm run dev
```

После запуска вы увидите:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Откройте браузер и перейдите по адресу: **http://localhost:5173/**

**Особенности режима разработки:**
- Автоматическое обновление при изменении кода
- Подробные сообщения об ошибках
- Горячая перезагрузка (HMR)

**Для остановки сервера:** нажмите `Ctrl+C` в терминале

### Продакшен-сборка (оптимизированная версия)

```bash
npm run build
```

Эта команда:
- Создаст папку `dist` с оптимизированными файлами
- Минифицирует CSS и JavaScript
- Подготовит проект для размещения на хостинге

**Для просмотра собранной версии:**
```bash
npm run preview
```

Откройте браузер: **http://localhost:4173/**

---

## 🌐 Шаг 5: Размещение в интернете (опционально)

### Вариант 1: Vercel (рекомендуется)

1. Зарегистрируйтесь на https://vercel.com/
2. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. В папке проекта выполните:
   ```bash
   vercel
   ```
4. Следуйте инструкциям
5. Получите ссылку вида: `https://ваш-проект.vercel.app`

### Вариант 2: Netlify

1. Зарегистрируйтесь на https://www.netlify.com/
2. Установите Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Соберите проект:
   ```bash
   npm run build
   ```
4. Разместите:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Вариант 3: GitHub Pages

1. Создайте репозиторий на GitHub
2. Загрузите проект:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <URL-репозитория>
   git push -u origin main
   ```
3. Установите gh-pages:
   ```bash
   npm install -D gh-pages
   ```
4. Добавьте в `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
5. Разместите:
   ```bash
   npm run build
   npm run deploy
   ```

---

## 🐛 Решение проблем

### Проблема: `npm: command not found`

**Решение:** Node.js не установлен или не добавлен в PATH
- Переустановите Node.js
- Перезагрузите терминал/компьютер
- Проверьте установку: `node --version`

### Проблема: `EACCES: permission denied`

**Решение:** Недостаточно прав
- **Windows:** Запустите командную строку от имени администратора
- **macOS/Linux:** Используйте `sudo` или измените права:
  ```bash
  sudo chown -R $USER ~/.npm
  ```

### Проблема: Порт 5173 уже используется

**Решение:**
```bash
# Запустить на другом порту
npm run dev -- --port 3000
```

### Проблема: Белый экран в браузере

**Решение:**
1. Откройте консоль браузера (F12)
2. Проверьте ошибки
3. Пересоберите проект:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   npm run dev
   ```

### Проблема: Медленная работа npm install

**Решение:** Используйте зеркало npm:
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 📱 Запуск на мобильном устройстве

### Локальная сеть (тестирование)

1. Запустите сервер с доступом из сети:
   ```bash
   npm run dev -- --host
   ```
2. Узнайте IP-адрес компьютера:
   - **Windows:** `ipconfig` → IPv4-адрес
   - **macOS/Linux:** `ifconfig` или `ip addr`
3. На мобильном устройстве откройте:
   ```
   http://ВАШ_IP:5173
   ```

---

## 📂 Структура проекта

```
историческая-библиотека/
├── index.html              # Главная HTML-страница
├── package.json            # Зависимости проекта
├── vite.config.js          # Конфигурация Vite
├── tsconfig.json           # Конфигурация TypeScript
├── README.md               # Основная документация
├── INSTALL.md              # Эта инструкция
├── DEVLOG.md               # Дневник разработки
├── src/                    # Исходный код
│   ├── main.tsx           # Точка входа
│   ├── App.tsx            # Главный компонент
│   ├── index.css          # Стили
│   └── data/              # Данные учебников
│       ├── types.ts       # TypeScript типы
│       ├── textbook.ts    # История России
│       ├── worldHistory.ts # Всеобщая история
│       └── index.ts       # Функции работы с данными
└── dist/                   # Собранная версия (после npm run build)
```

---

## 🎓 Полезные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр собранной версии
npm run preview

# Проверка типов TypeScript
npm run type-check

# Форматирование кода (если настроено)
npm run format

# Линтинг кода (если настроено)
npm run lint
```

---

## 📞 Поддержка

Если у вас возникли проблемы:
1. Проверьте версию Node.js: `node --version` (должна быть 18+)
2. Убедитесь, что все зависимости установлены: `npm install`
3. Очистите кэш: `npm cache clean --force`
4. Пересоберите проект: `rm -rf node_modules && npm install`

---

## ✅ Чек-лист успешной установки

- [ ] Node.js установлен (версия 18+)
- [ ] npm установлен
- [ ] Проект скачан/клонирован
- [ ] Зависимости установлены (`npm install`)
- [ ] Сервер запускается (`npm run dev`)
- [ ] Приложение открывается в браузере (http://localhost:5173/)

---

**Готово!** Теперь вы можете изучать историю с помощью «Исторической Библиотеки» 📚
