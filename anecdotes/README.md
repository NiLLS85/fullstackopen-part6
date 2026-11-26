# anecdotes (ejercicios 6.2 a 6.15)

Anécdotas con el estado en Zustand (`src/store.js`):

- Votar, crear y borrar anécdotas (solo las que no tienen votos), ordenadas por votos.
- Filtro por texto y avisos temporales en un segundo almacén (`src/notificationStore.js`).
- Datos en json-server con `fetch` (`src/services/anecdotes.js`).
- Pruebas del almacén con Vitest, simulando el servicio (`src/store.test.jsx`).

```bash
npm install
npm run server   # json-server en http://localhost:3001
npm run dev
npm test
```
