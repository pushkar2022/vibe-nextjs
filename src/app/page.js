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
      const res = await fetch('/api/inngest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inputs }),
      });

      const data = await res.json();
      alert(`Event Triggered! ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Failed to trigger function', error);
    }
  };
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
      <Button onClick={handleClick} >
        Invoke Background 
      </Button>
    </div>
  );
}

export default Page;
