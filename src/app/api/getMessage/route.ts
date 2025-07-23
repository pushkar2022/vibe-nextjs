import { inngest } from "../../../inngest/client";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request): Promise<Response> {
  
      // const allMessages = await prisma.message.findMany();
      const allMessages = await prisma.message.findMany({
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              fragment: true, // this assumes Message has `fragment` relation name
            },
          });

  return new Response(JSON.stringify({ messages: allMessages }), {
    status: 200,
  });
}
