import { useState } from "react";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { Popup } from "./popup";

export const NamePrompt = () => {
  const session = useSession();
  const updateName = api.books.setName.useMutation({
    onSuccess() {
      window.location.reload();
    },
  });
  const [name, setName] = useState("");
  return (
    <Popup
      isOpen={session.status === "authenticated" && !session.data?.user?.name}
      title="What's your name?"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-4 py-2"
      />
      <button
        className="float-right mt-4 border-none bg-slate-600 px-4 py-2 text-white"
        onClick={() => updateName.mutate({ name })}
      >
        Save name
      </button>
    </Popup>
  );
};
