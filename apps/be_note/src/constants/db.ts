const postgres = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mantu_note',
};

const postgresProd = {
  host: 'containers-us-west-102.railway.app',
  port: 5499,
  password: 'S9trmSpztzwxtVl6Wxwa',
  username: 'postgres',
  database: 'railway',
};

export default process.env.NODE_ENV === 'development' ? postgres : postgresProd;
