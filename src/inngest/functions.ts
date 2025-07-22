import { inngest } from "./client";
import { createAgent, createTool, openai } from '@inngest/agent-kit';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log('event.dataevent.info',event.data.info)
    const summarizer = createAgent({
      name: 'summarizer',
      system:
        'You are an expert summarizer. You can summarize text into a few sentences.',
      model: openai({model:'gpt-4o'}),
    });
    const { output } = await summarizer.run(
      'Summarize the following text: apple',
    );
    console.log('outputoutput',output)
    // await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!` };
  },
);