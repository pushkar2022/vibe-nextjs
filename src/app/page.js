"use client";

import { Input } from '../components/ui/input';
// import { Input } from '@/components/ui/input';
import { Button } from '../components/ui/button';
import React, { useState } from 'react';

function Page() {
  const [inputs,setInputs]=useState('')
  // const handleClick = () => {
  //   alert(`Button clicked!${inputs}`);
  // };

    const handleClick = async () => {
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inputs }),
      });

      const data = await res.json();
      console.log(data)
      // alert(`Event Triggered! ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Failed to trigger function', error);
    }
  };
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
    <div className=" max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
      <Input value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
      <Button onClick={handleClick} >
        Submit
      </Button>
    </div>
    </div>
  );
}

export default Page;
