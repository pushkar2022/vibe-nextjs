"use client";

import { Input } from '../components/ui/input';
// import { Input } from '@/components/ui/input';
import { Button } from '../components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
  const router=useRouter()
  const [inputs,setInputs]=useState('')
  const [leftSection,setLeftSection]=useState()
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
      // console.log(])
      // router.push(`/projects/${data?.ids?.[0]}`)
      router.push(`/projects/${data?.status?.ids?.[0]}`)
      
      // alert(`Event Triggered! ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Failed to trigger function', error);
    }
  };
  const getAllmesaages=async()=>{
  let res=  await fetch('/api/getMessage',{
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data=await res.json()
    setLeftSection(data?.messages
    )
    console.log("----",data)
  }
  useEffect(()=>{
    getAllmesaages()

  },[])
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
    <div className=" max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
      <Input value={inputs} onChange={(e)=>setInputs(e.target.value)}/>
      <Button onClick={handleClick} >
        Submit
      </Button>
      {leftSection?.map((item)=>{
        return(
          <>
          <p>{item?.content}</p>
          
          </>

        )
      })}
    </div>
    </div>
  );
}

export default Page;
