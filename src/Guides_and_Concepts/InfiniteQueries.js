import React from 'react';
import { useInfiniteQuery } from 'react-query';

const InfiniteQueries = () => {
  const fetchProjects = async ({ pageParam = 0 }) => {
    try {
      const response = await fetch(
        `https://reqres.in/api/users?page=${pageParam}`
      );
      return await response.json();
    } catch (e) {
      throw new Error(e);
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('users', fetchProjects, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;

      return false;
    },
  });

  const skipToPageTwo = () => {
    fetchProjects({ pageParam: 2 });
  };

  if (isFetching) return <div>isFetching</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      {data.pages.map((page) =>
        page.data.map((user, i) => (
          <p key={i}>
            {user.first_name} {user.last_name}
          </p>
        ))
      )}
      {isFetchingNextPage && <div>Loading...</div>}
      {hasNextPage && <button onClick={fetchNextPage}>loadMore</button>}
      {<button onClick={skipToPageTwo}>page 2</button>}
    </div>
  );
};

export default InfiniteQueries;
