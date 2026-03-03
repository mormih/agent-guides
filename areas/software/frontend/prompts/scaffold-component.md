# Prompt: `/scaffold-component`

## Minimalnyy

```
/scaffold-component ButtonGroup
```

## Standartnyy

```
/scaffold-component SearchInput --type molecule --with-story

Komponent: poiskovaya stroka s ikonkoy i knopkoy ochistki.
Props: value, onChange, onSearch, placeholder, isLoading.
Debounce 300ms na vyzov onSearch.
Story: varianty default / with-value / loading / disabled.
Testy: render, vvod teksta, debounce, ochistka, keyboard Enter.
```

## S detalnym kontekstom

```
/scaffold-component UserAvatarDropdown --type organism --with-story

Komponent: avatar polzovatelya, pri klike — vypadayushchee menyu.
Props: user: { id, name, avatarUrl }, onLogout: () => void.
Punkty menyu: Profile → /profile, Settings → /settings, Logout → onLogout().
Pattern: compound components (UserAvatarDropdown.Trigger + UserAvatarDropdown.Menu).
Zakrytie: klik vne komponenta + klavisha Escape.
A11y: aria-label na trigger, role="menu" na spisok, focus management pri otkrytii/zakrytii.
Testy: render, otkrytie/zakrytie, navigatsiya po punktam, vyzov onLogout.
```
