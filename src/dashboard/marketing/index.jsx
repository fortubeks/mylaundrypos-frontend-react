import TabHead from "../../utils/TabHead";
import { useState } from "react";
import toast from "../../utils/Toast";
import { Input } from "../../utils/Input";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[20px]">
      <TabHead name="Settings" size="14px"></TabHead>
      <div className="flex flex-col overflow-y-auto p-5 gap-5">
        <div className="flex flex-col md:grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span>Email Subject</span>
              <div className="relative bg-[#F6F6F6] w-full rounded-xl flex items-center">
                <Input selected={email} setSelected={setEmail} />
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span>Title</span>
              <div className="relative bg-[#F6F6F6] w-full rounded-xl flex items-center">
                <Input selected={title} setSelected={setTitle} />
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span>Message</span>
              <div className="relative bg-[#F6F6F6] w-full rounded-xl flex items-center">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                  className="w-full h-16 bg-transparent outline-none p-2"
                ></textarea>
              </div>
            </label>
          </div>
          <div className="border bg-gray-300 rounded-2xl p-4">
            <h2>Template area</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
