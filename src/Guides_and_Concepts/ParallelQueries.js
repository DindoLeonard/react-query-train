import React from 'react';
import { useQuery, useQueries } from 'react-query';
import {
  fetchUsers,
  fetchTeams,
  fetchProjects,
  fetchUserById,
} from './imaginary-api-function';

const ParallelQueries = ({ users }) => {
  // The following queries will execute in parallel
  const usersQuery = useQuery('users', fetchUsers);
  const teamsQuery = useQuery('teams', fetchTeams);
  const projectsQuery = useQuery('projects', fetchProjects);

  // useQueries accepts an array of query options objects and returns an array of query results:
  const userQueries = useQueries(
    users.map((user) => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchUserById(user.id),
      };
    })
  );

  return <div>Parallel Queries</div>;
};

export default ParallelQueries;
