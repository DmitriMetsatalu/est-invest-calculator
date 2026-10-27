# Est Invest Calculator · PIP

Статический Telegram Mini App: лимитные входы, средняя цена, тейки, стоп, размер позиции и маржа. Последняя версия с анимацией цифр и без кнопки копирования всего плана.

## Публикация на GitHub Pages

1. Создать репозиторий `est-invest-calculator` в аккаунте DmitriMetsatalu. Для GitHub Free выбрать Public.
2. Загрузить СОДЕРЖИМОЕ этой папки в корень репозитория: index.html должен быть в корне, assets — отдельной папкой рядом.
3. Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save.
4. Дождаться успешного Pages deployment. Ожидаемый адрес: https://dmitrimetsatalu.github.io/est-invest-calculator/ . Этот адрес не считается опубликованным, пока GitHub не завершит deployment.
5. Проверить сайт в браузере и из Беларуси.
6. В BotFather для @EstInvestCalculatorBot заменить Main Mini App URL, а также URL Menu Button на новый адрес.

GitHub Pages не требует npm, сборки или секретов. Репозиторий не содержит токена Telegram. .nojekyll отключает обработку Jekyll.

## Настройки пользователя

Хранилище браузера привязано к адресу сайта: локальные настройки со старого домена автоматически не переедут. Приложение продолжает использовать прежний ключ Telegram CloudStorage, если этот API доступен для запуска и версии клиента.

## Ресурсы и проверки

Расчёты и картинки размещены в репозитории. Внешние подключения: Telegram WebApp SDK и Google Fonts (Nunito); при недоступности шрифта используется системный fallback.
Реальная доступность GitHub Pages из Беларуси пока не проверена.

Локальная проверка: `python3 -m http.server 4174`, открыть http://localhost:4174/.
