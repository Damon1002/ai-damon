import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";

// 新版本

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  // 字数超过60后，如果字数重新回到60以下，那么红色提醒文字消失

  useEffect(() => {
    if (input.length < 30) setError(false);
  }, [input]);

  const submit = async () => {
    // Check if character limit is exceeded

    // 如果下面没有return，即便字母超过60个，下面的function依然会执行
    if (input.length > 60) return setError(true);

    // Set loading state
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const suggestion: { result: string } = await res.json();
      const { result } = suggestion;
      console.log("Answer by AI is:", result);

      setSuggestion(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-1 ">
      <Head>
        <title>HUA AI </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col w-full lg:w-1/3 items-center justify-center">
        <h1 className="mt-3 mb-3 lg:mb-10 text-2xl lg:text-5xl font-extrabold text-transparent  bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
          HUA AI
        </h1>

        <div className="relative w-5/6 lg:w-full">
          {/* Error message */}
          {error && (
            <p className="text-xs py-1 text-red-500">
              Character limit exceeded, please enter less text!
            </p>
          )}
          <textarea
            id="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="block p-2.5 w-full text-sm lg:text-xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Write your questions here..."
          ></textarea>

          {/* words limit about 300 */}

          {/* 如果字数超过60字，右下角的字体变成红色，否则就是灰色 */}
          <div
            className={`absolute bottom-2 right-2 text-xs ${
              input.length > 60 ? `text-red-500` : `text-gray-500`
            } `}
          >
            <span>{input.length}</span>/60
          </div>
        </div>

        {/* <button
          type="button"
          onClick={submit}
          className="my-5  rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 duration-300"
        >
          Generating
        </button> */}
        <button
          type="button"
          onClick={submit}
          className="my-5 w-5/6 lg:w-1/3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-4">
              {/* <p>Loading...</p> */}
              {/* <MoonLoader size={20} color='white' /> */}
              <BeatLoader size={20} color="white" />
            </div>
          ) : (
            "Answer"
          )}
        </button>
        {/* Output field for marketing copy */}
        {suggestion && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold pb-2  text-transparent  bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
              Answer By Your AI Assistant:
            </h4>
            <div className="relative w-full rounded-md bg-gray-100 p-4">
              <p className="text-xl text-gray-700">
                {/* 如果答案是1，2，3，4.。。 直接用{suggestion}就不会把每一个数字后面分文字分段 */}
                {suggestion.split("\n").map((i, key) => {
                  return (
                    <div key={key} className="my-2">
                      {i}
                    </div>
                  );
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
