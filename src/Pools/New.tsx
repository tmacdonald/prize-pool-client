import { useState } from "react";
import { poolStorage } from "../services/pools";
import { useNavigate } from "react-router";
import { useCrudStorage } from "../services/hooks";

export const NewPool = () => {
  const { createItem } = useCrudStorage(poolStorage);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = name.toLocaleLowerCase().replace(/\s+/, "-");
    await createItem({ id, name });
    navigate("/pools");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={"key"}>Key</label>
      <input
        type={"text"}
        name={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type={"submit"}>Create</button>
    </form>
  );
};
