import mockDb from 'mock-knex';
import Session from './Session';
import TreeRepositoryV2 from './TreeRepositoryV2';

describe('TreeRepositoryV2', () => {
  const session = new Session();
  // eslint-disable-next-line
  const tracker = require('mock-knex').getTracker();
  beforeEach(() => {
    mockDb.mock(session.getDB());
    tracker.install();
  });

  afterEach(() => {
    mockDb.unmock(session.getDB());
  });

  it('getById', async () => {
    tracker.on('query', (query) => {
      expect(query.sql).toBe(
        'select * from "treetracker"."tree" where "id" = $1 limit $2',
      );
      query.response([{ id: 'uuid' }]);
    });

    const repo = new TreeRepositoryV2(session);
    const result = await repo.getById('uuid');
    expect(result).toMatchObject({
      id: 'uuid',
    });
  });

  it.only('getByOrganization ', async () => {
    tracker.on('query', (query) => {
      expect(query.sql).toBe(
        'select * from "treetracker"."tree" where "id" = $1 limit $2',
      );
      query.response([{ id: 'uuid' }]);
    });

    const repo = new TreeRepositoryV2(session);
    const result = await repo.getByOrganization('uuid', {
      offset: 0,
      limit: 1,
    });
    expect(result).toMatchObject({
      id: 'uuid',
    });
  });
});
