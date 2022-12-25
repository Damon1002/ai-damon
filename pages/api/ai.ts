// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { configuration } from "../../utils/constants";
import { OpenAIApi } from "openai";

type Data = {
  result: string;
};

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { input } = req.body;
  console.log("input", input);

  const response = await openai.createCompletion({
    model: "text-davinci-003",

    // 这里的input就是在index 文件中的state variable input，也就是用户在前段输入了什么样的问题
    prompt: input,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const suggestion = response.data?.choices?.[0].text;

  if (suggestion === undefined) throw new Error("No suggestion found");

  res.status(200).json({ result: suggestion });
}
