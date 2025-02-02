import log from 'loglevel';
import FilterOptions from 'interfaces/FilterOptions';
import Species from 'interfaces/Species';
import { delegateRepository } from '../infra/database/delegateRepository';
import SpeciesRepositoryV2 from '../infra/database/SpeciesRepositoryV2';

type Filter = Partial<{
  planter_id: number;
  organization_id: number;
  wallet_id: string;
  grower_id: string;
}>;

function getByFilter(
  speciesRepository: SpeciesRepositoryV2,
): (filter: Filter, options: FilterOptions) => Promise<Species[]> {
  return async function (filter: Filter, options: FilterOptions) {
    if (filter.organization_id) {
      log.warn('using org filter...');
      const trees = await speciesRepository.getByOrganization(
        filter.organization_id,
        options,
      );
      return trees;
    }
    if (filter.planter_id) {
      log.warn('using planter filter...');
      const trees = await speciesRepository.getByPlanter(
        filter.planter_id,
        options,
      );
      return trees;
    }

    if (filter.wallet_id) {
      log.warn('using wallet filter...');
      const trees = await speciesRepository.getByWallet(
        filter.wallet_id,
        options,
      );
      return trees;
    }
    if (filter.grower_id) {
      log.warn('using grower filter...');
      const trees = await speciesRepository.getByGrower(
        filter.grower_id,
        options,
      );
      return trees;
    }

    const trees = await speciesRepository.getByFilter(filter, options);
    return trees;
  };
}
function countByFilter(
  speciesRepository: SpeciesRepositoryV2,
): (filter: Filter) => Promise<number> {
  return async function (filter: Filter) {
    if (filter.organization_id) {
      log.warn('using org filter...');
      const total = await speciesRepository.countByOrganization(
        filter.organization_id,
      );
      return total;
    }
    const total = await speciesRepository.countByFilter(filter);
    return total;
  };
}
export default {
  getById: delegateRepository<SpeciesRepositoryV2, Species>('getById'),
  getByGrower: delegateRepository<SpeciesRepositoryV2, Species>('getByGrower'),
  getByFilter,
  countByFilter,
};
