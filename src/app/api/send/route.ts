import { inngest } from "../../../inngest/client";

export async function POST(req: Request): Promise<Response> {
  const { email } = await req.json();

 let data= await inngest.send({
    name: "test/hello.world", 
    data: { info:email },
  });
  console.log(')9)9)99999',data)

  return new Response(JSON.stringify({ status: data }), {
    status: 200,
  });
}
