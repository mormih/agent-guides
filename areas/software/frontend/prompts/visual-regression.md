# Prompt: `/visual-regression`

## Ustanovit baseline (pervyy zapusk)

```
/visual-regression --baseline

Pervyy zapusk visual regression dlya etogo proekta.
Sozday baseline screenshots dlya vsekh Storybook stories.
Viewports: 375px (mobile), 768px (tablet), 1440px (desktop).
Sokhranit v: tests/visual-snapshots/
```

## Sravnenie v PR

```
/visual-regression --compare

Zapusti sravnenie dlya komponentov, zatronutykh tekushchim PR.
Porog: izmenenie > 0.1% pikseley = DIFF.
Sformiruy HTML-otchet s side-by-side i dobav summary v PR comment.
```

## Odobrit namerennye izmeneniya

```
/visual-regression --approve

Obnovili tsvetovuyu skhemu brenda: brand-500 #2563eb → #3b82f6.
Odobri diff'y v komponentakh: Button, Badge, Link, Alert.
Obnovi baseline snapshots dlya etikh komponentov.
```
