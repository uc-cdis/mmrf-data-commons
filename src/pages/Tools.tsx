import React from 'react';
import PageTitle from '@/components/PageTitle';
import { Card, Container, Text } from '@mantine/core';
import MainNavigation from '@/components/Navigation/MainNavigation';

const Tools = () => {
  return (
    <>
      <PageTitle pageName="Tools" />
      <MainNavigation />
      <Container className="flex justify-center align-middle h-[300px] p-12">
        <Card
          shadow="sm"
          padding="lg"
          className="w-[500px] text-center bg-mmrf-platinum text-mmrf-purple"
        >
          <Text size="lg" component="h1">
            Tools Page
          </Text>
        </Card>
      </Container>
    </>
  );
};

export default Tools;
