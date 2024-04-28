"use client"

import axios from "axios";
import {  useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status == "unauthenticated") {
    router.push('/api/auth/signin');
  }

  const isFirstWordAsk = (input: any) => {
    const words = input.trim().split(" ");
    if (words.length > 0 && words[0].startsWith('/ask')) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (isFirstWordAsk(input)) {
        console.log("true");
        const res = await axios.post("/api/ask-chat", { content: input });
        console.log(res.data[0].message.content);
        setOutput(res.data[0].message.content);
      } else {
        console.log(input);
        const res = await axios.post("/api/create-note", { content: input });
        setOutput("Note created successfully!, if you want to see your notes just type /ask followed by your question");
        console.log(res);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setInput("");
      setIsLoading(false);
    }
  }

  const deleteNotes = async () => {
    try {
      const res = await axios.post("/api/delete-note", { userId: "clvdv71n50000zlj6kt8f8rzg" });
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <main className="w-screen h-screen flex lg:gap-52 max-md:justify-center items-center bg-bg-color">
      <div className="h-screen w-20 flex flex-col items-center bg-black max-md:hidden">
        <Image src="/note-img.png" alt="note-icon" className="mt-5 cursor-pointer" onClick={() => router.push('/notes')} width={50} height={50}/>
      </div>
      <div className=" h-screen w-2/3 flex flex-col justify-between">
    
        <div className="mt-4">
          <h1 className="text-5xl text-headText">BigBrain</h1>
          <p className="w-96 mt-4 text-secText">no need to scroll endlessly to check your notes,
            just type what you want to remember and I’ll take care
            of everything else</p>
          <div className="bg-white text-lg h-auto w-2/3 rounded-lg mt-10">
            {
              output === '' ? (
                <h2 className="text-black p-2">Type your note and click submit</h2>
              ) : (
                <></>
              )
            }
            <h2 className="text-black p-2">{output}</h2>
          </div>
        </div>

        <div className="flex items-center mb-10 gap-6">
          <input type="text" className="w-full h-12 rounded-xl bg-inputColor p-1" onChange={(e) => {
            setInput(e.target.value);
            console.log(input);
          }} value={input}/>
          <button className="w-20 rounded-lg bg-blue-950 p-3" onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>

      </div>
    </main>
  );
}