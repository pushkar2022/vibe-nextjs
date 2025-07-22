import { z} from 'zod';

import { Sandbox } from '@e2b/code-interpreter'
import { inngest } from "./client";
import { createAgent,  openai } from '@inngest/agent-kit';
// import { createAgent,  } from 'e2b/agents';
import { createTool,createNetwork } from '@inngest/agent-kit';
import { zodToJsonSchema } from "zod-to-json-schema";
// import { z } from '@e2b/sdk';
import { getSanbox, lastAssistantTextMessagesContent } from './utils';

import { handler } from 'next/dist/build/templates/app-page';
import { PROMPT } from '../prompt';
const commandSchema = z.object({
  command: z.string(),
});
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // console.log('event.dataevent.info',event.data.info)
    const sandboxId=await step.run("get-sandbox-id",async()=>{
      // const sandbox = await Sandbox.create("vibe-nextjs-demo-1753197807");
   
      const sandbox = await Sandbox.create("vibe-nextjs-demo-1753197807", {
        apiKey: 'e2b_0104d6e74e413e7d51b89a24c249ed4d282477af',
      });
      return sandbox.sandboxId
    })
    const summarizer = createAgent({
      name: 'code-agent',
      description: 'An expert coding angent',
      system: PROMPT,

      model: openai({ model: 'gpt-4.1',
        defaultParameters:{
          temperature:0.1,
        }
       }),
      
   

      tools: [
        // Terminal tool
        createTool({
          name: 'terminal',
          description: 'Use the terminal to run commands',
          parameters: commandSchema,

          // parameters: {
          //   type: "object",
          //   properties: {
          //     command: { type: "string" },
          //   },
          //   required: ["command"],
          // },
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' };
    
              try {
                const sandbox = await getSanbox(sandboxId); // sandboxId should be in scope
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
    
                return result.stdout;
              } catch (e) {
                console.error(`Command failed: ${e}`);
                return `Error: ${e}`;
              }
            });
          },
        }),
    
        // File creation/update tool
        createTool({
          name: 'createOrUpdateFiles',
          description: 'Create or update files in the sandbox',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }) as any,
          handler: async ({files}, { step ,network}) => {
            return step?.run('createOrUpdateFiles', async () => {
              try {
                const updateFiles=network.state.data.files||{}
                const sandbox = await getSanbox(sandboxId); // ensure sandboxId is in scope
    
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path]=file.content
                }
                return updateFiles;
    
                // return `Successfully wrote ${files.length} file(s).`;
              } catch (e) {
                console.error(`File write failed: ${e}`);
                return `Error writing files: ${e}`;
              }
            });
          },
        }),



        createTool({
          name: 'readFiles',
          description: 'Read files from the sandbox',
          parameters: z.object({
            files: z.array(z.string()
             
            ),
          }) as  any,
          handler: async ({ files }, { step }) => {
           return await step?.run('readFiles', async () => {
            try{
              const sandbox = await getSanbox(sandboxId); // ensure sandboxId is in scope
              const  contents:any=[];
              for (const file of files) {
               const content=await sandbox.files.read(file);
               contents.push({path: file,content});
              }
              return JSON.stringify(contents)

            }catch(e){
              console.error(`Error reading files: ${e}`);
            }
           })
          },
        }),
      ],
      lifecycle:{
        onResponse: async({result,network})=>{
          const lastAssistantMessageText= lastAssistantTextMessagesContent(result);
          if(lastAssistantMessageText && network){
            if(lastAssistantMessageText.includes("<task_summary>")){
              network.state.data.summary=lastAssistantMessageText
            }
          }
          return result


        }
      }
    });
    const { output }:any = await summarizer.run(
      `Write the following snippet: ${event.data.info}`,
    );
    // console.log('outputoutput',output)

    const network=createNetwork({
      name: "coding-agent-network",
      agents: [summarizer],
      maxIter: 15,
      router: async ({network} )=>{
        const summary =network.state.data.summary;
        if(summary){
          return;
        }
        return summarizer;

      }
    })
    const result = await network.run(event.data.info)
    const sandboxUrl=await step.run("get-sendbox-url",async()=>{
      const sandbox=await getSanbox(sandboxId)
      const host= sandbox.getHost(3000)
      return `https://${host}`

    })
    console.log('sandboxUrl',sandboxUrl)
    // console.log('output',output)

    //  await step.sleep("wait-a-moment", "10s");
    return {output ,sandboxUrl };
  },
);