import {
  Box,
  Container,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Button,
  Link,
  Badge,
  Grid,
  SimpleGrid,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  User,
  Repository,
  UserSchema,
  RepositorySchema,
} from "../schemas/github";
import { z } from "zod";
import RepositorySort, { SortOption } from "../components/RepositorySort";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}`,
      );
      setUser(UserSchema.parse(response.data));
    } catch (error) {
      navigate("/");
    }
  }, [username, navigate]);

  const fetchRepos = useCallback(
    async (isInitial = false) => {
      const currentPage = isInitial ? 1 : page;
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos?per_page=10&page=${currentPage}&sort=${sortBy}`,
        );
        const parsedRepos = z.array(RepositorySchema).parse(response.data);

        if (isInitial) {
          setRepos(parsedRepos);
          setPage(2);
        } else {
          setRepos((prev) => [...prev, ...parsedRepos]);
          setPage((prev) => prev + 1);
        }

        if (parsedRepos.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        setHasMore(false);
      }
    },
    [username, page, sortBy],
  );

  useEffect(() => {
    fetchUser();
    fetchRepos(true);
  }, [username]);

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setPage(1);
    setHasMore(true);
    fetchRepos(true);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "pt" : "en");
  };

  if (!user)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Box>
    );

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <IconButton
            aria-label="Back"
            icon={<ArrowLeft />}
            onClick={() => navigate("/")}
            variant="ghost"
          />
          <Button onClick={toggleLanguage} size="sm" variant="ghost">
            {i18n.language === "en" ? "PT-BR" : "EN-US"}
          </Button>
        </HStack>

        <HStack
          spacing={8}
          align="start"
          flexDir={{ base: "column", md: "row" }}
        >
          <Avatar
            size="2xl"
            src={user.avatar_url}
            name={user.name || user.login}
          />
          <VStack align="start" spacing={4} flex={1} w="full">
            <VStack align="start" spacing={1}>
              <Heading size="lg">{user.name || user.login}</Heading>
              <Text color="gray.500">@{user.login}</Text>
            </VStack>
            <Text>{user.bio || t("profile.noDescription")}</Text>
            <HStack spacing={4}>
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{user.followers}</Text>
                <Text fontSize="sm" color="gray.500">
                  {t("profile.followers")}
                </Text>
              </VStack>
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{user.following}</Text>
                <Text fontSize="sm" color="gray.500">
                  {t("profile.following")}
                </Text>
              </VStack>
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{user.public_repos}</Text>
                <Text fontSize="sm" color="gray.500">
                  {t("profile.repositories")}
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={4} flexWrap="wrap">
              {user.blog && (
                <Button
                  as={Link}
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  isExternal
                  size="sm"
                  colorScheme="blue"
                >
                  {t("profile.visitBlog")}
                </Button>
              )}
              {user.twitter_username && (
                <Button
                  as={Link}
                  href={`https://twitter.com/${user.twitter_username}`}
                  isExternal
                  size="sm"
                  colorScheme="twitter"
                >
                  {t("profile.visitTwitter")}
                </Button>
              )}
            </HStack>
          </VStack>
        </HStack>

        <Box borderBottom="1px" borderColor="gray.200" pb={4}>
          <RepositorySort
            currentSort={sortBy}
            onSortChange={handleSortChange}
          />
        </Box>

        <InfiniteScroll
          dataLength={repos.length}
          next={() => fetchRepos(false)}
          hasMore={hasMore}
          loader={
            <Box textAlign="center" py={4}>
              <Spinner />
            </Box>
          }
          endMessage={
            <Box textAlign="center" py={4}>
              <Text color="gray.500">{t("profile.noMoreRepos")}</Text>
            </Box>
          }
        >
          <VStack spacing={4} align="stretch">
            {repos.map((repo) => (
              <Box
                key={repo.id}
                p={5}
                shadow="sm"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2} flex={1}>
                    <Link
                      href={repo.html_url}
                      isExternal
                      fontWeight="bold"
                      color="blue.500"
                      fontSize="lg"
                    >
                      {repo.name}
                    </Link>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {repo.description || t("profile.noDescription")}
                    </Text>
                    <HStack spacing={4}>
                      {repo.language && (
                        <Badge colorScheme="blue" variant="subtle">
                          {repo.language}
                        </Badge>
                      )}
                      <Text fontSize="xs" color="gray.500">
                        {t("profile.sortOptions.updated")}:{" "}
                        {new Date(repo.updated_at).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>
                  <HStack spacing={4}>
                    <VStack spacing={0}>
                      <Text fontWeight="bold" fontSize="sm">
                        {repo.stargazers_count}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Stars
                      </Text>
                    </VStack>
                    <VStack spacing={0}>
                      <Text fontWeight="bold" fontSize="sm">
                        {repo.forks_count}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Forks
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </InfiniteScroll>
      </VStack>
    </Container>
  );
};

export default Profile;
