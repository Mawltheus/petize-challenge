import { Box, Container, Heading, Input, Button, VStack, Text, useToast, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { UserSchema } from '../schemas/github';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const user = UserSchema.parse(response.data);
      navigate(`/profile/${user.login}`);
    } catch (error) {
      toast({
        title: t('home.userNotFound'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'pt' : 'en');
  };

  return (
    <Container maxW="container.md" centerContent py={20}>
      <VStack spacing={8} w="full">
        <Button onClick={toggleLanguage} alignSelf="flex-end" size="sm" variant="ghost">
          {i18n.language === 'en' ? 'PT-BR' : 'EN-US'}
        </Button>
        <Heading size="2xl">{t('home.title')}</Heading>
        <Box as="form" onSubmit={handleSearch} w="full">
          <VStack spacing={4}>
            <Input
              placeholder={t('home.searchPlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="lg"
              bg="white"
            />
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="full"
              isLoading={isLoading}
            >
              {t('home.searchButton')}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home;
