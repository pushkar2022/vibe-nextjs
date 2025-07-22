import {Sandbox} from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";
import { json } from 'zod';

export  async function getSanbox(sandboxId:string) {
      const sandbox=await Sandbox.connect(sandboxId)
      return sandbox
      
}

export  function lastAssistantTextMessagesContent(mess:AgentResult) {
      
      const lastAssist=mess.output.findIndex((mesaages)=>mesaages.role==='assistant')
      const message=mess.output[lastAssist] as |TextMessage|undefined
      return message?.content?typeof message.content==='string'?message.content: message.content?.map((c)=>c.text).join(""):undefined;

}