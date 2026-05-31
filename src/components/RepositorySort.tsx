import { HStack, Text, Button, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type SortOption = 'created' | 'updated' | 'pushed' | 'full_name';

interface RepositorySortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const RepositorySort = ({ currentSort, onSortChange }: RepositorySortProps) => {
  const { t } = useTranslation();
  const sortOptions: SortOption[] = ['created', 'updated', 'pushed', 'full_name'];

  return (
    <HStack spacing={2} align="center" w="full" justify="space-between" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
      <Text fontWeight="bold" fontSize="sm">{t('profile.sortBy')}:</Text>
      <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={2} w={{ base: 'full', sm: 'auto' }}>
        {sortOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={currentSort === option ? 'solid' : 'outline'}
            colorScheme="blue"
            onClick={() => onSortChange(option)}
          >
            {t(`profile.sortOptions.${option}`)}
          </Button>
        ))}
      </SimpleGrid>
    </HStack>
  );
};

export default RepositorySort;
