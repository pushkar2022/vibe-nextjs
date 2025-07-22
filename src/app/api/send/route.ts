import { inngest } from "../../../inngest/client";

export async function POST(req: Request): Promise<Response> {
  const { email } = await req.json();

  await inngest.send({
    name: "test/hello.world", 
    data: { info:email },
  });

  return new Response(JSON.stringify({ status: "Event triggered" }), {
    status: 200,
  });
}
