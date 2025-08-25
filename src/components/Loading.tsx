import { Center, Loader } from '@mantine/core';

export const Loading = (): React.JSX.Element => {
  return (
    <Center style={{ width: '100%', height: '300px' }}>
      <Loader />
    </Center>
  );
};
