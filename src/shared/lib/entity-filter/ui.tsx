import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const Container = ({ children }: Props) => {
  return <>{children}</>;
};
