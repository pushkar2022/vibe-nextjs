"use client";

import { Button } from '../components/ui/button';
import React from 'react';

function Page() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div>
      <Button onClick={handleClick} variant="default">
        Click Me
      </Button>
    </div>
  );
}

export default Page;
