import { expect } from '@jest/globals';
import mockDb from 'mock-knex';
import { format } from 'sql-formatter';
import CaptureRepository from './CaptureRepository';
import Session from './Session';

function toBeSQL(actual, target) {
  return this.utils.equals(format(actual), format(target));
}

expect.extend({
  toBeSQL,
});

describe('CaptureRepository', () => {
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
      expect(format(query.sql.replace(/\$/g, 'var'))).toBeSQL(
        format(
          `select
        treetracker.capture.*,
        t.tags,
        field_data.device_configuration.device_identifier,
        field_data.device_configuration.manufacturer AS device_manufacturer,
        field_data.device_configuration.model AS device_model,
        field_data.device_configuration.device AS device_type,
        field_data.device_configuration.os_version AS device_os_version
,
        treetracker.grower_account.wallet,
        regions.region.properties AS region_properties
        FROM treetracker.capture
          LEFT JOIN treetracker.grower_account
            ON grower_account.id = treetracker.capture.grower_account_id
          LEFT JOIN (
            SELECT ct.capture_id, ARRAY_AGG(t.name) AS tags
            FROM treetracker.capture_tag ct
            JOIN treetracker.tag t ON t.id = ct.tag_id
            GROUP BY ct.capture_id
          ) t ON treetracker.capture.id = t.capture_id
          LEFT JOIN field_data.device_configuration
            ON field_data.device_configuration.id = treetracker.capture
.device_configuration_id
          LEFT JOIN regions.region
            ON ST_WITHIN(capture.estimated_geometric_location, regions.
region.shape)
      where "capture"."id" = $1 limit $2`.replace(/\$/g, 'var'),
        ),
      );
      query.response([{ id: 'uuid' }]);
    });

    const repo = new CaptureRepository(session);
    const result = await repo.getById('uuid');
    expect(result).toMatchObject({
      id: 'uuid',
    });
  });
});
