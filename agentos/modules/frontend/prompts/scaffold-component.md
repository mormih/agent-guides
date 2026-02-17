# Prompt: `/scaffold-component`

## Минимальный

```
/scaffold-component ButtonGroup
```

## Стандартный

```
/scaffold-component SearchInput --type molecule --with-story

Компонент: поисковая строка с иконкой и кнопкой очистки.
Props: value, onChange, onSearch, placeholder, isLoading.
Debounce 300ms на вызов onSearch.
Story: варианты default / with-value / loading / disabled.
Тесты: рендер, ввод текста, debounce, очистка, keyboard Enter.
```

## С детальным контекстом

```
/scaffold-component UserAvatarDropdown --type organism --with-story

Компонент: аватар пользователя, при клике — выпадающее меню.
Props: user: { id, name, avatarUrl }, onLogout: () => void.
Пункты меню: Profile → /profile, Settings → /settings, Logout → onLogout().
Паттерн: compound components (UserAvatarDropdown.Trigger + UserAvatarDropdown.Menu).
Закрытие: клик вне компонента + клавиша Escape.
A11y: aria-label на trigger, role="menu" на список, focus management при открытии/закрытии.
Тесты: рендер, открытие/закрытие, навигация по пунктам, вызов onLogout.
```
