import React from 'react';
import { Body, Html, Container, Tailwind, Text, Button, Img, Heading, Head } from '@react-email/components';

const EmailTemplate = () => {
  let user = 'Jane'
  let date ='August 2023'

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body>
          <Container>
            <Heading className='py-3 text-xl font-bold'>Hello {user}</Heading>

            <Text className='py-3 text-base'>Thank you for using SchoolWave!</Text>

            <Text className='py-3 text-base'>You can find the invoice for {date} attached. </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplate;