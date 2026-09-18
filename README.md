# Ledger — Application de gestion de portefeuille

Application web de suivi de portefeuille d'actifs financiers (Next.js, TypeScript, Prisma, PostgreSQL).

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# puis renseigner DATABASE_URL et NEXTAUTH_SECRET

# 3. Créer les tables en base de données
npx prisma migrate dev --name init

# 4. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur http://localhost:3000.

## Tests

```bash
npm test          # exécution unique
npm run test:watch  # mode surveillance pendant le développement
```

Les tests couvrent en priorité `src/lib/calculations/`, le cœur métier de l'application (calcul du PRU, valorisation, performance). Toute modification de cette logique doit s'accompagner d'un test correspondant avant d'être fusionnée.

## Structure du projet

```
src/
├── app/            # pages et routes API (Next.js App Router)
├── components/     # composants d'interface réutilisables
├── lib/
│   ├── calculations/  # logique financière pure, testée unitairement
│   ├── db.ts          # client Prisma
│   └── auth.ts        # configuration NextAuth
└── types/          # types partagés
prisma/
└── schema.prisma   # schéma de base de données
tests/
└── calculations/   # tests unitaires
```

## Conventions

- **Commits** : suivre [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `test:`, `docs:`, ...).
- **Branches** : `main` (production), `dev` (intégration), `feature/xxx`, `fix/xxx`.
- **Nombres financiers** : toujours manipulés via `decimal.js`, jamais via le type `number` natif, pour éviter les erreurs d'arrondi.

## Roadmap

- **V1** : portefeuilles, actifs, transactions, cotation manuelle, tableau de bord — voir `prisma/schema.prisma` section V1.
- **V2** : objectifs d'allocation, synchronisation automatique des cours.
- **V3** : multi-devises, notifications, comparaison à un indice, mode conseiller.
