# Mantu Trainning: Note

## 📖 Requirements

- [NodeJS: 16](https://nodejs.org/en/)
- [Postgres](https://www.postgresql.org/download/)
- [Yarn (Optional)](https://yarnpkg.com/)

## ⚡️Quick start

- Clone this repository

- Ensure that PostgresDB has been installed or follow up [this url](https://hevodata.com/learn/docker-postgresql) to install PostgresDB via Docker then create a new database `mantu_note`

- Use [DBeaver](https://dbeaver.io/) to execute the script `db/execute.sql` to database `mantu_note`

- Install dependencies ```yarn install``` or ```npm install```

- Modify the backend config `apps/be_note/src/constants/db.ts`

```typescript
  const postgres = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'mantu_note',
  };
```

- Once the dependencies are installed, you can run ```yarn dev``` or ```npm run dev```
