# NEO-WEAR Futuristic Shop

Ein minimalistischer, futuristischer Clothing-Shop mit Vanilla JS Frontend und Node.js/Express Backend.

## Struktur
- **project/frontend**: HTML, CSS, JS sowie Assets (Logo und 20 Dummy-Produktbilder)
- **project/backend**: Express-Server mit MVC-Struktur und API-Routen
- **project/package.json**: Startet den Server mit `npm start`

## Features
- Mehrseitiges Frontend (Home, Shop, Product, Checkout) mit sanften Animationen, Hover-Transitions und Parallax-Details
- Responsives Layout mit Grid/Flex und Burger-Menü
- Warenkorb mit `localStorage` (Add/Remove/Quantity, Live-Badge, Gesamtpreis)
- Backend-API: `GET /api/products`, `GET /api/products/:id`, `POST /api/checkout` (speichert Bestellungen in `backend/data/orders.json`)

## Start
```bash
cd project
npm install
npm start
```
Der Server liefert Frontend und API unter http://localhost:3000.
