import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";


function Input() {
 
  const [inputText, setInputText] = React.useState("");
  function handleText(event) {
    setInputText(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3000/", { newItem: inputText });
      setInputText("");

      setTimeout(() => {
        window.location.href = "http://localhost:5173/";
      }, ); 
    } catch (error) {
      console.error("Error submitting task:", error);
    }

  }

  return (
    <div className="-skew-y-12 flex justify-center items-center ">
      <form  action="http://localhost:3000/" method="post" onSubmit={handleSubmit}>
        <input
          onChange={handleText}
          className="text-center bg-white shadow px-2 py-1 rounded text-sm font-semibold focus:outline-none"
          type="text"
          name="newItem"
          placeholder="Add your tasks here"
          value={inputText}
        />
        {inputText ? (
          <button type="submit">
            <CheckIcon />
          </button>
        ) : null}
      </form>
    </div>
  );
}

export default Input;
