import { useQuery } from 'react-query';

const DependentQueries = ({ email, getUserByEmail, getProjectsByUser }) => {
  // Get the user
  const { data: user } = useQuery(['user', email], getUserByEmail);

  const userId = user?.id;

  // Then get the user's projects
  const { isIdle, data: projects } = useQuery(
    ['projects', userId],
    getProjectsByUser,
    {
      // The query will not execute until the userId exists
      enabled: !!userId,
    }
  );

  console.log(isIdle, projects);

  // isIdle will be `true` until `enabled` is true and the query begins to fetch.
  // It will then go to the `isLoading` stage and hopefully the `isSuccess` stage :)
};

export default DependentQueries;
