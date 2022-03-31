import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {

  const result = await knex('changelog').select('id').where({id: 30});

  if (result.length) {
    // Migration has been applied using the old patch system
    return;
  }
  await knex('changelog').insert({
    id: 30,
    timestamp: Math.floor(Date.now()/1000)
  });

  await knex.raw(`INSERT INTO server_settings (setting, value) VALUES ('totp', '"optional"')`);


}

export async function down(knex: Knex): Promise<void> {

  throw new Error('This migration doesn\'t have a "down" script');

}
