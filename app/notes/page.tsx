"use client"

import axios from "axios"
import { useEffect, useState } from "react"




const page = () => {

    const [notes, setNotes] = useState([]);



    useEffect(() => {
        const getNotes = async () => {
            try {
                const res = await axios.get("/api/get-notes");
                console.log(res.data);
                setNotes(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        getNotes();
    }, [])


    return (
        <main className="w-screen h-screen flex lg:gap-52 max-md:justify-center items-center bg-bg-color overflow-hidden">
            <div className="h-screen w-20 flex flex-col items-center bg-black max-md:hidden">
            </div>
            <div className=" h-screen w-screen flex flex-col justify-between">
                {notes.map((note: { _id: string, content: string }) => (
                    <div key={note._id} className="w-full h-20 flex justify-between items-center px-5">
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default page