# query-anecdotes (ejercicios 6.16 a 6.22)

Anécdotas con TanStack Query:

- `useQuery` para cargar las anécdotas, con un mensaje si el servidor no responde.
- Mutaciones para crear y votar que actualizan la caché sin volver a pedir la lista.
- Avisos con `useReducer` y Context (`src/NotificationContext.jsx`), también para los errores del servidor (por ejemplo, una anécdota demasiado corta).

```bash
npm install
npm run server
npm run dev
```
